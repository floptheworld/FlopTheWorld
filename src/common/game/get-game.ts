import { Game } from "../types";

export function getGame(games: Game[], gameID: string): Game {
  return games[games.findIndex((game) => game.gameID === gameID)!];
}
