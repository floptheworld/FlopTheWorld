// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Game, Card, Player, Hand } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function solveHands(game: Game): void {
  const solvedHands: Hand[] = [];
  let boardWinner: boolean = true;

  // ================================================================================

  game.players[0].cards = ["3D", "4S"];
  game.players[1].cards = ["5H", "6C"];
  game.players[2].cards = ["4D", "5S"];
  game.board = ["AC", "JD", "JH", "AD", "JS"];

  // ================================================================================

  game.players.map((player) => {
    // filter out folded
    solvedHands.push(Hand.solve(player.cards.concat(game.board)));
  });

  const winners: Hand[] = Hand.winners(solvedHands);

  // Start of testing Pot
  // ================================================================================
  game.players.map((player) => (player.result -= player.invested));

  let investedPlayers: Player[] = game.players.filter(
    (player) => player.invested > 0
  );

  while (investedPlayers.length > 0) {
    const solvedHands2: Hand[] = [];
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

    // ================================================================================

    let boardWinner2: boolean = true;
    livePlayers.map((player) => {
      solvedHands2.push(Hand.solve(player.cards.concat(game.board)));
    });

    const winners3: Hand[] = Hand.winners(solvedHands2);

    winners3.map((winner: Hand) => {
      let winningHand: string[] = [];
      winningHand = winner.cards.map(
        (c: Card) => c.wildValue + c.suit.toUpperCase()
      );

      livePlayers.map((player: Player) => {
        if (player.cards.some((card: string) => winningHand.includes(card))) {
          player.result += sidePot / winners3.length;
          boardWinner2 = false;
        }
      });
    });

    if (boardWinner2) {
      livePlayers.map(
        (player: Player) => (player.result += sidePot / livePlayers.length)
      );
    }

    // ================================================================================

    // livePlayers.map(
    //   (player) =>
    //     (player.solvedHand = Hand.solve(player.cards.concat(game.board)))
    // );

    // const bestHandRank: number = livePlayers.reduce((prev, curr) =>
    //   prev.solvedHand!.rank > curr.solvedHand!.rank ? prev : curr
    // ).solvedHand!.rank;

    // const winners2 = livePlayers.filter(
    //   (player) => player.solvedHand!.rank === bestHandRank
    // );

    // winners2.map((player) => (player.result += sidePot * winners2.length));

    // ================================================================================

    investedPlayers.map(
      (player) =>
        (player.invested = roundToPrecision(
          player.invested - minInvested,
          0.01
        ))
    );

    investedPlayers = investedPlayers.filter((player) => player.invested > 0);
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
