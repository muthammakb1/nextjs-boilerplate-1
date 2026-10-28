# indigo-shared-lib

Shared frontend library for Indigo applications, published as a single npm package `@commercialwebsite/indigo-shared-lib`. Written in JavaScript (ES modules + JSX).

## What's Inside

| Module        | Description                          |
| ------------- | ------------------------------------ |
| `./ui`        | Shared React UI component library    |
| `./hooks`     | Shared React hooks                   |
| `./utils`     | Shared utility functions             |
| `./tokens`    | Design tokens and theme definitions  |
| `./datadog`   | Datadog RUM integration utilities    |
| `./analytics` | Adobe Data Layer analytics utilities |

## Quick Start

### Prerequisites

- Node.js >= 18

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Format code
npm run format
```

## Storybook

Storybook is used to develop and preview UI components in isolation.

```bash
# Start Storybook dev server (runs at http://localhost:6006)
npm run storybook

# Build a static Storybook
npm run storybook:build
```

Stories are located in `apps/storybook/src/stories/`. Storybook resolves `@indigo-shared-lib/*` packages directly from the local source via Vite aliases — no separate package installs needed.

## Installing in Your Project

Add `.npmrc` to your consuming project:

```
@commercialwebsite:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @commercialwebsite/indigo-shared-lib
```

## Usage

```js
// UI components
import { Button, Popover } from '@commercialwebsite/indigo-shared-lib/ui';
import '@commercialwebsite/indigo-shared-lib/ui/styles.css';

// Hooks
import { useDebounce, useDisclosure } from '@commercialwebsite/indigo-shared-lib/hooks';

// Tokens
import { colors, spacing } from '@commercialwebsite/indigo-shared-lib/tokens';

// Utils
import { someUtil } from '@commercialwebsite/indigo-shared-lib/utils';

// Datadog
import pushDDCustomAction from '@commercialwebsite/indigo-shared-lib/datadog';
import { pushDDRumAction, trackDDApiEvent } from '@commercialwebsite/indigo-shared-lib/datadog';

// Analytics
import setAnalyticsObj from '@commercialwebsite/indigo-shared-lib/analytics';
import { trackPageLoad, trackCtaClick } from '@commercialwebsite/indigo-shared-lib/analytics';
```

## Project Structure

```
indigo-shared-lib/
├── packages/
│   ├── ui/                 # UI component library (JavaScript/JSX)
│   ├── hooks/              # Shared React hooks (JavaScript)
│   ├── utils/              # Utility functions (JavaScript)
│   ├── tokens/             # Design tokens (JavaScript)
│   ├── datadog/            # Datadog integration (JavaScript)
│   └── analytics/          # Adobe Analytics (JavaScript)
├── apps/
│   └── storybook/          # Storybook dev app
├── tooling/
│   └── commitlint-config/  # Commitlint config
└── .github/
    └── workflows/          # CI/CD (auto-publish on push to main)
```

## Publishing

Publishing is automated via GitHub Actions. On every push to `main`, the workflow builds and publishes the package to GitHub Packages.

**Versioning is managed in a single place** — the root `package.json`. There are no sub-package versions. When you change any code under `packages/`, update the version here and push.

```bash
# 1. Update version in package.json (e.g. 0.4.0 → 0.4.1)
# 2. Build and verify
npm run build
npm test

# 3. Commit and push to main — GitHub Actions handles publishing
git add .
git commit -m "build: bump version to 0.4.1"
git push origin main
```

## Commit Convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

```bash
git commit -m "feat: initial code setup for common ui package"
```

The format is `type: message` where type can be:

| Type       | Description                         |
| ---------- | ----------------------------------- |
| `feat`     | A new feature                       |
| `fix`      | A bug fix                           |
| `docs`     | Documentation changes               |
| `style`    | Code style (formatting, semicolons) |
| `refactor` | Code change that is not fix or feat |
| `perf`     | Performance improvement             |
| `test`     | Adding or updating tests            |
| `build`    | Build system or dependency changes  |
| `chore`    | Maintenance tasks                   |

## CSS Strategy

Components use plain CSS with BEM-style naming (`indigo-*` prefix). Import styles via:

```ts
import '@commercialwebsite/indigo-shared-lib/ui/styles.css';
```

This approach has zero runtime overhead, works with SSR, and avoids CSS-in-JS compatibility issues across React/Next.js versions.

## Storybook Config

The Storybook config lives in `apps/storybook/.storybook/`. It uses `@storybook/react-vite` with:

- **Vite path aliases** — `@indigo-shared-lib/ui`, `@indigo-shared-lib/hooks`, etc. resolve directly to the local `packages/*/src/` source, so no build step is needed to develop components in Storybook.
- **Automatic JSX runtime** — no need to `import React` in every component file.
- **All Storybook dependencies** are in the root `package.json` devDependencies (not in a sub-package).
