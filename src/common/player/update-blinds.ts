import { Game } from "../types";

export function updateBlinds(game: Game): void {
  const dealerIndex = game.players.findIndex(
    (player) => player.dealer === true
  );

  if (game.players[dealerIndex + 1]) {
    game.players[dealerIndex + 1].isLittleBlind = true;
    game.players[dealerIndex + 1].bet = game.littleBlind.toString();
    game.players[dealerIndex + 1].stackAmount -= game.littleBlind;
  } else {
    game.players[0].isLittleBlind = true;
    game.players[0].bet = game.littleBlind.toString();
    game.players[0].stackAmount -= game.littleBlind;
  }

  const littleBlindIndex = game.players.findIndex(
    (player) => player.isLittleBlind === true
  );

  if (game.players[littleBlindIndex + 1]) {
    game.players[littleBlindIndex + 1].isBigBlind = true;
    game.players[littleBlindIndex + 1].bet = game.bigBlind.toString();
    game.players[littleBlindIndex + 1].stackAmount -= game.bigBlind;
  } else {
    game.players[0].isBigBlind = true;
    game.players[0].bet = game.bigBlind.toString();
    game.players[0].stackAmount -= game.bigBlind;
  }
}
