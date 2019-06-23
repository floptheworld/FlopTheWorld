export interface Player {
  name: string;
  cards: string[];
  playerID: string;
  stackAmount: number;
}

export interface GameState {
  gameID: string;
  players: Player[];
  board: string[];
}

export interface Game extends GameState {
  deck: string[];
}
