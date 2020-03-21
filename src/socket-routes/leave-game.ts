import { sendGameState } from "../send-game-state";
import { getPlayerRepository, getGameRepository } from "../db/db";
import { GameType } from "../common/types";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("leaveGame", async (gameID: string, userID: string) => {
    // Remove the socket from getting update in the Game Room
    socket.leave(gameID);

    getGameRepository()
      .findOne(gameID)
      .then((game) => {
        if (!game) {
          return;
        }

        getPlayerRepository()
          .delete({ userID, gameID })
          .then(() => sendGameState(io, game)); // Update all other clients that the user has left
      });
  });
};
