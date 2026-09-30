import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path: string) {
  await page.goto(path);
  await page
    .locator('[data-testid="shell-root"][data-hydrated="true"]')
    .waitFor();
}

test.beforeEach(async ({ page }) => {
  await page.route(/api\.ipify\.org/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ip: "203.0.113.7" }),
    }),
  );
});

/** The visible half of a decoding node; the rest is screen-reader text. */
const VISIBLE = '[data-testid="decode-text"] >> nth=0';

test.describe("decode reveal", () => {
  test("section content resolves out of noise on open", async ({ page }) => {
    await open(page, "/#operations");

    const heading = page.getByRole("heading", { name: /operations/i });
    await expect(heading).toHaveText(/operations/i);
  });

  test("content below the fold stays unresolved until scrolled to", async ({
    page,
  }) => {
    // A short viewport guarantees the list overflows its scroll region.
    await page.setViewportSize({ width: 1280, height: 600 });
    await open(page, "/#operations");
    await page.waitForTimeout(2200); // let everything already in view settle

    const region = page
      .getByTestId("view-root")
      .locator(".scroll-region")
      .first();
    const scrollable = await region.evaluate(
      (el) => el.scrollHeight > el.clientHeight + 4,
    );
    test.skip(!scrollable, "viewport is tall enough to show every entry");

    const lastEntry = page.getByTestId("operation-entry").last();
    const lastTitle = lastEntry.locator('[data-testid="decode-text"]').first();

    const beforeScroll = await lastTitle.evaluate(
      (el) => el.querySelector('[aria-hidden="true"]')?.textContent ?? "",
    );
    expect(beforeScroll).not.toBe("[PROJECT_TITLE]");

    await region.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));

    await expect
      .poll(
        async () =>
          lastTitle.evaluate(
            (el) => el.querySelector('[aria-hidden="true"]')?.textContent ?? "",
          ),
        { timeout: 5000 },
      )
      .toBe("[PROJECT_TITLE]");
  });

  test("the real text is always available to assistive technology", async ({
    page,
  }) => {
    await open(page, "/#identity");
    // Accessible name ignores the noise span and reads the sr-only text.
    await expect(page.getByRole("heading", { name: "Identity" })).toBeVisible();
  });
});

test.describe("cursor", () => {
  test("no particle trail canvas is mounted", async ({ page }) => {
    await open(page, "/");
    await page.mouse.move(400, 300);
    await page.mouse.move(700, 500);
    await expect(page.getByTestId("cursor-trail")).toHaveCount(0);
  });
});
