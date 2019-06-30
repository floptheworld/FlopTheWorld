import { GameType } from "../types";

export function clearPlayers(game: GameType): void {
  game.players.map((player) => {
    player.bet = "";
    player.status = "";
  });
}
