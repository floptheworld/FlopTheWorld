import { getGame } from "../common/get-game";
import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("startGame", (gameID: string) => {
    // Find Game
    const game = getGame(gameID);

    // Start Game
    game.start();

    // Update Game State for all clients
    sendGameState(io, game);

    // Send sound to current client
    sendSound(io, game, "Beep.wav", true);
  });
};
