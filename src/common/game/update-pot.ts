import { Game } from "../types";

export function updatePot(game: Game): void {
  game.players
    .filter((player) => player.bet !== "")
    .map((player) => (game.pot = game.pot + parseFloat(player.bet)));
}
