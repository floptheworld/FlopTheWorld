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

// Test
// ================================================================================

// game.players[0].cards = ["3D", "4S"];
// game.players[1].cards = ["5H", "6C"];
// game.players[2].cards = ["4D", "5S"];
// game.board = ["AC", "JD", "JH", "AD", "JS"];

// ================================================================================
