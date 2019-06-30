import { GameType } from "../types";

export function updatePot(game: GameType): void {
  game.players
    .filter((player) => player.bet !== "")
    .map((player) => (game.pot = game.pot + parseFloat(player.bet)));
}
