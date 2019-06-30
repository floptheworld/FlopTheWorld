import { GameType, PlayerType } from "../types";
import { subtractBetFromPlayerStack } from "./subtract-bet-from-player-stack";

export function playerAction(
  game: GameType,
  player: PlayerType,
  action: string,
  data: string
): void {
  const dataNum = parseFloat(data);

  if (data !== "" && isNaN(dataNum)) {
    return;
  }

  switch (action) {
    case "fold":
      player.cards = [];
      break;
    case "check":
      break;
    case "call":
      subtractBetFromPlayerStack(game, player);
      game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);
      player.bet = game.currentBet.toFixed(2);
      break;
    case "bet":
    case "raise":
      game.currentBet = dataNum;
      subtractBetFromPlayerStack(game, player);
      game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);
      player.bet = parseFloat(data).toFixed(2);
      break;
    default:
      break;
  }

  player.status = action;
}
