import { PlayerType } from "../types";

export function getGameStatePlayers(
  players: PlayerType[],
  currentPlayerID: string,
  cardBack: string
): PlayerType[] {
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
