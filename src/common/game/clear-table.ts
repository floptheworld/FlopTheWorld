import { Game } from "../types";

export function clearTable(game: Game): void {
  game.players.map((player) => {
    player.cards = [];
    player.isTurn = false;
    player.isBigBlind = false;
    player.isLittleBlind = false;
    player.invested = 0;
    player.result = 0;
  });
  game.board = [];
  game.deck = [];
  game.pots = [];
  game.round = 0;
  game.pot = 0;
  game.winDesc = "";
}
