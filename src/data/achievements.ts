import type { Achievement } from "../lib/types";

export const htbRanking = {
  value: "Top 200",
  title: { en: "Hack The Box Top 200", es: "Hack The Box Top 200" },
  period: { en: "September 2026", es: "Septiembre de 2026" },
  subtitle: { en: "Worldwide · September 2026", es: "Mundial · Septiembre de 2026" },
};

export const achievements: Achievement[] = [
  {
    title: "Kaggle Master",
    subtitle: "Top-tier competitive ML",
    url: "https://www.kaggle.com/adrininfantesromero",
  },
  {
    title: htbRanking.title.en,
    subtitle: htbRanking.subtitle.en,
  },
  {
    title: "2nd Place Hack a Boss",
    subtitle: "Python Hackathon",
  },
  {
    title: "Speaker OMEN League",
    subtitle: "Featured speaker",
  },
  {
    title: "Talent4Cyber",
    subtitle: "CiberEspacio contributor",
  },
];
