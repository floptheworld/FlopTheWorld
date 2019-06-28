// tslint:disable-next-line:no-var-requires
const Hand = require("pokersolver").Hand;
import { Game, Player, User } from "../types";
import { users } from "../const";

export function addPlayer(game: Game, id: string): void {
  const newPlayer: Player = {
    cards: [],
    name: users.find((user) => user.userID === id)!.userName,
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
