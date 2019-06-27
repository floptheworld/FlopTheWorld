import { Game } from "../types";

export function clearPlayers(game: Game): void {
  game.players.map((player) => {
    player.bet = "";
    player.status = "";
  });
}
