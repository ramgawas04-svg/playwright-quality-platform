import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';

export const supportedEnvironments = ['dev', 'qa', 'staging'] as const;

export type SupportedEnvironment = (typeof supportedEnvironments)[number];

export type EnvironmentConfig = {
  environment: SupportedEnvironment;
  baseUrl: string;
  apiUrl: string;
};

export const environmentConfigs: Record<
  SupportedEnvironment,
  Omit<EnvironmentConfig, 'environment'>
> = {
  dev: {
    baseUrl: 'https://playwright.dev',
    apiUrl: 'https://jsonplaceholder.typicode.com',
  },
  qa: {
    baseUrl: 'https://playwright.dev',
    apiUrl: 'https://jsonplaceholder.typicode.com',
  },
  staging: {
    baseUrl: 'https://playwright.dev',
    apiUrl: 'https://jsonplaceholder.typicode.com',
  },
};

export function resolveEnvironment(
  value: string | undefined = process.env.TEST_ENV,
): EnvironmentConfig {
  const environment = resolveEnvironmentName(value);
  loadEnvironmentFile(environment);
  const defaults = environmentConfigs[environment];

  return {
    environment,
    baseUrl: requireUrl('BASE_URL', process.env.BASE_URL ?? defaults.baseUrl),
    apiUrl: requireUrl('API_URL', process.env.API_URL ?? defaults.apiUrl),
  };
}

function resolveEnvironmentName(
  value: string | undefined,
): SupportedEnvironment {
  const environment = value ?? 'dev';

  if (!isSupportedEnvironment(environment)) {
    throw new Error(
      `Unsupported TEST_ENV "${environment}". Supported environments: ${supportedEnvironments.join(', ')}.`,
    );
  }

  return environment;
}

function loadEnvironmentFile(environment: SupportedEnvironment): void {
  const result = loadDotenv({
    path: resolve(process.cwd(), `.env.${environment}`),
    quiet: true,
  });

  const error = result.error as NodeJS.ErrnoException | undefined;

  if (error && error.code !== 'ENOENT') {
    throw error;
  }
}

function requireUrl(name: string, value: string): string {
  if (value.trim() === '') {
    throw new Error(`${name} must not be empty.`);
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Unsupported protocol');
    }
  } catch {
    throw new Error(
      `${name} must be a valid HTTP or HTTPS URL. Received: "${value}".`,
    );
  }

  return value;
}

function isSupportedEnvironment(value: string): value is SupportedEnvironment {
  return supportedEnvironments.some((environment) => environment === value);
}
