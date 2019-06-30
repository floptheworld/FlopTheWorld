import { GameType } from "../types";
import { clearTable } from "./clear-table";
import { clearPlayers } from "../player/clear-players";
import { shuffleDeck } from "../shuffle-deck";
import { createDeck } from "../create-deck";
import { updateBlinds } from "../player/update-blinds";
import { updateNextDealer } from "../player/update-next-dealer";
import { dealPlayerCards } from "../player/deal-player-cards";

export function startGame(game: GameType): void {
  clearTable(game);
  clearPlayers(game);
  game.deck = shuffleDeck(createDeck());
  dealPlayerCards(game);
  updateNextDealer(game);
  updateBlinds(game);
  const bigBlindIndex = game.players.findIndex(
    (player) => player.isBigBlind === true
  );
  if (game.players[bigBlindIndex + 1]) {
    game.players[bigBlindIndex + 1].isTurn = true;
  } else {
    game.players[0].isTurn = true;
  }
  game.currentBet = game.bigBlind;
  game.currentPot = game.bigBlind + game.littleBlind;
}
