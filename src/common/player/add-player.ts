import { Game, Player, User } from "../types";

export function addPlayer(game: Game, id: string, users: User[]): void {
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
  };

  game.players.push(newPlayer);
}
