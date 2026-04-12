import { describe, it, expect } from "vitest";

const API_URL = "http://localhost:4321/api/job-match";

const validJD = "Senior ML Engineer, 5+ years Python, PyTorch, NLP, Kubernetes";

async function postJobMatch(body: Record<string, unknown>) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/job-match", () => {
  it("returns 400 for missing jobDescription", async () => {
    const res = await postJobMatch({});
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("jobDescription");
  });

  it("returns 400 for empty jobDescription", async () => {
    const res = await postJobMatch({ jobDescription: "   " });
    expect(res.status).toBe(400);
  });

  it("returns 400 for jobDescription exceeding max length", async () => {
    const res = await postJobMatch({ jobDescription: "x".repeat(6001) });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("6000");
  });

  it("returns 400 for non-string jobDescription", async () => {
    const res = await postJobMatch({ jobDescription: 123 });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });

  // Requires a fresh dev server with no prior requests (rate limit: 3/min)
  // Run separately: npx vitest run tests/job-match-api.test.ts
  it("returns structured match for valid JD", async () => {
    const res = await postJobMatch({ jobDescription: validJD });
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(typeof data.overall_match).toBe("number");
    expect(data.overall_match).toBeGreaterThanOrEqual(0);
    expect(data.overall_match).toBeLessThanOrEqual(100);

    expect(["strong", "good", "partial", "low"]).toContain(data.match_tier);
    expect(typeof data.summary).toBe("string");
    expect(Array.isArray(data.requirements)).toBe(true);
    expect(data.requirements.length).toBeGreaterThan(0);

    for (const req of data.requirements) {
      expect(["met", "partial", "gap"]).toContain(req.status);
      expect(typeof req.requirement).toBe("string");
      expect(typeof req.evidence).toBe("string");
    }

    expect(typeof data.unique_edge).toBe("string");
    expect(data.model).toBe("llama-3.3-70b-versatile");
    expect(data.provider).toBe("groq");
  }, 20000);

  it("handles rate limiting after quota exhausted", async () => {
    // Fire 3 more requests to exhaust remaining quota (1 was used above)
    const responses = await Promise.all([
      postJobMatch({ jobDescription: "test rate 1" }),
      postJobMatch({ jobDescription: "test rate 2" }),
      postJobMatch({ jobDescription: "test rate 3" }),
    ]);
    const statuses = responses.map((r) => r.status);
    expect(statuses).toContain(429);
  }, 30000);
});
