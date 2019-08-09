import { getGame } from "../common/get-game";
import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";
import { GameType } from "../common/types";
import { sendMessage } from "../send-message";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("startGame", (gameID: string) => {
    // Find Game
    const game: GameType = getGame(gameID);

    // Send a Game update
    game.players
      .filter((player) => player.result > 0)
      .map((player) => {
        sendMessage(
          io,
          game.gameID,
          `Hand ${game.handCount}: ${
            player.user.name
          } wins $${player.result.toFixed(2)} ${
            player.resultCards.length === 0
              ? `before the showdown`
              : ` with ${player.resultDesc} [${player.resultCards
                  .map((card) => card)
                  .join(", ")}]`
          }`
        );
      });

    // Start Game
    game.start();

    // Update Game State for all clients
    sendGameState(io, game);

    // Send sound to current client
    sendSound(io, game, "Beep.wav", true);
  });
};
