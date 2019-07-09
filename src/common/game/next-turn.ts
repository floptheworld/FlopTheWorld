import { GamePlayType } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function nextTurn(game: GamePlayType): void {
  let nextPlayerIndex: number = game.playerTurnIndex + 1;
  let firstTurnIndex: number = game.littleBlindIndex;

  game.players[game.playerTurnIndex].isTurn = false;

  // If this is the first round the Big blind gets to have the "last" turn if called all the way around
  if (
    game.round === 0 &&
    game.players[game.bigBlindIndex].numBet === game.bigBlind &&
    nextPlayerIndex === game.bigBlindIndex
  ) {
    game.players[nextPlayerIndex].isTurn = true;
    return;
  }

  // all players in the pot are all-in, or one player is playing alone against opponents who are all all-in
  if (
    game.activePlayers.filter(
      (player) => roundToPrecision(player.stackAmount, 0.01) > 0
    ).length <= 1
  ) {
    game.isOpen = true;
    return;
  }

  // While next player Doesnt Exist, isn't Active, has no stack or is sitting out
  while (
    !game.players[nextPlayerIndex] ||
    !game.players[nextPlayerIndex].isActive ||
    game.players[nextPlayerIndex].stackAmount === 0 ||
    game.players[nextPlayerIndex].isSittingOut
  ) {
    if (!game.players[nextPlayerIndex]) {
      nextPlayerIndex = 0;
    } else {
      nextPlayerIndex++;
    }
  }

  // If next player Checked && everyone else checked,
  // went around the table, or Called all around
  if (
    (game.players[nextPlayerIndex].isCheck && game.currentBet === 0) ||
    nextPlayerIndex === game.playerTurnIndex ||
    game.players[nextPlayerIndex].numBet.toFixed(2) ===
      game.currentBet.toFixed(2)
  ) {
    // While first turn player Doesnt Exist, isn't Active, has no stack or is sitting out
    while (
      !game.players[firstTurnIndex] ||
      !game.players[firstTurnIndex].isActive ||
      game.players[firstTurnIndex].stackAmount === 0 ||
      game.players[nextPlayerIndex].isSittingOut
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
