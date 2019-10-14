import { PlayerType, GameType } from "../common/types";
import { sendMessage } from "../send-message";
import { getGameRepository, getPlayerRepository } from "../db/db";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on(
    "message",
    async (gameID: string, userID: string, message: string) => {
      const game: GameType | undefined = await getGameRepository().findOne(
        gameID
      );

      if (!game) {
        return;
      }

      const player:
        | PlayerType
        | undefined = await getPlayerRepository().findOne(
        { userID, gameID },
        { relations: ["user"] }
      );

      if (!player) {
        return;
      }

      sendMessage(io, game.gameID, `${player.user.name}: ${message}`);
    }
  );
};
