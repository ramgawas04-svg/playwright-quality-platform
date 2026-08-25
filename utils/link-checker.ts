import {
  type APIRequestContext,
  type APIResponse,
  type Page,
} from '@playwright/test';

export type BrokenLink = {
  url: string;
  status?: number;
  text?: string;
  error?: string;
};

export type LinkCheckResult = {
  discoveredLinks: number;
  checkedLinks: number;
  brokenLinks: BrokenLink[];
};

type LinkTarget = {
  url: string;
  text?: string;
};

const DEFAULT_CONCURRENCY = 5;

export async function checkPageLinks(
  page: Page,
  request: APIRequestContext,
): Promise<LinkCheckResult> {
  const discoveredLinks = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute('href')?.trim() ?? '',
      text: anchor.textContent?.trim() || undefined,
    })),
  );
  const uniqueTargets = new Map<string, LinkTarget>();

  for (const link of discoveredLinks) {
    if (link.href === '' || link.href.startsWith('#')) {
      continue;
    }

    let resolvedUrl: URL;

    try {
      resolvedUrl = new URL(link.href, page.url());
    } catch {
      continue;
    }

    if (resolvedUrl.protocol !== 'http:' && resolvedUrl.protocol !== 'https:') {
      continue;
    }

    resolvedUrl.hash = '';
    const url = resolvedUrl.toString();

    if (!uniqueTargets.has(url)) {
      uniqueTargets.set(url, { url, text: link.text });
    }
  }

  const targets = [...uniqueTargets.values()];
  const brokenLinks: BrokenLink[] = [];

  for (let index = 0; index < targets.length; index += DEFAULT_CONCURRENCY) {
    const batch = targets.slice(index, index + DEFAULT_CONCURRENCY);
    const results = await Promise.all(
      batch.map((target) => checkLink(request, target)),
    );

    brokenLinks.push(
      ...results.filter((result): result is BrokenLink => result !== undefined),
    );
  }

  return {
    discoveredLinks: discoveredLinks.length,
    checkedLinks: targets.length,
    brokenLinks,
  };
}

async function checkLink(
  request: APIRequestContext,
  target: LinkTarget,
): Promise<BrokenLink | undefined> {
  let headStatus: number | undefined;

  try {
    const headResponse = await request.head(target.url, { timeout: 15_000 });
    headStatus = headResponse.status();
    await headResponse.dispose();

    if (headStatus < 400) {
      return undefined;
    }
  } catch {
    // Some servers do not handle HEAD or its redirect chain correctly.
  }

  try {
    const getResponse = await request.get(target.url, {
      timeout: 15_000,
    });

    return brokenResultFromResponse(getResponse, target);
  } catch (error: unknown) {
    return {
      ...target,
      status: headStatus,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function brokenResultFromResponse(
  response: APIResponse,
  target: LinkTarget,
): Promise<BrokenLink | undefined> {
  const status = response.status();
  await response.dispose();

  if (status < 400) {
    return undefined;
  }

  return { ...target, status };
}
