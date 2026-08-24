# Playwright Quality Platform

## Architecture

```text
Tests
├── UI tests
│   └── Page Object fixtures
│       └── Page Objects
│           └── Playwright Page
│
└── API tests
    └── Domain API fixtures
        ├── PostsApi
        │   └── ApiClient
        │       └── APIRequestContext
        └── UsersApi
            └── ApiClient
                └── APIRequestContext
```

The framework keeps UI behavior, API transport, configuration, test data, and assertions separated by responsibility.

## Installation

```bash
npm ci
npx playwright install chromium
```

## Running Tests

Run the full suite:

```bash
npm test
```

Run Chromium explicitly:

```bash
npm test -- --project=chromium
```

Run headed:

```bash
npm run test:headed
```

Run Playwright UI mode:

```bash
npm run test:ui
```

Type-check:

```bash
npm run typecheck
```

## Environments

Supported environments:

- `dev`
- `qa`
- `staging`

Run against an environment:

```bash
npm run test:dev
npm run test:qa
npm run test:staging
```

Tests use Playwright's native `baseURL`, so test files remain independent of the selected deployment environment.

Configuration precedence:

```text
CI / process environment variables
        ↓
.env.<environment>
        ↓
typed committed defaults
```

Copy `.env.example` to a local environment file when needed:

```bash
cp .env.example .env.dev
```

Real `.env.*` files are intentionally ignored by Git.

## API Layer

The API layer uses Playwright's native `APIRequestContext`.

```text
PostsApi / UsersApi
        ↓
ApiClient
        ↓
APIRequestContext
```

`ApiClient` owns generic HTTP transport concerns such as URL construction, request execution, response parsing, status extraction, and runtime validation.

Domain clients retain ownership of endpoint paths, domain models, method names, and domain-specific validators.

This uses composition instead of a `BaseApiClient` inheritance hierarchy.

## Test Isolation

Page Objects are provided through test-scoped Playwright fixtures.

```text
Test A
├── BrowserContext A
├── Page A
└── Page Objects bound to Page A

Test B
├── BrowserContext B
├── Page B
└── Page Objects bound to Page B
```

This prevents browser state and Page Object state from leaking across parallel tests.

## CI/CD

GitHub Actions runs:

```text
Type-check
    ↓
4 Playwright shards
    ↓
blob reports
    ↓
merged HTML report
```

Workers provide parallelism inside a runner, while sharding distributes tests across multiple independent runners.

The current CI configuration uses 4 shards and `fail-fast: false`, allowing every shard to complete even when another shard fails.

Each shard uploads:

- Blob report
- `test-results/`

The final CI job merges blob reports into one Playwright HTML report. Artifacts are retained for 7 days.

## Failure Diagnostics

The framework uses a failure-focused diagnostics policy:

```ts
retries: process.env.CI ? 1 : 0

trace: 'on-first-retry'
screenshot: 'only-on-failure'
video: 'retain-on-failure'
```

Behavior:

- Local development: no retries
- CI: one retry
- Screenshot captured on failure
- Video retained on failure
- Trace captured on the first retry
- Final test failure is never hidden by the retry policy

Retries are used to collect comparative diagnostic evidence, not to treat flaky tests as healthy.

## Diagnostic Demonstration

A deterministic failing test is kept outside the normal test suite.

Run it explicitly:

```bash
CI=1 npx playwright test --config=playwright.diagnostics.config.ts
```

This command is expected to fail and generates evidence under:

```text
test-results/
```

Inspect a generated trace with:

```bash
npx playwright show-trace path/to/trace.zip
```

## Design Principles

The framework is intentionally evolving only when a real requirement justifies an abstraction.

Examples:

- Playwright `baseURL` instead of duplicated URL constants
- Focused Page Objects instead of a large `BasePage`
- Test-scoped fixtures for Page Object lifecycle
- Composition instead of `BaseApiClient` inheritance
- Environment resolution outside tests
- Assertions remain in tests
- Retries remain small and diagnostics-focused
- No abstraction is added only because "frameworks usually have one"

## Current Test Suite

At the current checkpoint:

- 8 UI tests
- 3 API tests
- 11 normal tests passing
- Separate deterministic diagnostics test

## Roadmap

Potential next areas:

- Flaky-test classification and quarantine policy
- Authentication and `storageState` when a real authenticated target is available
- Tagging and smoke/regression execution strategy
- Test-data isolation at scale
- Framework governance and linting rules
- Richer observability and failure classification
- AI-assisted test review and failure analysis

## Purpose

This project is both a working Playwright automation platform and an architecture-learning project. The goal is not only to automate tests, but to understand why each framework layer exists, how it scales, and how it behaves under CI, parallel execution, and failure conditions.
