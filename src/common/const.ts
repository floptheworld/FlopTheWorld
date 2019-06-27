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

// Three way tie, side pots

// game.players[0].cards = ["QS", "JS"];
//   game.players[0].invested = 50;
//   game.players[1].cards = ["QD", "3D"];
//   game.players[1].invested = 100;
//   game.players[2].cards = ["QH", "5S"];
//   game.players[2].invested = 150;
//   game.board = ["AS", "KS", "7D", "7C", "9H"];

// ================================================================================
