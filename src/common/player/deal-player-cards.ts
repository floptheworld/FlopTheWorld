import { Game } from "../types";

export function dealPlayerCards(game: Game): void {
  const players = game.players;

  players.map((player) => {
    while (player.cards.length < 2) {
      player.cards.push(game.deck!.pop()!);
    }
  });
}
