import { describe, expect, it } from "vitest";
import { isPlaceholder, isResolvedLink, portfolio } from "@/src/data/portfolio";

describe("isPlaceholder", () => {
  it("recognises unreplaced tokens", () => {
    expect(isPlaceholder("[FULL_NAME]")).toBe(true);
    expect(isPlaceholder("  [EMAIL]  ")).toBe(true);
    expect(isPlaceholder("[PROJECT_TITLE]")).toBe(true);
  });

  it("does not flag real values", () => {
    expect(isPlaceholder("Ada Lovelace")).toBe(false);
    expect(isPlaceholder("https://example.com")).toBe(false);
    expect(isPlaceholder("")).toBe(false);
    expect(isPlaceholder("[not a token]")).toBe(false);
  });
});

describe("isResolvedLink", () => {
  it("is false for placeholders and blanks", () => {
    expect(isResolvedLink("[GITHUB_URL]")).toBe(false);
    expect(isResolvedLink("")).toBe(false);
    expect(isResolvedLink("   ")).toBe(false);
  });

  it("is true once a real value is set", () => {
    expect(isResolvedLink("https://example.com/user")).toBe(true);
  });
});

describe("portfolio data contract", () => {
  it("has every identity field either filled in or a labelled placeholder", () => {
    const identityFields = [
      portfolio.fullName,
      portfolio.handle,
      portfolio.primaryRole,
      portfolio.secondaryRole,
      portfolio.shortBio,
      portfolio.location,
      portfolio.email,
      portfolio.resumePath,
      portfolio.profileImagePath,
      portfolio.githubUrl,
      portfolio.linkedinUrl,
      portfolio.xUrl,
    ];
    for (const field of identityFields) {
      // Never half-filled: a field is a token awaiting content, or real content.
      expect(field.trim().length).toBeGreaterThan(0);
      expect(isPlaceholder(field) || isResolvedLink(field)).toBe(true);
    }
  });

  it("exposes a contactable address for the primary call to action", () => {
    expect(isResolvedLink(portfolio.email)).toBe(true);
    expect(portfolio.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("exposes at least one project with every field present", () => {
    expect(portfolio.projects.length).toBeGreaterThan(0);
    for (const project of portfolio.projects) {
      expect(typeof project.title).toBe("string");
      expect(typeof project.description).toBe("string");
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(typeof project.url).toBe("string");
      expect(typeof project.repository).toBe("string");
      expect(typeof project.status).toBe("string");
      expect(typeof project.period).toBe("string");
    }
  });

  it("keeps focus areas non-empty so the identity readout renders", () => {
    expect(portfolio.focusAreas.length).toBeGreaterThan(0);
  });
});
