import { expect, test, type Page } from "@playwright/test";

const FULL_NAME = "[FULL_NAME]";

/** Client-side routing only responds once the shell has hydrated. */
async function ready(page: Page) {
  await page
    .locator('[data-testid="shell-root"][data-hydrated="true"]')
    .waitFor();
}

async function open(page: Page, path: string) {
  await page.goto(path);
  await ready(page);
}

/** The desktop and mobile compositions both exist; click whichever is visible. */
async function clickNode(page: Page, id: string) {
  await page.locator(`[data-testid="node-${id}"]:visible`).first().click();
}

/** Inside a section the core nodes are replaced by the header rail. */
async function clickRail(page: Page, id: string) {
  await page
    .getByTestId("shell-nav")
    .getByRole("button", { name: new RegExp(id, "i") })
    .click();
}

test.describe("shell navigation", () => {
  test("boots into the core view", async ({ page }) => {
    await open(page, "/");

    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
    await expect(page).toHaveTitle(`${FULL_NAME} — Portfolio`);
    await expect(page.getByTestId("system-core")).toBeVisible();
    await expect(page.getByTestId("status-bar")).toBeVisible();
  });

  test("moves core -> operations -> core and keeps the URL in step", async ({
    page,
  }) => {
    await open(page, "/");

    await clickNode(page, "operations");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "operations",
    );
    await expect(page).toHaveURL(/#operations$/);
    await expect(page).toHaveTitle(`Operations — ${FULL_NAME}`);

    await page.getByTestId("core-return").click();
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
    await expect(page).toHaveTitle(`${FULL_NAME} — Portfolio`);
  });

  test("opens each section from a deep link", async ({ page }) => {
    for (const [hash, title] of [
      ["identity", "Identity"],
      ["operations", "Operations"],
      ["signal", "Signal"],
    ]) {
      await open(page, `/#${hash}`);
      await expect(page.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        hash,
      );
      await expect(page).toHaveTitle(`${title} — ${FULL_NAME}`);
      await expect(
        page.getByRole("heading", { name: new RegExp(title, "i") }),
      ).toBeVisible();
    }
  });

  test("restores views through browser back and forward", async ({ page }) => {
    await open(page, "/");

    await clickNode(page, "identity");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "identity",
    );

    await clickRail(page, "signal");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "signal",
    );

    await page.goBack();
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "identity",
    );

    await page.goForward();
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "signal",
    );
  });

  test("an unknown hash falls back to the core", async ({ page }) => {
    await open(page, "/#not-a-real-view");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
  });

  test("escape returns to the core", async ({ page }) => {
    await open(page, "/#operations");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "operations",
    );

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
  });

  test("content is reachable by keyboard alone", async ({ page }) => {
    await open(page, "/");

    // Tab until a navigation node takes focus, then activate it.
    for (let i = 0; i < 10; i += 1) {
      await page.keyboard.press("Tab");
      const focusedTestId = await page.evaluate(() =>
        document.activeElement?.getAttribute("data-testid"),
      );
      if (focusedTestId === "node-identity") break;
    }

    await page.keyboard.press("Enter");
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "identity",
    );
  });
});

test.describe("shell integrity", () => {
  test("the persistent world survives view changes", async ({ page }) => {
    await open(page, "/");
    const core = page.getByTestId("system-core");
    await expect(core).toHaveAttribute("data-view", "home");

    await clickNode(page, "operations");
    await expect(core).toHaveAttribute("data-view", "operations");
    await expect(core).toBeVisible();
    await expect(page.getByTestId("grid-traces")).toBeVisible();
  });

  test("nothing scrolls the document itself", async ({ page }) => {
    await open(page, "/#operations");
    const overflow = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    expect(overflow).toBe("hidden");

    const scrolled = await page.evaluate(() => {
      window.scrollBy(0, 400);
      return window.scrollY;
    });
    expect(scrolled).toBe(0);
  });

  test("logs no console errors while navigating", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await open(page, "/");
    await clickNode(page, "identity");
    await page.getByTestId("core-return").click();
    await open(page, "/#signal");

    expect(errors).toEqual([]);
  });
});
