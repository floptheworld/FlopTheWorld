// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Game, Card, Player, Hand } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function solveHands(game: Game): void {
  let solvedHands: Hand[] = [];
  let boardWinner: boolean = true;
  let winners: Hand[] = [];

  game.players.map((player) => (player.result -= player.invested));

  let investedPlayers: Player[] = game.players.filter(
    (player) => player.invested > 0
  );

  while (investedPlayers.length > 0) {
    boardWinner = true;
    let sidePot: number = 0;
    const livePlayers: Player[] = investedPlayers.filter(
      (player) => player.status !== "fold"
    );

    const minInvested: number = investedPlayers.reduce((prev, curr) =>
      prev.invested < curr.invested ? prev : curr
    ).invested;

    sidePot = roundToPrecision(
      roundToPrecision(minInvested, 0.01) * investedPlayers.length,
      0.01
    );

    livePlayers.map((player) => {
      solvedHands.push(Hand.solve(player.cards.concat(game.board)));
    });

    winners = Hand.winners(solvedHands);

    winners.map((winner: Hand) => {
      let winningHand: string[] = [];
      winningHand = winner.cards.map(
        (c: Card) => c.wildValue + c.suit.toUpperCase()
      );

      livePlayers.map((player: Player) => {
        if (player.cards.some((card: string) => winningHand.includes(card))) {
          player.result += sidePot / winners.length;
          boardWinner = false;
        }
      });
    });

    if (boardWinner) {
      livePlayers.map(
        (player: Player) => (player.result += sidePot / livePlayers.length)
      );
    }

    investedPlayers.map(
      (player) =>
        (player.invested = roundToPrecision(
          player.invested - minInvested,
          0.01
        ))
    );

    investedPlayers = investedPlayers.filter((player) => player.invested > 0);

    game.winDesc = winners[0].descr;
    solvedHands = [];
    winners = [];
  }

  game.players
    .filter((player) => player.result > 0)
    .map((player) => (player.stackAmount += player.result));
}
