/**
 * Build-time script: reads all profile data files and generates a TF-IDF
 * index as static JSON for the Job Match feature.
 *
 * Run: npx tsx scripts/build-profile-index.ts
 */

import { writeFileSync } from "fs";
import { join } from "path";

// Import data files directly (they export plain arrays/objects)
import { sectors } from "../src/data/projects.js";
import { experience } from "../src/data/experience.js";
import { education, certifications } from "../src/data/education.js";
import { skills } from "../src/data/skills.js";
import { achievements } from "../src/data/achievements.js";
import { ADRIAN_CONTEXT } from "../src/data/chat-context.js";
import { securityCaseStudies, securityCaseStudyText } from "../src/data/security-case-studies.js";

import {
  tokenize,
  buildVocabulary,
  computeIdf,
  computeTfidf,
} from "../src/lib/tfidf.js";

import type { ProfileChunk, ProfileIndex } from "../src/lib/job-match-types.js";

const chunks: ProfileChunk[] = [];

// --- Experience chunks ---
for (const exp of experience) {
  const text = [
    exp.company,
    exp.role,
    exp.period,
    exp.location,
    exp.headline,
    exp.description,
    ...exp.highlights,
    ...exp.impact.map((i) => `${i.label}: ${i.value}`),
    ...exp.tags,
  ].join(" ");

  chunks.push({
    id: `exp:${exp.company.toLowerCase().replace(/\s+/g, "-")}:${exp.role.toLowerCase().replace(/\s+/g, "-")}`,
    source: "experience.ts",
    category: "experience",
    title: `${exp.company} -- ${exp.role} (${exp.period})`,
    text,
    tags: exp.tags,
  });
}

// --- Project chunks ---
for (const sector of sectors) {
  for (const proj of sector.projects) {
    const parts = [
      proj.title,
      proj.headline,
      proj.description,
      proj.longDescription || "",
      proj.architecture || "",
      ...(proj.techStack?.map((r) => `${r.layer}: ${r.tech}`) || []),
      ...proj.tags,
      sector.name,
    ];

    chunks.push({
      id: `project:${proj.slug || proj.title.toLowerCase().replace(/\s+/g, "-")}`,
      source: "projects.ts",
      category: "project",
      title: `${proj.title} (${sector.name})`,
      text: parts.join(" "),
      tags: proj.tags,
    });
  }
}

// --- Enterprise AI security case studies ---
for (const study of securityCaseStudies) {
  chunks.push({
    id: `project:security-work:${study.id}`,
    source: "security-case-studies.ts",
    category: "project",
    title: study.title.en,
    text: securityCaseStudyText(study, "en"),
    tags: study.tags,
  });
}

// --- Skill category chunks ---
for (const cat of skills) {
  chunks.push({
    id: `skill:${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
    source: "skills.ts",
    category: "skill",
    title: `Skills: ${cat.name}`,
    text: `${cat.name} skills: ${cat.skills.join(", ")}`,
    tags: cat.skills,
  });
}

// --- Education chunks ---
for (const edu of education) {
  chunks.push({
    id: `edu:${edu.institution.toLowerCase().replace(/\s+/g, "-")}`,
    source: "education.ts",
    category: "education",
    title: `${edu.institution} -- ${edu.degree}${edu.status === "completed" ? " — Completed" : ""}`,
    text: [edu.institution, edu.degree, edu.degreeEs, edu.specialization, edu.status].filter(Boolean).join(" "),
    tags: [edu.degree, edu.degreeEs || "", edu.specialization || ""].filter(Boolean),
  });
}

// --- Certifications chunk ---
chunks.push({
  id: "edu:certifications",
  source: "education.ts",
  category: "education",
  title: "Certifications",
  text: `Certifications: ${certifications.join(", ")}`,
  tags: certifications,
});

// --- Achievements chunk ---
chunks.push({
  id: "achievements:all",
  source: "achievements.ts",
  category: "achievement",
  title: "Achievements",
  text: achievements.map((a) => `${a.title}: ${a.subtitle}`).join(". "),
  tags: achievements.map((a) => a.title),
});

// --- ADRIAN_CONTEXT split into semantic sections ---
const contextSections = ADRIAN_CONTEXT.split(/\n(?=##\s)/).filter(
  (s) => s.trim().length > 50
);
for (let i = 0; i < contextSections.length; i++) {
  const section = contextSections[i].trim();
  const heading = section.split("\n")[0].replace(/^#+\s*/, "").trim();
  chunks.push({
    id: `profile:context-${i}`,
    source: "chat-context.ts",
    category: "profile",
    title: heading || `Profile section ${i + 1}`,
    text: section,
    tags: [],
  });
}

// --- Build TF-IDF index ---
console.log(`Indexing ${chunks.length} chunks...`);

const tokenized = chunks.map((c) => {
  const tagTokens = c.tags.flatMap((t) => tokenize(t));
  return [...tokenize(c.text), ...tagTokens, ...tagTokens]; // double-weight tags
});

const vocabulary = buildVocabulary(tokenized);
console.log(`Vocabulary: ${vocabulary.length} terms`);

const idf = computeIdf(tokenized, vocabulary);
const vectors = tokenized.map((tokens) => computeTfidf(tokens, vocabulary, idf));

const index: ProfileIndex = {
  chunks,
  vocabulary,
  idf,
  vectors,
};

const outPath = join(import.meta.dirname!, "..", "src", "data", "profile-index.json");
writeFileSync(outPath, JSON.stringify(index));

const sizeKB = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(1);
console.log(`Written ${outPath} (${sizeKB} KB, ${chunks.length} chunks, ${vocabulary.length} terms)`);
