const { spawnSync } = require('node:child_process');

const environment = process.argv[2];
const playwrightArguments = process.argv.slice(3);

const result = spawnSync(
  process.execPath,
  [require.resolve('@playwright/test/cli'), 'test', ...playwrightArguments],
  {
    env: { ...process.env, TEST_ENV: environment },
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
