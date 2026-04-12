const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "must",
  "that", "which", "who", "whom", "this", "these", "those", "it", "its",
  "i", "me", "my", "we", "our", "you", "your", "he", "she", "they",
  "them", "his", "her", "not", "no", "nor", "so", "if", "then", "than",
  "too", "very", "just", "about", "above", "after", "again", "all", "also",
  "am", "any", "as", "because", "before", "between", "both", "each",
  "few", "get", "got", "here", "how", "into", "more", "most", "new",
  "now", "only", "other", "out", "over", "own", "same", "some", "such",
  "through", "under", "up", "what", "when", "where", "while",
  // Spanish stopwords
  "de", "la", "el", "en", "y", "que", "es", "un", "una", "los", "las",
  "del", "se", "con", "por", "para", "su", "al", "lo", "como", "mas",
  "pero", "sus", "le", "ya", "o", "fue", "este", "ha", "si", "porque",
  "esta", "son", "entre", "cuando", "muy", "sin", "sobre", "ser", "tambien",
  "me", "hasta", "hay", "donde", "han", "quien", "estan", "estado", "desde",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

export type SparseVector = [number, number][];

export function buildVocabulary(docs: string[][]): string[] {
  const freq = new Map<string, number>();
  for (const tokens of docs) {
    const seen = new Set<string>();
    for (const t of tokens) {
      if (!seen.has(t)) {
        freq.set(t, (freq.get(t) || 0) + 1);
        seen.add(t);
      }
    }
  }
  return Array.from(freq.entries())
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);
}

export function computeIdf(docs: string[][], vocab: string[]): number[] {
  const n = docs.length;
  const termIndex = new Map(vocab.map((t, i) => [t, i]));
  const df = new Array(vocab.length).fill(0);
  for (const tokens of docs) {
    const seen = new Set<string>();
    for (const t of tokens) {
      const idx = termIndex.get(t);
      if (idx !== undefined && !seen.has(t)) {
        df[idx]++;
        seen.add(t);
      }
    }
  }
  return df.map((d) => Math.log((n + 1) / (d + 1)) + 1);
}

export function computeTfidf(
  tokens: string[],
  vocab: string[],
  idf: number[]
): SparseVector {
  const termIndex = new Map(vocab.map((t, i) => [t, i]));
  const tf = new Map<number, number>();
  for (const t of tokens) {
    const idx = termIndex.get(t);
    if (idx !== undefined) {
      tf.set(idx, (tf.get(idx) || 0) + 1);
    }
  }
  const vec: SparseVector = [];
  let norm = 0;
  for (const [idx, count] of tf) {
    const w = count * idf[idx];
    vec.push([idx, w]);
    norm += w * w;
  }
  norm = Math.sqrt(norm) || 1;
  return vec.map(([idx, w]) => [idx, w / norm]);
}

export function cosineSimilarity(a: SparseVector, b: SparseVector): number {
  const mapB = new Map(b);
  let dot = 0;
  for (const [idx, wa] of a) {
    const wb = mapB.get(idx);
    if (wb !== undefined) dot += wa * wb;
  }
  return dot;
}

export function searchIndex(
  queryTokens: string[],
  vocab: string[],
  idf: number[],
  vectors: SparseVector[],
  topK: number
): { index: number; score: number }[] {
  const qVec = computeTfidf(queryTokens, vocab, idf);
  if (qVec.length === 0) return [];
  const scores = vectors.map((v, i) => ({ index: i, score: cosineSimilarity(qVec, v) }));
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK).filter((s) => s.score > 0);
}
