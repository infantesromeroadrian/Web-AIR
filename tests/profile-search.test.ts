import { describe, it, expect } from "vitest";
import { searchProfile, getChunksByTags, getAllChunks } from "../src/lib/profile-search";

describe("searchProfile", () => {
  it("returns results for a relevant query", () => {
    const results = searchProfile("python machine learning security");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].score).toBeGreaterThan(0);
  });

  it("returns chunks with expected shape", () => {
    const results = searchProfile("kubernetes docker");
    for (const r of results) {
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("title");
      expect(r).toHaveProperty("text");
      expect(r).toHaveProperty("category");
      expect(r).toHaveProperty("score");
    }
  });

  it("returns empty for gibberish query", () => {
    const results = searchProfile("xyzabc123 qqwwee");
    expect(results).toEqual([]);
  });

  it("returns empty for empty string", () => {
    expect(searchProfile("")).toEqual([]);
  });

  it("respects topK parameter", () => {
    const results = searchProfile("AI security engineer", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("ranks security-related chunks high for security query", () => {
    const results = searchProfile("adversarial machine learning red teaming LLM");
    const topIds = results.slice(0, 3).map((r) => r.id);
    const hasSecurityChunk = topIds.some(
      (id) => id.includes("security") || id.includes("skill:ai-security") || id.includes("exp:bbva")
    );
    expect(hasSecurityChunk).toBe(true);
  });

  it("finds BBVA experience for banking query", () => {
    const results = searchProfile("banking financial crime production ML");
    const hasExp = results.some((r) => r.category === "experience");
    expect(hasExp).toBe(true);
  });

  it("handles synonym expansion (nlp -> natural language processing)", () => {
    const results = searchProfile("nlp transformers");
    expect(results.length).toBeGreaterThan(0);
  });
});

describe("getChunksByTags", () => {
  it("finds chunks by exact tag", () => {
    const results = getChunksByTags(["Python"]);
    expect(results.length).toBeGreaterThan(0);
  });

  it("finds chunks by partial tag (substring match)", () => {
    const results = getChunksByTags(["adversarial"]);
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty for non-matching tags", () => {
    const results = getChunksByTags(["zzzznonexistent"]);
    expect(results).toEqual([]);
  });

  it("is case insensitive", () => {
    const lower = getChunksByTags(["python"]);
    const upper = getChunksByTags(["PYTHON"]);
    expect(lower.length).toBe(upper.length);
  });
});

describe("getAllChunks", () => {
  it("returns all indexed chunks", () => {
    const chunks = getAllChunks();
    expect(chunks.length).toBeGreaterThan(30);
  });

  it("includes projects, experience, skills, education", () => {
    const chunks = getAllChunks();
    const categories = new Set(chunks.map((c) => c.category));
    expect(categories.has("project")).toBe(true);
    expect(categories.has("experience")).toBe(true);
    expect(categories.has("skill")).toBe(true);
    expect(categories.has("education")).toBe(true);
  });
});
