import { UserType, PlayerType, GameType } from "./common/types";
import {
  getUserRepository,
  getPlayerRepository,
  getGameRepository,
} from "./db/db";

export async function sendGameState(
  io: SocketIO.Server,
  gameID: string
): Promise<void> {
  const game: GameType | undefined = await getGameRepository().findOne(gameID, {
    relations: ["players", "players.user"],
  });

  if (!game) {
    return;
  }

  io.sockets.in(game.gameID).clients((_err: Error, clients: string[]) => {
    clients.map(async (client: string) => {
      const user: UserType | undefined = await getUserRepository().findOne({
        clientID: client,
      });

      const player:
        | PlayerType
        | undefined = await getPlayerRepository().findOne({
        user,
        game,
      });

      if (!user || !player) {
        return;
      }

      io.to(client).emit("gameUpdate", game.getGameState(player.playerID));
    });
  });
}

// TODO: Remove ClientID from User Record
