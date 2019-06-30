import { GameType } from "../types";

export function clearActivePlayers(game: GameType): void {
  game.players.map((player) => {
    player.bet = "";
    if (player.status !== "fold") {
      player.status = "";
    }
  });
}
