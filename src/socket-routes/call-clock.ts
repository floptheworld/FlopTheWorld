import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";
import { GameType } from "../common/types";
import { getGameRepository } from "../db/db";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on("callClock", async (gameID: string) => {
    const game: GameType | undefined = await getGameRepository().findOne(
      gameID,
      { relations: ["players", "players.user"] }
    );

    if (!game) {
      return;
    }

    game.timer = 15;

    // Send the first Game State for the timer
    sendGameState(io, game);
    sendSound(io, game, "clock.wav");

    // Set up the time interaval
    const interval = setInterval(() => {
      // Timer was cleared due to player action
      if (game.timer === undefined) {
        clearInterval(interval);
        return;
      }

      // If time has run out
      if (game.timer === 0) {
        const player = game.players[game.playerTurnIndex];
        player.pendingSitOut = true;
        game.timer = undefined;

        clearInterval(interval);

        // Fold the player that ran out of time
        game.playerAction(player, "fold", "", () => sendGameState(io, game));
        return;
      }

      // Send Game state every second
      sendGameState(io, game);

      game.timer!--;
    }, 1000);
  });
};
