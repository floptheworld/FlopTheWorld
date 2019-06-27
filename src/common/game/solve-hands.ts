// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Game, Card, Player, Hand } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function solveHands(game: Game): void {
  const solvedHands: Hand[] = [];
  let boardWinner: boolean = true;
  let winners: Hand[] = [];
  let sidePot: number = 0;
  let minInvested: number = 0;

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

  // While there are still players with invested money
  while (investedPlayers.length > 0) {
    // Find the Minimum Invested Player and store that amount
    minInvested = investedPlayers.reduce((prev, curr) =>
      prev.invested < curr.invested ? prev : curr
    ).invested;

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

    // Solve the hands of all players who arent folded
    livePlayers.map((player) => {
      solvedHands.push(Hand.solve(player.cards.concat(game.board)));
    });

    // Find the Winning Hand/s - Could be Multiple if there is a tie
    winners = Hand.winners(solvedHands);

    // For Each Winning Hand, find the player that the hand belongs to and split the pot by the number of winners
    winners.map((winner: Hand) => {
      let winningHand: string[] = [];
      // Upper case each Card Value to match the servers cards
      winningHand = winner.cards.map(
        (c: Card) => c.wildValue + c.suit.toUpperCase()
      );

      // For each Player that hasn't folded, check the winning hand against their hand
      livePlayers.map((player: Player, ind) => {
        if (player.cards.some((card: string) => winningHand.includes(card))) {
          // Add to the player's result the pot split by how many players won
          player.result += sidePot / winners.length;
          boardWinner = false;
        }
      });
    });

    // If the board wins, i.e. No cards in the players hands played
    if (boardWinner) {
      // Split the Pot between each player that hasn't folded
      livePlayers.map(
        (player: Player) => (player.result += sidePot / livePlayers.length)
      );
    }

    // Subtract the Min Invested from each players investment
    investedPlayers.map(
      (player) =>
        (player.invested = roundToPrecision(
          player.invested - minInvested,
          0.01
        ))
    );

    // Update the invested players as at least 1 player should be dropped off every loop
    investedPlayers = investedPlayers.filter((player) => player.invested > 0);
    livePlayers = investedPlayers.filter((player) => player.status !== "fold");

    game.winDesc = winners[0].descr;

    // Reset Variables
    solvedHands = [];
    winners = [];
    boardWinner = true;
  }

  game.players
    .filter((player) => player.result > 0)
    .map((player) => (player.stackAmount += player.result));
}
