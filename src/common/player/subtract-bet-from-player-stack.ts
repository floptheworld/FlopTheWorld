import { Game, Player } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function subtractBetFromPlayerStack(game: Game, player: Player): void {
  player.stackAmount =
    roundToPrecision(player.stackAmount, 0.01) -
    (roundToPrecision(game.currentBet, 0.01) -
      roundToPrecision(parseFloat(player.bet) || 0, 0.01));

  player.invested =
    roundToPrecision(player.invested, 0.01) +
    (roundToPrecision(game.currentBet, 0.01) -
      roundToPrecision(parseFloat(player.bet) || 0, 0.01));
}
