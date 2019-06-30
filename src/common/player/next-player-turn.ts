import { Game } from "../game/game";

export function nextPlayerTurn(game: Game): void {
  if (game.activePlayers.length === 1) {
    game.activePlayers.map((player) => {
      player.stackAmount += game.pot + game.currentPot;
    });
    game.start();
    return;
  }

  let nextPlayerIndex: number = game.isTurnIndex + 1;
  let firstTurnIndex: number = game.littleBlindIndex;

  game.players[game.isTurnIndex].isTurn = false;

  while (
    !game.players[nextPlayerIndex] ||
    game.players[nextPlayerIndex].cards.length < 1 ||
    game.players[nextPlayerIndex].stackAmount === 0
  ) {
    if (!game.players[nextPlayerIndex]) {
      nextPlayerIndex = 0;
    } else {
      nextPlayerIndex++;
    }
  }

  if (
    (game.players[nextPlayerIndex].status === "check" &&
      game.currentBet === 0) ||
    nextPlayerIndex === game.isTurnIndex ||
    parseFloat(game.players[nextPlayerIndex].bet).toFixed(2) ===
      game.currentBet.toFixed(2)
  ) {
    while (
      !game.players[firstTurnIndex] ||
      game.players[firstTurnIndex].cards.length < 1 ||
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
