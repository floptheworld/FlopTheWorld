import { Game } from "../types";
import { startGame } from "../game/start-game";
import { nextRound } from "../game/next-round";

export function nextPlayerTurn(game: Game): void {
  if (game.players.filter((player) => player.status !== "fold").length === 1) {
    game.players
      .filter((player) => player.status !== "fold")
      .map((player) => {
        player.stackAmount += game.pot + game.currentPot;
      });
    startGame(game);
    return;
  }

  const playerIndex: number = game.players.findIndex(
    (player) => player.isTurn === true
  );
  let firstTurnIndex: number = game.players.findIndex(
    (player) => player.isLittleBlind === true
  );
  let nextPlayerIndex: number = playerIndex + 1;

  game.players[playerIndex].isTurn = false;

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
    nextPlayerIndex === playerIndex ||
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
    nextRound(game);
    return;
  }

  game.players[nextPlayerIndex].isTurn = true;
}
