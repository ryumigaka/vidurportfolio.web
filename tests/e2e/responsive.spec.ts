import { expect, test, type Page } from "@playwright/test";

/** Sections swap in after hydration; querying before that races the unmount. */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page
    .locator('[data-testid="shell-root"][data-hydrated="true"]')
    .waitFor();
}

test.describe("responsive composition", () => {
  test("the shell fills the viewport without overflowing it", async ({
    page,
  }) => {
    await open(page, "/");

    const overflowsHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflowsHorizontally).toBe(false);
  });

  test("desktop and mobile render different compositions", async ({
    page,
  }, testInfo) => {
    await open(page, "/");

    const nodes = page.locator('[data-testid="node-identity"]');
    // Both compositions exist in the DOM; exactly one is displayed.
    await expect(nodes).toHaveCount(2);
    await expect(
      page.locator('[data-testid="node-identity"]:visible'),
    ).toHaveCount(1);

    const width = page.viewportSize()?.width ?? 0;
    const box = await page
      .locator('[data-testid="node-identity"]:visible')
      .boundingBox();
    expect(box).not.toBeNull();

    if (testInfo.project.name === "mobile") {
      // Stacked composition: nodes span most of the narrow viewport.
      expect(box!.width).toBeGreaterThan(width * 0.6);
    } else {
      // Orbiting composition: nodes are compact and sit right of centre.
      expect(box!.width).toBeLessThan(width * 0.4);
      expect(box!.x).toBeGreaterThan(width * 0.5);
    }
  });

  test("sections scroll internally rather than scrolling the page", async ({
    page,
  }) => {
    await open(page, "/#operations");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "operations",
    );

    const region = page
      .getByTestId("view-root")
      .locator(".scroll-region")
      .first();
    await expect(region).toBeVisible();

    const canScrollInternally = await region.evaluate((element) => {
      const style = getComputedStyle(element);
      return style.overflowY === "auto" || style.overflowY === "scroll";
    });
    expect(canScrollInternally).toBe(true);
  });

  test("status bar and header stay pinned across sections", async ({
    page,
  }) => {
    await open(page, "/#identity");

    const status = page.getByTestId("status-bar");
    const header = page.getByTestId("core-return");
    await expect(status).toBeVisible();
    await expect(header).toBeVisible();

    const viewportHeight = page.viewportSize()?.height ?? 0;
    const statusBox = await status.boundingBox();
    expect(statusBox!.y + statusBox!.height).toBeLessThanOrEqual(
      viewportHeight + 1,
    );
  });

  test("the section nav is only offered once inside a section", async ({
    page,
  }) => {
    await open(page, "/");
    await expect(page.getByTestId("shell-nav")).toHaveCSS("opacity", "0");

    await open(page, "/#signal");
    await expect(page.getByTestId("shell-nav")).toHaveCSS("opacity", "1");
  });
});
