import { Game, User } from "./types";

export const suits: Set<string> = new Set(["H", "S", "C", "D"]);
export const numbers: Set<string> = new Set([
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
]);

export const games: Game[] = [];
export const users: User[] = [];
