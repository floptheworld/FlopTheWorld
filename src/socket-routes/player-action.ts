import { Game } from "../game/game";
import { getGame } from "../common/get-game";
import { turnActions } from "../common/const";
import { sendGameState } from "../send-game-state";
import { sendSound } from "../send-sound";
import { getConnection } from "typeorm";
import { PlayerModel } from "../db/player-model";
import { sendMessage } from "../send-message";

export default (io: SocketIO.Server, socket: SocketIO.Socket) => {
  socket.on(
    "playerAction",
    async (gameID: string, userID: string, action: string, data: string) => {
      const game: Game = getGame(gameID);
      const player = await getConnection()
        .getRepository(PlayerModel)
        .findOne({ userID, gameID });

      // If its not the players turn and the action is a turn action
      if ((!player || !player.isTurn) && turnActions.has(action)) {
        return;
      }

      // reset game timer if active
      if (game.timer && turnActions.has(action)) {
        game.timer = undefined;
      }

      // Send the player action to be processed by the game object
      game.playerAction(player!, action, data, () => sendGameState(io, game));

      sendMessage(
        io,
        game.gameID,
        `${player!.user.name} ${player!.status}s ${
          player!.bet === "" ? `` : `($${player!.bet})`
        }`
      );

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
