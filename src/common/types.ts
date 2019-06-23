export interface Player {
  name: string;
  cards: string[];
  playerID: string;
  stackAmount: number;
  isTurn: boolean;
  blind: string;
  status: string;
  bet: string;
}

export interface GameState {
  gameID: string;
  players: Player[];
  board: string[];
  round: number;
  pot: number;
}

export interface Game extends GameState {
  deck: string[];
}
