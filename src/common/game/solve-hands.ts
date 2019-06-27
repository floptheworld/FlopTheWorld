// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Game, Card, Player, Hand } from "../types";

export function solveHands(game: Game): void {
  const solvedHands: object[] = [];
  let boardWinner: boolean = true;

  game.players.map((player) => {
    solvedHands.push(Hand.solve(player.cards.concat(game.board)));
  });

  const winners: Hand[] = Hand.winners(solvedHands);

  winners.map((winner: Hand) => {
    let winningHand: string[] = [];
    winningHand = winner.cards.map(
      (c: Card) => c.wildValue + c.suit.toUpperCase()
    );
    game.players.map((player: Player) => {
      if (player.cards.some((card: string) => winningHand.includes(card))) {
        player.stackAmount += game.pot / winners.length;
        boardWinner = false;
      }
    });
  });

  if (boardWinner) {
    const availPlayers: number = game.players.filter(
      (player: Player) => player.cards.length > 0
    ).length;
    game.players
      .filter((player: Player) => player.cards.length > 0)
      .map((player: Player) => (player.stackAmount += game.pot / availPlayers));
  }
  game.winDesc = winners[0].descr;
}
