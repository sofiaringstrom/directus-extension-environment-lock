import type {
  ActionHandler,
  FilterHandler,
  InitHandler,
  ApiExtensionContext,
  EventContext,
} from "@directus/types";
import { ForbiddenError } from "@directus/errors";

const LOGGER_PREFIX = "[directus-extension-environment-lock]:";
const DEFAULT_FILTERS = [
  "fields.create",
  "fields.update",
  "fields.delete",
  "collections.create",
  "collections.update",
  "collections.delete",
  "relations.create",
  "relations.update",
  "settings.update",
  "roles.create",
  "roles.update",
  "roles.delete",
  "policies.create",
  "policies.update",
  "policies.delete",
];

export default (
  {
    init,
    filter,
    action,
  }: {
    init: (event: string, handler: InitHandler) => void;
    filter: <T = unknown>(event: string, handler: FilterHandler<T>) => void;
    action: (event: string, handler: ActionHandler) => void;
  },
  { services, database, getSchema, env, logger }: ApiExtensionContext
) => {
  const lockedEnvironments = env.DIRECTUS_ENV_LOCKED || [];
  const whitelistedRoles = env.DIRECTUS_ENV_WHITELISTED_ROLES || [];
  const whitelistedTokens = env.DIRECTUS_ENV_WHITELISTED_TOKENS || [];
  const excludedFilters = env.DIRECTUS_ENV_EXCLUDE_FILTERS || [];
  const includeFilters = env.DIRECTUS_ENV_INCLUDE_FILTERS || [];

  // Store to track recent valid tokens
  const recentValidTokens = new Set<string>();
  let globalCleanupTimeout: NodeJS.Timeout | null = null;

  filter("authenticate", (accountability, { req }) => {
    const isSchemaOperation =
      req.url?.includes("/schema/") ||
      req.url?.includes("/collections") ||
      req.url?.includes("/fields") ||
      req.url?.includes("/relations") ||
      req.url?.includes("/settings") ||
      req.url?.includes("/roles") ||
      req.url?.includes("/policies") ||
      req.url?.includes("/permissions") ||
      req.url?.includes("/dashboards") ||
      req.url?.includes("/panels") ||
      req.url?.includes("/presets") ||
      req.url?.includes("/flows") ||
      req.url?.includes("/operations");

    if (isSchemaOperation && req.headers?.authorization) {
      const token = req.headers?.authorization?.replace("Bearer ", "");

      // check if token is whitelisted
      if (whitelistedTokens.includes(token)) {
        // If this token already has a cleanup timeout, clear it
        if (globalCleanupTimeout) {
          clearTimeout(globalCleanupTimeout);
        }

        recentValidTokens.add(token);

        // Clean up after 1 minute
        globalCleanupTimeout = setTimeout(() => {
          recentValidTokens.delete(token);
          globalCleanupTimeout = null;
        }, 60000);
      }

      return accountability;
    }
  });

  const getFilters = (
    includeFiltersStr: string | string[],
    excludeFiltersStr: string | string[]
  ): string[] => {
    // parse incldue fitlers
    const includeFilters = Array.isArray(includeFiltersStr)
      ? includeFiltersStr
      : includeFiltersStr
      ? includeFiltersStr
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    // parse exclude filters
    const excludeFilters = Array.isArray(excludeFiltersStr)
      ? excludeFiltersStr
      : excludeFiltersStr
      ? excludeFiltersStr
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    // merge DEFAULT_FILTERS with includeFilters
    const mergedFilters = [...DEFAULT_FILTERS, ...includeFilters];

    // remove duplicates
    const uniqueFilters = [...new Set(mergedFilters)];

    // remove excluded filters
    const finalFilters = uniqueFilters.filter(
      (filterName) => !excludeFilters.includes(filterName)
    );

    return finalFilters;
  };

  const allowSchemaChange = (context: any) => {
    const role = context?.accountability?.role;

    if (role && whitelistedRoles.includes(role.id)) {
      logger.info(`${LOGGER_PREFIX} Whitelisted role - allowing schema change`);
      return true;
    }

    // Check if we recently validated a whitelisted token
    if (context.accountability === null && recentValidTokens.size > 0) {
      logger.info(
        `${LOGGER_PREFIX} Recent valid token detected - allowing schema change`
      );
      return true;
    }

    return false;
  };

  const blockSchemaChanges = (
    payload: unknown,
    meta: Record<string, any>,
    context: EventContext
  ) => {
    if (!allowSchemaChange(context)) {
      logger.warn(`${LOGGER_PREFIX} Blocked schema change: ${meta.event}`, {
        user: context.accountability?.user,
        role: context.accountability?.role,
      });

      throw new ForbiddenError({
        reason: `${LOGGER_PREFIX} Schema changes are locked in the "${env.ENVIRONMENT}" environment. Please make changes locally and deploy via directus-sync.`,
      });
    }

    return payload;
  };

  if (!lockedEnvironments.includes(env.ENVIRONMENT)) {
    logger.info(
      `${LOGGER_PREFIX} 🔓 Environment "${env.ENVIRONMENT}" is not locked. Schema changes allowed.`
    );
    return;
  }

  logger.info(
    `${LOGGER_PREFIX} 🔐 Environment "${env.ENVIRONMENT}" is LOCKED. Blocking schema mutations!`
  );

  const filters = getFilters(includeFilters, excludedFilters);

  logger.info(
    `${LOGGER_PREFIX} Registered ${
      filters.length
    } schema lock filters: ${filters.join(", ")}`
  );

  filters.forEach((filterName) => filter(filterName, blockSchemaChanges));

  logger.info(`${LOGGER_PREFIX} Schema lock filters registered successfully!`);
};
