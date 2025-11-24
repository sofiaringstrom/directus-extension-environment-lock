<img src="https://raw.githubusercontent.com/sofiaringstrom/directus-extension-environment-lock/refs/heads/main/docs/locked_staging.png" width="400" height="auto">

# directus-extension-environment-lock ![NPM Version](https://img.shields.io/npm/v/directus-extension-environment-lock)

This bundle extension adds the ability to lock schema changes in a specific environment, and includes a panel that displays the status of the environment lock.

## Features

- Lock schema changes in a specific environment
- Display the status of the environment lock in a panel
- Exclude specific filters from the environment lock
- Whitelist specific roles from the environment lock

## Installation

Install the extension from the Directus Marketplace. See the [Official Guide](https://docs.directus.io/extensions/installing-extensions.html) for more information.

Or if you prefer to install manually:

```bash
npm install directus-extension-environment-lock
```

## Usage

### Environment Variables

| Variable                       | Description                                                                                                   | 
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | 
| [DIRECTUS_ENV_LOCKED](#directus_env_locked)            | A comma-separated list of environments that are locked.                                                       |
| DIRECTUS_ENV_WHITELISTED_ROLES | A comma-separated list of role UUIDS that are allowed to make schema changes and bypass the environment lock. | 
| DIRECTUS_ENV_INCLUDE_FILTERS   | A comma-separated list of filters that are included in the environment lock. Will merge with the defaults.    |
| DIRECTUS_ENV_EXCLUDE_FILTERS   | A comma-separated list of filters that are excluded from the environment lock.                                |

<br />

#### `DIRECTUS_ENV_LOCKED`

A comma-separated list of environments that are locked.

**Default:** `null`

**Example:**
```bash
DIRECTUS_ENV_LOCKED="development,staging"
```

<br />

#### `DIRECTUS_ENV_WHITELISTED_ROLES`

A comma-separated list of role UUIDS that are allowed to make schema changes and bypass the environment lock.

**Default:** `null`

**Example:**

```bash
DIRECTUS_ENV_WHITELISTED_ROLES="123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001"
```

<br />

#### `DIRECTUS_ENV_INCLUDE_FILTERS`

A comma-separated list of filters that are included in the environment lock. Will merge with the defaults.

**Default:** [See available filters](#available-filters)

**Example:**

```bash
DIRECTUS_ENV_INCLUDE_FILTERS="fields.create,fields.update,fields.delete"
```

<br />

#### `DIRECTUS_ENV_EXCLUDE_FILTERS`

A comma-separated list of filters that are excluded from the environment lock.

**Default:** null

**Example:**

```bash
DIRECTUS_ENV_EXCLUDE_FILTERS="fields.create,fields.update,fields.delete"
```

---

### Available filters

The following filters are active by default. You can exclude specific filters from the environment lock by setting the `DIRECTUS_ENV_EXCLUDE_FILTERS` environment variable, or include others by setting the `DIRECTUS_ENV_INCLUDE_FILTERS` environment variable.

[List of all available filters](https://directus.io/docs/guides/extensions/api-extensions/hooks#filter-events)

| Filter             | Description                 |
| ------------------ | --------------------------- |
| fields.create      | Creation of any fields      |
| fields.update      | Updates to any fields       |
| fields.delete      | Deletion of any fields      |
| collections.create | Creation of any collections |
| collections.update | Updates to any collections  |
| collections.delete | Deletion of any collections |
| relations.create   | Creation of any relations   |
| relations.update   | Updates to any relations    |
| settings.update    | Updates to any settings     |
| roles.create       | Creation of any roles       |
| roles.update       | Updates to any roles        |
| roles.delete       | Deletion of any roles       |
| policies.create    | Creation of any policies    |
| policies.update    | Updates to any policies     |
| policies.delete    | Deletion of any policies    |

---

### Panel

The extension includes a panel that displays the status of the environment lock.

<img src="https://raw.githubusercontent.com/sofiaringstrom/directus-extension-environment-lock/refs/heads/main/docs/locked_staging.png" width="400" height="auto">

<img src="https://raw.githubusercontent.com/sofiaringstrom/directus-extension-environment-lock/refs/heads/main/docs/unlocked_dev.png" width="400" height="auto">

<img src="https://raw.githubusercontent.com/sofiaringstrom/directus-extension-environment-lock/refs/heads/main/docs/inactive.png" width="400" height="auto">

---

### Hooks

The extension includes hooks that are used to lock schema changes in a specific environment.

---

## Development

### Setup

1. [Load Extension volume](https://directus.io/docs/guides/extensions/quickstart#loading-an-extension-volume) in your project and clone the repository to it

2. Install dependencies:

```bash
cd extensions/directus-extension-environment-lock

npm install
```

3. Build the extension with auto rebuild on changes:

```bash
npm run dev
```

Make sure you've set `EXTENSIONS_AUTO_RELOAD` in your `.env` file.

You might need to restart your Directus instance for the extension to be loaded.

### Building

```bash
npm run build
```
