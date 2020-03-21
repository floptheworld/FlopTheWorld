import { GameType } from "./common/types";
import { findPlayerByGameClient } from "./common/game-player-client";

export async function sendGameState(
  io: SocketIO.Server,
  game: GameType
): Promise<void> {
  io.sockets.in(game.gameID).clients((_err: Error, clients: string[]) => {
    clients.map(async (client: string) => {
      const gamePlayerClient = findPlayerByGameClient(game.gameID, client);

      if (!gamePlayerClient) {
        return;
      }

      io.to(client).emit(
        "gameUpdate",
        game.getGameState(gamePlayerClient.playerID)
      );
    });
  });
}
