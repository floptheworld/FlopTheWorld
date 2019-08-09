import { GameType, UserType, PlayerType } from "./common/types";
import { getConnection } from "typeorm";
import { UserModel } from "./db/user-model";
import { PlayerModel } from "./db/player-model";

export function sendGameState(io: SocketIO.Server, game: GameType): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map(async (client: string) => {
      const user: UserType | undefined = await getConnection()
        .getRepository(UserModel)
        .findOne({
          clientID: client,
        });

      const player: PlayerType | undefined = await getConnection()
        .getRepository(PlayerModel)
        .findOne({
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
