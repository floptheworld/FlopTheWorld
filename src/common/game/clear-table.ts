import { Game } from "../types";

export function clearTable(game: Game): void {
  game.players.map((player) => {
    player.cards = [];
    player.isTurn = false;
    player.isBigBlind = false;
    player.isLittleBlind = false;
  });
  game.board = [];
  game.deck = [];
  game.round = 0;
  game.pot = 0;
  game.winDesc = "";
}
