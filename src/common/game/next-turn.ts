import { GamePlayType } from "../types";

export function nextTurn(game: GamePlayType): void {
  let nextPlayerIndex: number = game.playerTurnIndex + 1;
  let firstTurnIndex: number = game.littleBlindIndex;

  game.sittingInPlayers[game.playerTurnIndex].isTurn = false;

  while (
    !game.sittingInPlayers[nextPlayerIndex] ||
    !game.sittingInPlayers[nextPlayerIndex].isActive ||
    game.sittingInPlayers[nextPlayerIndex].stackAmount === 0
  ) {
    if (!game.sittingInPlayers[nextPlayerIndex]) {
      nextPlayerIndex = 0;
    } else {
      nextPlayerIndex++;
    }
  }

  if (
    (game.sittingInPlayers[nextPlayerIndex].isCheck && game.currentBet === 0) ||
    nextPlayerIndex === game.playerTurnIndex ||
    game.sittingInPlayers[nextPlayerIndex].numBet.toFixed(2) ===
      game.currentBet.toFixed(2)
  ) {
    while (
      !game.sittingInPlayers[firstTurnIndex] ||
      !game.sittingInPlayers[firstTurnIndex].isActive ||
      game.sittingInPlayers[firstTurnIndex].stackAmount === 0
    ) {
      if (!game.sittingInPlayers[firstTurnIndex]) {
        firstTurnIndex = 0;
      } else {
        firstTurnIndex++;
      }
    }
    game.sittingInPlayers[firstTurnIndex].isTurn = true;
    game.updateRound();
    return;
  }

  game.players[nextPlayerIndex].isTurn = true;
}
