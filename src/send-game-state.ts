import { Game } from "./common/game/game";
import { users } from "./common/const";

export function sendGameState(io: SocketIO.Server, game: Game): void {
  io.sockets.in(game.gameID).clients((err: Error, clients: string[]) => {
    clients.map((client: string) => {
      io.to(client).emit(
        "gameUpdate",
        game.getGameState(
          users.find((user) => user.clientID === client)!.userID
        )
      );
    });
  });
}
