import { games } from "./const";
import { Game } from "../game/game";

export function getGame(gameID: string): Game {
  return games.find((game) => game.gameID === gameID)!;
}
