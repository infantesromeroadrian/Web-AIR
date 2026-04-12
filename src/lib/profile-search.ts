import indexData from "../data/profile-index.json";
import { tokenize, searchIndex } from "./tfidf";
import type { ProfileChunk, ProfileIndex } from "./job-match-types";

const index = indexData as unknown as ProfileIndex;

export function searchProfile(
  query: string,
  topK = 10
): (ProfileChunk & { score: number })[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results = searchIndex(
    tokens,
    index.vocabulary,
    index.idf,
    index.vectors,
    topK
  );

  return results.map((r) => ({
    ...index.chunks[r.index],
    score: r.score,
  }));
}

export function getChunksByTags(
  keywords: string[]
): ProfileChunk[] {
  const lower = new Set(keywords.map((k) => k.toLowerCase()));
  return index.chunks.filter((c) =>
    c.tags.some((t) => lower.has(t.toLowerCase()))
  );
}

export function getAllChunks(): ProfileChunk[] {
  return index.chunks;
}
