import { Player } from "../types";

export function getGameStatePlayers(
  players: Player[],
  currentPlayerID: string,
  cardBack: string
): Player[] {
  const copyPlayers = players.map((player) => ({ ...player }));

  copyPlayers
    .filter(
      (player) => player.playerID !== currentPlayerID && player.cards.length > 0
    )
    .map((player) => {
      player.cards = [cardBack, cardBack];
    });
  return copyPlayers;
}
