export interface Experience {
  company: string;
  companyLogo?: string;
  role: string;
  period: string;
  location: string;
  headline: string;
  description: string;
  highlights: string[];
  impact: { label: string; value: string }[];
  tags: string[];
}

export interface Project {
  title: string;
  headline: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  videoSrc?: string;
  featured: boolean;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface Achievement {
  title: string;
  subtitle: string;
  url?: string;
}

export interface Education {
  institution: string;
  degree: string;
  specialization?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
