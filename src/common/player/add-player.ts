import { GameType, PlayerType } from "../types";
import { players } from "../const";

export function addPlayer(game: GameType, id: string): void {
  const newPlayer: PlayerType = {
    cards: [],
    name: players.find((user) => user.userID === id)!.userName,
    playerID: id,
    stackAmount: 5.0,
    isTurn: false,
    dealer: false,
    isLittleBlind: false,
    isBigBlind: false,
    status: "",
    bet: "",
    invested: 0,
    result: 0,
  };

  game.players.push(newPlayer);
}
