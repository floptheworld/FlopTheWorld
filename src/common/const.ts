import { GameModel } from "../db/game-model";
import { GamePlayerUserClient } from "./types";

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

export const turnActions: Set<string> = new Set([
  "fold",
  "check",
  "call",
  "bet",
  "raise",
]);

export const games: GameModel[] = [];

export const gamePlayerUserClients: GamePlayerUserClient[] = [];
