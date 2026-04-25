import { KEY, isClient, saveState } from "./state";
import type { AppState } from "./types";

export function seedIfEmpty(): void {
  if (!isClient) return;
  if (localStorage.getItem(KEY)) return;
  const s: AppState = { items: {}, cycle: {}, activity: [] };
  const D = 2, P = 1;
  s.items["0-0-0"] = D; s.items["0-0-1"] = D; s.items["0-0-2"] = D; s.items["0-0-3"] = D; s.items["0-0-4"] = D; s.items["0-0-5"] = D; s.cycle["0-0"] = [1, 1, 1, 0];
  s.items["0-1-1"] = D; s.items["0-1-0"] = P; s.items["0-1-2"] = P; s.items["0-1-3"] = P; s.items["0-1-4"] = D; s.items["0-1-5"] = D; s.cycle["0-1"] = [1, 1, 0, 0];
  s.items["0-2-0"] = P; s.items["0-2-1"] = D; s.items["0-2-2"] = P; s.items["0-2-4"] = D; s.items["0-2-5"] = D; s.items["0-2-6"] = D; s.cycle["0-2"] = [1, 1, 1, 0];
  s.items["0-3-0"] = D; s.items["0-3-1"] = D; s.items["0-3-5"] = D; s.cycle["0-3"] = [1, 1, 0, 0];
  s.items["2-0-0"] = D; s.items["2-0-1"] = D; s.items["2-0-2"] = P; s.items["2-0-3"] = P; s.items["2-0-4"] = P; s.cycle["2-0"] = [1, 1, 1, 0];
  s.items["2-1-0"] = D; s.items["2-1-1"] = D; s.items["2-1-3"] = P; s.items["2-1-5"] = P; s.cycle["2-1"] = [1, 1, 0, 0];
  s.items["2-2-0"] = P; s.items["2-2-1"] = P; s.items["2-2-4"] = P; s.items["2-2-5"] = P; s.cycle["2-2"] = [1, 0, 0, 0];
  s.items["2-3-0"] = P; s.items["2-3-3"] = P; s.cycle["2-3"] = [1, 0, 0, 0];
  s.items["3-0-0"] = D; s.items["3-0-1"] = D; s.items["3-0-2"] = D; s.cycle["3-0"] = [1, 1, 1, 1];
  s.items["3-1-0"] = P; s.items["3-1-1"] = P; s.items["3-1-2"] = P; s.items["3-1-3"] = P; s.items["3-1-4"] = P; s.cycle["3-1"] = [1, 1, 0, 0];
  s.items["4-0-0"] = D; s.items["4-0-1"] = D; s.items["4-0-2"] = D; s.cycle["4-0"] = [1, 1, 1, 1];
  s.items["5-0-0"] = P; s.items["5-0-1"] = P; s.cycle["5-0"] = [1, 1, 0, 0];
  s.items["6-0-0"] = P; s.items["6-0-1"] = P; s.items["6-0-4"] = P; s.cycle["6-0"] = [1, 0, 0, 0];
  s.items["8-0-0"] = D; s.items["8-0-1"] = D; s.items["8-0-2"] = D; s.cycle["8-0"] = [1, 1, 1, 1];
  s.items["8-1-0"] = P; s.items["8-1-1"] = P;
  s.items["9-0-0"] = P; s.cycle["9-0"] = [1, 0, 0, 0];
  s.items["10-0-0"] = D; s.items["10-0-1"] = D; s.items["10-0-2"] = D; s.cycle["10-0"] = [1, 1, 1, 1];
  s.items["10-3-0"] = P; s.items["10-3-2"] = P; s.cycle["10-3"] = [1, 1, 0, 0];
  s.items["11-0-0"] = D; s.items["11-0-1"] = D; s.items["11-0-2"] = D; s.cycle["11-0"] = [1, 1, 1, 1];
  s.items["11-1-0"] = P; s.items["11-1-2"] = P; s.items["11-1-3"] = P; s.cycle["11-1"] = [1, 1, 0, 0];
  s.items["11-2-0"] = P; s.items["11-2-1"] = P; s.items["11-2-2"] = P; s.items["11-2-5"] = P; s.items["11-2-6"] = P;
  saveState(s);
}
