import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path: string) {
  await page.goto(path);
  await page
    .locator('[data-testid="shell-root"][data-hydrated="true"]')
    .waitFor();
}

async function themeOf(page: Page) {
  return page.getAttribute("html", "data-theme");
}

test.describe("theme", () => {
  test("boots dark and switches to light on demand", async ({ page }) => {
    await open(page, "/");
    expect(await themeOf(page)).toBe("dark");

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("survives a reload without flashing the other theme", async ({
    page,
  }) => {
    await open(page, "/");
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();
    // Read before hydration: the inline boot script must already have applied it.
    expect(await themeOf(page)).toBe("light");
    await open(page, "/");
    expect(await themeOf(page)).toBe("light");
  });

  test("carries across sections", async ({ page }) => {
    await open(page, "/");
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await open(page, "/#operations");
    expect(await themeOf(page)).toBe("light");
    await open(page, "/#signal");
    expect(await themeOf(page)).toBe("light");
  });

  test("actually repaints the shell, not just the attribute", async ({
    page,
  }) => {
    await open(page, "/");
    const body = page.locator("body");
    const darkBackground = await body.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.waitForTimeout(600); // let the cross-fade settle

    const lightBackground = await body.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(lightBackground).not.toBe(darkBackground);

    // Light mode must genuinely be light, not merely different.
    const channels = lightBackground.match(/\d+/g)?.map(Number) ?? [];
    expect(channels[0]).toBeGreaterThan(200);
    expect(channels[1]).toBeGreaterThan(200);
    expect(channels[2]).toBeGreaterThan(200);
  });

  test("keeps text readable against the light ground", async ({ page }) => {
    await open(page, "/#operations");
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const heading = page.getByRole("heading", { name: /operations/i });
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    const channels = color.match(/\d+/g)?.map(Number) ?? [];
    // Foreground should be dark ink, not the dark theme's pale green.
    expect(channels[0]).toBeLessThan(90);
    expect(channels[1]).toBeLessThan(90);
  });

  test("logs no console errors while switching", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));

    await open(page, "/");
    await page.getByTestId("theme-toggle").click();
    await page.waitForTimeout(500);
    await page.getByTestId("theme-toggle").click();
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });
});
