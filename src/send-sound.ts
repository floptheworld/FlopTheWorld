import { Game } from "./common/game/game";
import { users } from "./common/const";

export function sendSound(
  io: SocketIO.Server,
  game: Game,
  sound: string,
  onlyTurnPlayer: boolean = false
): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map((client: string) => {
      const clientUserID = users.find((user) => user.clientID === client)!
        .userID;

      if (
        clientUserID ===
        (onlyTurnPlayer
          ? game.players[game.playerTurnIndex].playerID
          : clientUserID)
      ) {
        io.to(client).emit("sound", sound);
      }
    });
  });
}
