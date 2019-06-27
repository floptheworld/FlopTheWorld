import { Game } from "../types";

export function clearActivePlayers(game: Game): void {
  game.players.map((player) => {
    player.bet = "";
    if (player.status !== "fold") {
      player.status = "";
    }
  });
}
