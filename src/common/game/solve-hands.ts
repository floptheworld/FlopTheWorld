// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Card, PlayerType, Hand, GamePlayType } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function solveHands(game: GamePlayType): void {
  let solvedHands: Hand[] = [];
  let boardWinner: boolean = true;
  let winners: Hand[] = [];
  let sidePot: number = 0;
  let minInvested: number = 0;

  let investedPlayers: PlayerType[] = game.players.filter(
    (player) => player.invested > 0
  );
  let livePlayers: PlayerType[] = investedPlayers.filter(
    (player) => player.status !== "fold"
  );

  // While there are still players with invested money
  while (investedPlayers.length > 0) {
    // Find the Minimum Invested Player and store that amount
    minInvested = investedPlayers.reduce((prev, curr) =>
      prev.invested < curr.invested ? prev : curr
    ).invested;

    // Create a Side pot of the Min Invested Amount * How many players invest atleast that much
    sidePot = roundToPrecision(
      roundToPrecision(minInvested, 0.01) * investedPlayers.length,
      0.01
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
      livePlayers.map((player: PlayerType, ind) => {
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
        (player: PlayerType) => (player.result += sidePot / livePlayers.length)
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

    game.winDesc =
      !game.winDesc || winners[0].descr === game.winDesc
        ? winners[0].descr
        : game.winDesc + " / " + winners[0].descr;

    // Reset Variables
    solvedHands = [];
    winners = [];
    boardWinner = true;
  }
}
