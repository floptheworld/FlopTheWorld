import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";
import { GameType } from "../common/types";
import { sendMessage } from "../send-message";
import { getGameRepository } from "../db/db";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("startGame", async (gameID: string) => {
    // Find Game
    const game: GameType | undefined = await getGameRepository().findOne(
      gameID,
      { relations: ["players", "players.user"] }
    );

    if (!game) {
      return;
    }

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

    await getGameRepository().save(game);

    // Update Game State for all clients
    await sendGameState(io, gameID);

    // Send sound to current client
    await sendSound(io, game, "Beep.wav", true);
  });
};
