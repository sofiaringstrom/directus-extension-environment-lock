import { defineEndpoint } from "@directus/extensions-sdk";
import { PanelStatus } from "../types/panel-status";

export default defineEndpoint({
  id: "environment-lock",
  handler: (router, { services, getSchema, database, env }) => {
    router.get("/get-status", (req, res) => {
      // If the ENVIRONMENT variable is not set, return a danger status
      if (!env.ENVIRONMENT) {
        const response: PanelStatus = {
          icon: "encrypted_off",
          type: "danger",
          locked: false,
          environment: "",
          title: "Inactive",
          content:
            "The ENVIRONMENT variable is not set. Please set it in the .env file to activate the environment lock.",
        };
        res.send(response);
      }

      const isLocked = env.DIRECTUS_ENV_LOCKED?.includes(env.ENVIRONMENT);

      if (isLocked) {
        const response: PanelStatus = {
          icon: "lock",
          type: "info",
          locked: true,
          environment: env.ENVIRONMENT,
          title: "Locked",
          content: "The environment is locked from schema changes.",
        };
        res.send(response);
      }

      const response: PanelStatus = {
        icon: "lock_open_right",
        type: "warning",
        locked: false,
        environment: env.ENVIRONMENT,
        title: "Unlocked",
        content: "The environment is unlocked and open for schema changes.",
      };
      res.send(response);
    });
  },
});
