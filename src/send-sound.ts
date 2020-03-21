import { GameType } from "./common/types";
import { findPlayerByGameClient } from "./common/game-player-client";

export function sendSound(
  io: SocketIO.Server,
  game: GameType,
  sound: string,
  onlyTurnPlayer: boolean = false
): void {
  io.sockets.in(game.gameID).clients((_err: Error, clients: string[]) => {
    clients.map(async (client: string) => {
      const gamePlayerClient = findPlayerByGameClient(game.gameID, client);

      if (!gamePlayerClient) {
        return;
      }

      if (
        gamePlayerClient.userID ===
        (onlyTurnPlayer
          ? game.players[game.playerTurnIndex].user.userID
          : gamePlayerClient.userID)
      ) {
        io.to(client).emit("sound", sound);
      }
    });
  });
}
