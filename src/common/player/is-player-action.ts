import { GameType, PlayerType } from "../types";

export function isPlayerAction(game: GameType, id: string): PlayerType {
  return game.players.filter(
    (player) => player.playerID === id && player.isTurn === true
  )[0];
}
