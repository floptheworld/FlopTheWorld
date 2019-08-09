import { getGame } from "../common/get-game";
import { sendGameState } from "../send-game-state";
import { getPlayerRepository } from "../db/db";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("leaveGame", async (gameID: string, userID: string) => {
    await getPlayerRepository().delete({ userID, gameID });

    const game = getGame(gameID);

    // Remove the socket from getting update in the Game Room
    socket.leave(gameID);

    // Update all other clients that the user has left
    sendGameState(io, game);
  });
};
