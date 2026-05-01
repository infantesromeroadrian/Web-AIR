import { KEY, isClient, saveState } from "./state";
import type { AppState } from "./types";

export function seedIfEmpty(): void {
  if (!isClient) return;
  if (localStorage.getItem(KEY)) return;
  const s: AppState = { items: {}, cycle: {}, activity: [] };
  const D = 2, P = 1;

  // F0 ti=0 Algebra Lineal Mastery (7 items): 3B1B caps 1-3 (0-2), Khan Unit 1 (3), Imperial LA (4), Cert DL.AI LA (5), Cert Imperial Spec (6)
  s.items["0-0-0"] = D; s.items["0-0-1"] = D; s.items["0-0-2"] = D;
  s.items["0-0-3"] = P; s.items["0-0-5"] = D;
  s.cycle["0-0"] = [1, 1, 1, 0];

  // F0 ti=1 Algebra Lineal Capstone (5 items): all pending
  s.cycle["0-1"] = [1, 0, 0, 0];

  // F0 ti=2 Calculo Mastery (2 items): Imperial Multivariate (0), Imperial PCA (1) — sustituye Khan Multi + 3B1B Calc/NN forward
  s.cycle["0-2"] = [1, 0, 0, 0];

  // F0 ti=3 Calculo Capstone (6 items): GD numpy done (0-3-0=D), chain rule a mano prog (0-3-1=P), rest pending
  s.items["0-3-0"] = D; s.items["0-3-1"] = P;
  s.cycle["0-3"] = [1, 1, 0, 0];

  // F0 ti=4 Probabilidad Mastery (17 items): Khan Units 1-16 (0-15), Cert Khan (16)
  s.items["0-4-0"] = P; s.items["0-4-1"] = P; s.items["0-4-2"] = P;
  s.cycle["0-4"] = [1, 1, 0, 0];

  // F0 ti=5 Probabilidad Capstone (5 items): all pending
  s.cycle["0-5"] = [0, 0, 0, 0];

  // F0 ti=6 Information Theory (7 items): all pending
  s.cycle["0-6"] = [0, 0, 0, 0];

  // F0 ti=7 BOSS Tiny GPT from scratch (9 items): all pending
  s.cycle["0-7"] = [0, 0, 0, 0];

  // F2 ML/DL phase (pi=2 in old data, now still pi=2)
  s.items["2-0-0"] = D; s.items["2-0-1"] = D; s.items["2-0-2"] = P; s.items["2-0-3"] = P; s.items["2-0-4"] = P; s.cycle["2-0"] = [1, 1, 1, 0];
  s.items["2-1-0"] = D; s.items["2-1-1"] = D; s.items["2-1-3"] = P; s.items["2-1-5"] = P; s.cycle["2-1"] = [1, 1, 0, 0];
  s.items["2-2-0"] = P; s.items["2-2-1"] = P; s.items["2-2-4"] = P; s.items["2-2-5"] = P; s.cycle["2-2"] = [1, 0, 0, 0];
  s.items["2-3-0"] = P; s.items["2-3-3"] = P; s.cycle["2-3"] = [1, 0, 0, 0];

  // F3A LLMs (pi=3)
  s.items["3-0-0"] = D; s.items["3-0-1"] = D; s.items["3-0-2"] = D; s.cycle["3-0"] = [1, 1, 1, 1];
  s.items["3-1-0"] = P; s.items["3-1-1"] = P; s.items["3-1-2"] = P; s.items["3-1-3"] = P; s.items["3-1-4"] = P; s.cycle["3-1"] = [1, 1, 0, 0];

  // F3B RAG (pi=4)
  s.items["4-0-0"] = D; s.items["4-0-1"] = D; s.items["4-0-2"] = D; s.cycle["4-0"] = [1, 1, 1, 1];

  // F3C Agents (pi=5)
  s.items["5-0-0"] = P; s.items["5-0-1"] = P; s.cycle["5-0"] = [1, 1, 0, 0];

  // F3D MLOps (pi=6)
  s.items["6-0-0"] = P; s.items["6-0-1"] = P; s.items["6-0-4"] = P; s.cycle["6-0"] = [1, 0, 0, 0];

  // F4B AWS (pi=8)
  s.items["8-0-0"] = D; s.items["8-0-1"] = D; s.items["8-0-2"] = D; s.cycle["8-0"] = [1, 1, 1, 1];
  s.items["8-1-0"] = P; s.items["8-1-1"] = P;

  // F5 Research (pi=9)
  s.items["9-0-0"] = P; s.cycle["9-0"] = [1, 0, 0, 0];

  // F6 Security (pi=10)
  s.items["10-0-0"] = D; s.items["10-0-1"] = D; s.items["10-0-2"] = D; s.cycle["10-0"] = [1, 1, 1, 1];
  s.items["10-3-0"] = P; s.items["10-3-2"] = P; s.cycle["10-3"] = [1, 1, 0, 0];

  // F7 AI Red Team (pi=11)
  s.items["11-0-0"] = D; s.items["11-0-1"] = D; s.items["11-0-2"] = D; s.cycle["11-0"] = [1, 1, 1, 1];
  s.items["11-1-0"] = P; s.items["11-1-2"] = P; s.items["11-1-3"] = P; s.cycle["11-1"] = [1, 1, 0, 0];
  s.items["11-2-0"] = P; s.items["11-2-1"] = P; s.items["11-2-2"] = P; s.items["11-2-5"] = P; s.items["11-2-6"] = P;

  saveState(s);
}
