import { Game } from "../common/game/game";
import { getGame } from "../common/get-game";
import { PlayerType } from "../common/types";
import { turnActions } from "../common/const";
import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on(
    "playerAction",
    (gameID: string, userID: string, action: string, data: string) => {
      const game: Game = getGame(gameID);
      const player: PlayerType = game.findPlayerByID(userID)!;

      // If its not the players turn and the action is a turn action
      if ((!player || !player.isTurn) && turnActions.has(action)) {
        return;
      }

      // reset game timer if active
      if (game.timer && turnActions.has(action)) {
        game.timer = undefined;
      }

      // Send the player action to be processed by the game object
      game.playerAction(player, action, data, () => sendGameState(io, game));

      // Send turn sound
      if (
        game.isStarted &&
        game.playerTurnIndex !== -1 &&
        turnActions.has(action)
      ) {
        sendSound(io, game, "Beep.wav", true);
      }
    }
  );
};
