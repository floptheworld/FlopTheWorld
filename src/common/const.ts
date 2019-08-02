import { User } from "./types";
import { Game } from "./game/game";

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

export const games: Game[] = [];
export const users: User[] = [
  {
    userID: "7fa35b71-8733-441e-afcd-ed68defa68bf",
    email: "test@test.com",
    password: "password",
    userName: "NKDZCK",
    name: "Zack",
  },
  {
    userID: "7fa35b71-8733-441e-afcd-ed68defa68be",
    email: "user2@example.com",
    password: "password",
    userName: "user2",
    name: "user2",
  },
];
