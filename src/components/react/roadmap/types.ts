import type { Topic } from "../../../data/roadmap";

export type Lang = "en" | "es";

export interface AppState {
  items: Record<string, number>;
  cycle: Record<string, number[]>;
  activity: string[];
}

export type RoadmapNode = Topic & {
  pi: number;
  ti: number;
  phId: string;
  phName: string;
  tier: number;
  tierName: string;
};

export interface TierStat {
  pct: number;
  phases: number;
}

export interface TierLabel {
  sub: string;
  name: string;
}
