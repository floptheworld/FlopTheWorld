import { GameType, UserType } from "./common/types";
import { getConnection } from "typeorm";
import { UserModel } from "./db/user-model";

export function sendSound(
  io: SocketIO.Server,
  game: GameType,
  sound: string,
  onlyTurnPlayer: boolean = false
): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map(async (client: string) => {
      const user: UserType | undefined = await getConnection()
        .getRepository(UserModel)
        .findOne({
          clientID: client,
        });

      if (!user) {
        return;
      }

      if (
        user.userID ===
        (onlyTurnPlayer
          ? game.players[game.playerTurnIndex].user.userID
          : user.userID)
      ) {
        io.to(client).emit("sound", sound);
      }
    });
  });
}
