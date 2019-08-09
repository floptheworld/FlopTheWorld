import { getGame } from "../common/get-game";
import { PlayerType } from "../common/types";
import { sendMessage } from "../send-message";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("message", (gameID: string, userID: string, message: string) => {
    const game = getGame(gameID);
    const player: PlayerType = game.findPlayerByID(userID)!;

    sendMessage(io, game.gameID, `${player.user.name}: ${message}`);
  });
};
