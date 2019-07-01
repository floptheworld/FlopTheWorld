import { PlayerType, GamePlayType } from "../types";
import { roundToPrecision } from "../round-to-precision";

export function updatePots(game: GamePlayType) {
  let minInvested: number = 0;

  const investedTemp: number[] = [];

  game.players.map((player) => investedTemp.push(player.invested));

  let investedPlayers: PlayerType[] = game.players.filter(
    (player) => player.invested > 0
  );

  let index: number = 0;

  while (investedPlayers.length > 0) {
    // Find the Minimum Invested Player and store that amount
    minInvested = investedPlayers.reduce((prev, curr) =>
      prev.invested < curr.invested ? prev : curr
    ).invested;

    // Create a Side pot of the Min Invested Amount * How many players invest atleast that much
    if (game.pots[index] === undefined) {
      game.pots.push(0);
    }

    game.pots[index] += roundToPrecision(
      roundToPrecision(minInvested, 0.01) * investedPlayers.length,
      0.01
    );

    // Subtract the Min Invested from each players investment
    investedPlayers.map(
      (player) =>
        (player.invested = roundToPrecision(
          player.invested - minInvested,
          0.01
        ))
    );

    investedPlayers = investedPlayers.filter((player) => player.invested > 0);
    index++;
  }

  game.players.map((player, i) => (player.invested = investedTemp[i]));
}
