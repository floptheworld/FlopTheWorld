import { getGame } from "../common/get-game";
import { PlayerType } from "../common/types";
import { users } from "../common/const";
import { sendGameState } from "../send-game-state";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("leaveGame", (gameID: string, userID: string) => {
    const game = getGame(gameID);
    const player: PlayerType = game.findPlayerByID(userID)!;

    // Remove the player from the game object
    game.removePlayer(player);

    // Remove the socket from getting update in the Game Room
    socket.leave(gameID);

    // users.splice(users.findIndex((user) => user.userID === userID), 1);

    // Update all other clients that the user has left
    sendGameState(io, game);
  });
};
