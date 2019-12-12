import { GameType, UserType } from "./common/types";
import { getUserRepository } from "./db/db";

export function sendSound(
  io: SocketIO.Server,
  game: GameType,
  sound: string,
  onlyTurnPlayer: boolean = false
): void {
  io.sockets.in(game.gameID).clients((_err: Error, clients: string[]) => {
    clients.map(async (client: string) => {
      const user: UserType | undefined = await getUserRepository().findOne({
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
