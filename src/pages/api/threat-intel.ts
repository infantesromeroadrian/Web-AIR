import type { APIRoute } from "astro";

export const prerender = false;

const NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const LOOKBACK_DAYS = 14;
const MAX_RESULTS = 15;

interface CVE {
  id: string;
  published: string;
  description: string;
  score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  url: string;
}

interface NvdVulnerability {
  cve: {
    id: string;
    published: string;
    descriptions?: Array<{ lang: string; value: string }>;
    metrics?: {
      cvssMetricV31?: Array<{
        cvssData: { baseScore: number; baseSeverity: string };
      }>;
      cvssMetricV30?: Array<{
        cvssData: { baseScore: number; baseSeverity: string };
      }>;
    };
  };
}

interface NvdResponse {
  vulnerabilities?: NvdVulnerability[];
}

function formatDateIso(date: Date): string {
  return date.toISOString().split(".")[0] + ".000";
}

function extractDescription(v: NvdVulnerability): string {
  const desc = v.cve.descriptions?.find((d) => d.lang === "en")?.value ?? "";
  return desc.length > 240 ? desc.slice(0, 237) + "..." : desc;
}

function extractSeverity(v: NvdVulnerability): {
  score: number;
  severity: CVE["severity"];
} {
  const v31 = v.cve.metrics?.cvssMetricV31?.[0]?.cvssData;
  if (v31) {
    return {
      score: v31.baseScore,
      severity: v31.baseSeverity as CVE["severity"],
    };
  }
  const v30 = v.cve.metrics?.cvssMetricV30?.[0]?.cvssData;
  if (v30) {
    return {
      score: v30.baseScore,
      severity: v30.baseSeverity as CVE["severity"],
    };
  }
  return { score: 0, severity: "NONE" };
}

async function fetchCVEs(): Promise<CVE[]> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - LOOKBACK_DAYS);

  const params = new URLSearchParams({
    lastModStartDate: formatDateIso(start),
    lastModEndDate: formatDateIso(now),
    cvssV3Severity: "CRITICAL",
    resultsPerPage: "50",
  });

  const response = await fetch(`${NVD_API}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "adrian-infantes-portfolio/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`NVD API responded ${response.status}`);
  }

  const data = (await response.json()) as NvdResponse;
  const vulnerabilities = data.vulnerabilities ?? [];

  const cves: CVE[] = vulnerabilities
    .map((v) => {
      const { score, severity } = extractSeverity(v);
      return {
        id: v.cve.id,
        published: v.cve.published,
        description: extractDescription(v),
        score,
        severity,
        url: `https://nvd.nist.gov/vuln/detail/${v.cve.id}`,
      };
    })
    .filter((c) => c.severity === "CRITICAL" && c.description.length > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.published).getTime() - new Date(a.published).getTime();
    })
    .slice(0, MAX_RESULTS);

  return cves;
}

export const GET: APIRoute = async () => {
  try {
    const cves = await fetchCVEs();

    return new Response(
      JSON.stringify({
        cves,
        count: cves.length,
        updated: new Date().toISOString(),
        source: "nvd.nist.gov",
        lookbackDays: LOOKBACK_DAYS,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // Edge cache 1h, serve stale up to 2h while revalidating in background
          "Cache-Control":
            "public, max-age=300, s-maxage=3600, stale-while-revalidate=7200",
          "CDN-Cache-Control": "public, s-maxage=3600",
          "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
        },
      }
    );
  } catch (err) {
    console.error("Threat intel fetch failed:", err);
    return new Response(
      JSON.stringify({
        error: "NVD feed temporarily unavailable",
        cves: [],
        count: 0,
        updated: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60",
        },
      }
    );
  }
};
