import { describe, it, expect } from "vitest";
import {
  tokenize,
  buildVocabulary,
  computeIdf,
  computeTfidf,
  cosineSimilarity,
  searchIndex,
} from "../src/lib/tfidf";

describe("tokenize", () => {
  it("lowercases and splits on whitespace", () => {
    const tokens = tokenize("Hello World");
    expect(tokens).toEqual(["hello", "world"]);
  });

  it("removes stopwords", () => {
    const tokens = tokenize("the quick brown fox is very fast");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("is");
    expect(tokens).not.toContain("very");
    expect(tokens).toContain("quick");
    expect(tokens).toContain("brown");
    expect(tokens).toContain("fox");
    expect(tokens).toContain("fast");
  });

  it("removes Spanish stopwords", () => {
    const tokens = tokenize("el sistema de seguridad para los datos");
    expect(tokens).not.toContain("el");
    expect(tokens).not.toContain("de");
    expect(tokens).not.toContain("para");
    expect(tokens).not.toContain("los");
    expect(tokens).toContain("sistema");
    expect(tokens).toContain("seguridad");
    expect(tokens).toContain("datos");
  });

  it("strips punctuation", () => {
    const tokens = tokenize("python, pytorch, & langchain!");
    expect(tokens).toContain("python");
    expect(tokens).toContain("pytorch");
    expect(tokens).toContain("langchain");
  });

  it("strips accents (NFD normalization)", () => {
    const tokens = tokenize("compañías económicas información");
    expect(tokens).toContain("companias");
    expect(tokens).toContain("economicas");
    expect(tokens).toContain("informacion");
  });

  it("filters single-char tokens", () => {
    const tokens = tokenize("I a x hello");
    expect(tokens).toEqual(["hello"]);
    expect(tokenize("a b c")).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
  });

  it("returns empty array for stopwords-only input", () => {
    expect(tokenize("the and or but")).toEqual([]);
  });

  it("expands synonyms", () => {
    const tokens = tokenize("nlp k8s");
    expect(tokens).toContain("nlp");
    expect(tokens).toContain("natural");
    expect(tokens).toContain("language");
    expect(tokens).toContain("processing");
    expect(tokens).toContain("k8s");
    expect(tokens).toContain("kubernetes");
  });

  it("expands ml synonym", () => {
    const tokens = tokenize("ml engineer");
    expect(tokens).toContain("ml");
    expect(tokens).toContain("machine");
    expect(tokens).toContain("learning");
    expect(tokens).toContain("engineer");
  });
});

describe("buildVocabulary", () => {
  it("builds vocab from multiple docs", () => {
    const docs = [["python", "ml"], ["python", "security"], ["ml", "security"]];
    const vocab = buildVocabulary(docs);
    expect(vocab).toContain("python");
    expect(vocab).toContain("ml");
    expect(vocab).toContain("security");
    expect(vocab.length).toBe(3);
  });

  it("sorts by document frequency descending", () => {
    const docs = [["rare", "common"], ["common", "medium"], ["common", "medium"]];
    const vocab = buildVocabulary(docs);
    expect(vocab[0]).toBe("common");
  });

  it("handles empty docs", () => {
    expect(buildVocabulary([])).toEqual([]);
    expect(buildVocabulary([[]])).toEqual([]);
  });

  it("counts document frequency not term frequency", () => {
    const docs = [["python", "python", "python"], ["ml"]];
    const vocab = buildVocabulary(docs);
    expect(vocab.length).toBe(2);
  });
});

describe("computeIdf", () => {
  it("gives higher IDF to rarer terms", () => {
    const docs = [["common", "rare"], ["common", "other"], ["common", "another"]];
    const vocab = buildVocabulary(docs);
    const idf = computeIdf(docs, vocab);
    const commonIdx = vocab.indexOf("common");
    const rareIdx = vocab.indexOf("rare");
    expect(idf[rareIdx]).toBeGreaterThan(idf[commonIdx]);
  });
});

describe("computeTfidf + cosineSimilarity", () => {
  it("identical documents have similarity 1", () => {
    const tokens = ["python", "security", "ml"];
    const vocab = buildVocabulary([tokens]);
    const idf = computeIdf([tokens], vocab);
    const vec = computeTfidf(tokens, vocab, idf);
    expect(cosineSimilarity(vec, vec)).toBeCloseTo(1, 5);
  });

  it("disjoint documents have similarity 0", () => {
    const doc1 = ["python", "security"];
    const doc2 = ["javascript", "frontend"];
    const allDocs = [doc1, doc2];
    const vocab = buildVocabulary(allDocs);
    const idf = computeIdf(allDocs, vocab);
    const v1 = computeTfidf(doc1, vocab, idf);
    const v2 = computeTfidf(doc2, vocab, idf);
    expect(cosineSimilarity(v1, v2)).toBe(0);
  });

  it("partially overlapping docs have similarity between 0 and 1", () => {
    const doc1 = ["python", "security", "ml"];
    const doc2 = ["python", "frontend", "react"];
    const allDocs = [doc1, doc2];
    const vocab = buildVocabulary(allDocs);
    const idf = computeIdf(allDocs, vocab);
    const v1 = computeTfidf(doc1, vocab, idf);
    const v2 = computeTfidf(doc2, vocab, idf);
    const sim = cosineSimilarity(v1, v2);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
  });

  it("handles empty token list", () => {
    const vocab = ["python", "ml"];
    const idf = [1, 1];
    const vec = computeTfidf([], vocab, idf);
    expect(vec).toEqual([]);
  });

  it("handles tokens not in vocabulary", () => {
    const vocab = ["python"];
    const idf = [1];
    const vec = computeTfidf(["javascript", "rust"], vocab, idf);
    expect(vec).toEqual([]);
  });
});

describe("searchIndex", () => {
  const docs = [
    ["python", "security", "adversarial", "ml"],
    ["javascript", "react", "frontend", "css"],
    ["python", "ml", "pytorch", "transformers"],
    ["docker", "kubernetes", "devops", "ci"],
  ];
  const vocab = buildVocabulary(docs);
  const idf = computeIdf(docs, vocab);
  const vectors = docs.map((d) => computeTfidf(d, vocab, idf));

  it("returns most relevant docs first", () => {
    const results = searchIndex(["python", "ml"], vocab, idf, vectors, 4);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1]?.score ?? 0);
    // doc 0 and 2 have python + ml, should rank higher than others
    const topIndices = results.slice(0, 2).map((r) => r.index);
    expect(topIndices).toContain(0);
    expect(topIndices).toContain(2);
  });

  it("respects topK limit", () => {
    const results = searchIndex(["python"], vocab, idf, vectors, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("returns empty for no-match query", () => {
    const results = searchIndex(["nonexistent", "words"], vocab, idf, vectors, 4);
    expect(results).toEqual([]);
  });

  it("returns empty for empty query", () => {
    const results = searchIndex([], vocab, idf, vectors, 4);
    expect(results).toEqual([]);
  });

  it("filters out zero-score results", () => {
    const results = searchIndex(["kubernetes"], vocab, idf, vectors, 4);
    for (const r of results) {
      expect(r.score).toBeGreaterThan(0);
    }
  });
});
