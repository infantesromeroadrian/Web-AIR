export interface JobMatchRequest {
  jobDescription: string;
  lang?: "en" | "es";
}

export interface RequirementMatch {
  requirement: string;
  status: "met" | "partial" | "gap";
  evidence: string;
  source: string;
}

export interface Citation {
  id: string;
  title: string;
  relevance: number;
}

export interface JobMatchResponse {
  overall_match: number;
  match_tier: "strong" | "good" | "partial" | "low";
  summary: string;
  requirements: RequirementMatch[];
  unique_edge: string;
  suggested_questions: string[];
  citations: Citation[];
  model: string;
  provider: string;
}

export interface ProfileChunk {
  id: string;
  source: string;
  category: "project" | "experience" | "skill" | "education" | "achievement" | "profile";
  title: string;
  text: string;
  tags: string[];
}

export interface ProfileIndex {
  chunks: ProfileChunk[];
  vocabulary: string[];
  idf: number[];
  vectors: [number, number][][];
}
