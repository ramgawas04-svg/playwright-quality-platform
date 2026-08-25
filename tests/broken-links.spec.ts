import { test, expect } from '../fixtures/page-fixtures';
import { checkPageLinks, type BrokenLink } from '../utils/link-checker';

test.setTimeout(90_000);

test('homepage has no broken internal HTTP links', async ({ page, request }) => {
  await page.goto('/');

  const result = await checkPageLinks(page, request);
  const pageOrigin = new URL(page.url()).origin;
  const internalBrokenLinks = result.brokenLinks.filter(
    (link) => new URL(link.url).origin === pageOrigin,
  );
  const externalBrokenLinks = result.brokenLinks.filter(
    (link) => new URL(link.url).origin !== pageOrigin,
  );
  const summary = [
    `Discovered links: ${result.discoveredLinks}`,
    `Unique HTTP links checked: ${result.checkedLinks}`,
    `Broken internal links: ${internalBrokenLinks.length}`,
    `Unverified or broken external links: ${externalBrokenLinks.length}`,
  ].join('\n');

  console.log(summary);

  if (externalBrokenLinks.length > 0) {
    console.warn(formatBrokenLinks(externalBrokenLinks));
  }

  expect(
    internalBrokenLinks,
    formatBrokenLinks(internalBrokenLinks),
  ).toEqual([]);
});

function formatBrokenLinks(brokenLinks: BrokenLink[]): string {
  if (brokenLinks.length === 0) {
    return 'No broken links found.';
  }

  return [
    'Broken or unreachable links:',
    ...brokenLinks.map((link) => {
      const reason = link.status
        ? `HTTP ${link.status}`
        : `Network error: ${link.error ?? 'Unknown error'}`;
      const text = link.text ? ` | text: "${link.text}"` : '';

      return `- ${link.url} | ${reason}${text}`;
    }),
  ].join('\n');
}
