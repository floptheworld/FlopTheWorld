export interface Player {
  name: string;
  cards: string[];
}

export interface Game {
  time: string;
  gameID: string;
  players: Player[];
  deck: string[];
}
