import { Game } from "../types";
import { games } from "../const";

export function getGame(gameID: string): Game {
  return games[games.findIndex((game) => game.gameID === gameID)!];
}
