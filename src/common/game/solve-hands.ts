// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Game, Card, Player, Hand } from "../types";

export function solveHands(game: Game): void {
  const solvedHands: Hand[] = [];
  let boardWinner: boolean = true;

  game.players.map((player) => {
    // filter out folded
    solvedHands.push(Hand.solve(player.cards.concat(game.board)));
  });

  const winners: Hand[] = Hand.winners(solvedHands);

  // Start of testing Pot
  // ================================================================================
  console.log("berfore", game.players);
  const flag = 0;

  game.players.map((player) => (player.result -= player.invested));

  while (
    game.players.filter(
      (player) => player.invested > 0 && player.status !== "fold"
    ).length > 0
  ) {
    const solvedHands2: Hand[] = [];
    let sidePot: number = 0;

    const minInvested: Player = game.players.reduce((prev, curr) =>
      prev.invested < curr.invested ? prev : curr
    );
    game.players
      .filter((player) => player.invested > 0 && player.status !== "fold")
      .map((player) =>
        solvedHands2.push(Hand.solve(player.cards.concat(game.board)))
      );

    sidePot +=
      minInvested.invested *
      game.players.filter((player) => player.invested > 0).length;

    const bestHand: Hand = solvedHands2.reduce((prev, curr) =>
      prev.rank < curr.rank ? prev : curr
    );

    const winners2 = game.players.filter(
      (player) =>
        player.invested > 0 &&
        player.status !== "fold" &&
        player.cards.some((playerCard) =>
          bestHand.cardPool
            .map((c: Card) => c.wildValue + c.suit.toUpperCase())
            .includes(playerCard)
        )
    );

    winners2.map((player) => (player.result += sidePot * winners2.length));

    game.players
      .filter((player) => player.invested > 0 && player.status !== "fold")
      .map((player) => (player.invested -= minInvested.invested));
  }

  if (
    game.players.filter(
      (player) => player.invested > 0 && player.status !== "fold"
    ).length === 1
  ) {
    game.players
      .filter((player) => player.invested > 0 && player.status !== "fold")
      .map((player) => (player.result += player.invested));
  }

  // ==================================================================================

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
