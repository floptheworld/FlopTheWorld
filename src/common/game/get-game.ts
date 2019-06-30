import { games } from "../const";
import { Game } from "./game";

export function getGame(gameID: string): Game {
  return games.find((game) => game.gameID === gameID)!;
}
