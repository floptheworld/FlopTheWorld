import { turnActions } from "../common/const";
import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";
import { sendMessage } from "../send-message";
import { getPlayerRepository, getGameRepository } from "../db/db";
import { GameType, PlayerType } from "../common/types";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on(
    "playerAction",
    async (gameID: string, userID: string, action: string, data: string) => {
      const game: GameType | undefined = await getGameRepository().findOne(
        gameID,
        { relations: ["players", "players.user"] }
      );

      if (!game) {
        return;
      }

      const player: PlayerType | undefined = game.players.find(
        (p) => p.user.userID === userID
      );

      // If its not the players turn and the action is a turn action
      if ((!player || !player.isTurn) && turnActions.has(action)) {
        return;
      }

      // reset game timer if active
      if (game.timer && turnActions.has(action)) {
        game.timer = undefined;
      }

      // Send the player action to be processed by the game object
      game.playerAction(
        player!,
        action,
        data,
        () => {
          getPlayerRepository().save(player!);
          sendGameState(io, game);

          // Send turn sound
          if (
            game.isStarted &&
            game.playerTurnIndex !== -1 &&
            turnActions.has(action)
          ) {
            sendSound(io, game, "Beep.wav", true);
          }
        },
        (message: string) => {
          sendMessage(io, game.gameID, message);
        }
      );
    }
  );
};
