import { GamePlayType } from "../types";

export function nextTurn(game: GamePlayType): void {
  let nextPlayerIndex: number = game.playerTurnIndex + 1;
  let firstTurnIndex: number = game.littleBlindIndex;

  game.players[game.playerTurnIndex].isTurn = false;

  while (
    !game.players[nextPlayerIndex] ||
    !game.players[nextPlayerIndex].isActive ||
    game.players[nextPlayerIndex].stackAmount === 0
  ) {
    if (!game.players[nextPlayerIndex]) {
      nextPlayerIndex = 0;
    } else {
      nextPlayerIndex++;
    }
  }

  if (
    (game.players[nextPlayerIndex].isCheck && game.currentBet === 0) ||
    nextPlayerIndex === game.playerTurnIndex ||
    game.players[nextPlayerIndex].numBet.toFixed(2) ===
      game.currentBet.toFixed(2)
  ) {
    while (
      !game.players[firstTurnIndex] ||
      !game.players[firstTurnIndex].isActive ||
      game.players[firstTurnIndex].stackAmount === 0
    ) {
      if (!game.players[firstTurnIndex]) {
        firstTurnIndex = 0;
      } else {
        firstTurnIndex++;
      }
    }
    game.players[firstTurnIndex].isTurn = true;
    game.updateRound();
    return;
  }

  game.players[nextPlayerIndex].isTurn = true;
}
