import { gamePlayerUserClients } from "../common/const";
import { getGameRepository } from "../db/db";
import { GameType } from "./types";

export const updateAddGPCByGamePlayer = (
  gameID: string,
  playerID: string,
  clientID: string,
  userID: string
) => {
  const index = gamePlayerUserClients.findIndex(
    (gpc) => gpc.gameID === gameID && gpc.playerID === playerID
  );

  if (index === -1) {
    gamePlayerUserClients.push({ gameID, playerID, clientID, userID });
    return;
  }

  gamePlayerUserClients[index] = {
    ...gamePlayerUserClients[index],
    clientID,
    userID,
  };
};

export const findPlayerByGameClient = (gameID: string, clientID: string) => {
  return gamePlayerUserClients.find(
    (gpc) => gpc.gameID === gameID && gpc.clientID === clientID
  );
};

export const getGamePlayerUserClientsFromDB = async () => {
  getGameRepository()
    .find({
      relations: ["players", "players.user"],
    })
    .then((games: GameType[]) => {
      games.forEach((game) => {
        game.players.forEach((player) => {
          updateAddGPCByGamePlayer(
            game.gameID,
            player.playerID,
            player.user.clientID || "",
            player.user.userID
          );
        });
      });
    });
};
