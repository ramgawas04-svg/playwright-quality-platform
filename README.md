# playwright-quality-platform

## Failure diagnostics and retries

- Local runs use 0 retries so failures remain immediate and visible.
- CI runs use 1 retry to collect retry diagnostics without repeatedly masking a failure.
- A trace is captured on the first retry.
- Screenshots are captured only when a test fails.
- Videos are retained only for failed attempts.
- Playwright writes this evidence under `test-results/`; CI uploads that directory for each shard.

To inspect a trace locally:

```bash
npx playwright show-trace test-results/path-to-test/trace.zip
```

The intentionally failing diagnostic spec is outside the normal `tests/` directory. On macOS or Linux, run it explicitly in CI mode with:

```bash
CI=1 npx playwright test --config=playwright.diagnostics.config.ts
```

This command is expected to fail after one retry and is not part of the standard suite.
