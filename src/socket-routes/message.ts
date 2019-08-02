import { getGame } from "../common/get-game";
import { PlayerType } from "../common/types";
import { sendGameState } from "../send-game-state";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("message", (gameID: string, userID: string, message: string) => {
    const game = getGame(gameID);
    const player: PlayerType = game.findPlayerByID(userID)!;

    game.gameLog.push(`${player.name}: ${message}`);

    sendGameState(io, game);
  });
};
