import { sendGameState } from "../send-game-state";
import { getPlayerRepository, getGameRepository } from "../db/db";

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

        const playerIndex = game.players.findIndex(
          (player) => player.gameID === gameID && player.userID === userID
        );

        game.players.splice(playerIndex, 1);
        sendGameState(io, game);

        getPlayerRepository().delete({ userID, gameID });
      });
  });
};
