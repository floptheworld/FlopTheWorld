import { PlayerType } from "../common/types";
import { sendMessage } from "../send-message";
import { getPlayerRepository } from "../db/db";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on(
    "message",
    async (gameID: string, name: string, message: string) => {
      sendMessage(io, gameID, `${name}: ${message}`);
    }
  );
};
