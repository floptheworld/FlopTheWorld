import { GameType } from "../types";

export function updateNextDealer(game: GameType): void {
  const dealerIndex = game.players.findIndex(
    (player) => player.dealer === true
  );

  if (dealerIndex === -1) {
    game.players[0].dealer = true;
    return;
  }

  if (game.players[dealerIndex + 1]) {
    game.players[dealerIndex].dealer = false;
    game.players[dealerIndex + 1].dealer = true;
    return;
  }

  game.players[game.players.length - 1].dealer = false;
  game.players[0].dealer = true;
}
