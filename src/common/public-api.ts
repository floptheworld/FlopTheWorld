import uuid from "uuid";
import { Game, GameState, Player } from "./types";

const suits: Set<string> = new Set(["H", "S", "C", "D"]);
const numbers: Set<string> = new Set([
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]);

export function createDeck(): string[] {
  const cards: string[] = new Array();

  suits.forEach(suit => {
    numbers.forEach(num => {
      cards.push(num + suit);
    });
  });

  return cards;
}

export function shuffleDeck(deck: string[]): string[] {
  const shuffledDeck: string[] = deck;

  let tempCard: string;
  for (let i: number = shuffledDeck.length - 1; i > 0; i--) {
    const randomPos: number = Math.floor(Math.random() * (i + 1));
    tempCard = shuffledDeck[i];
    shuffledDeck[i] = shuffledDeck[randomPos];
    shuffledDeck[randomPos] = tempCard;
  }

  return shuffledDeck;
}

export function clearPlayerCards(game: Game): void {
  const players = game.players;
  players.map(player => {
    while (player.cards.length > 0) {
      player.cards.pop();
    }
  });

  game.deck = shuffleDeck(createDeck());
}

export function dealCards(game: Game): void {
  const players = game.players;

  players.map(player => {
    while (player.cards.length < 2) {
      player.cards.push(game.deck!.pop()!);
    }
  });
}

export function addPlayer(game: Game, id: string): void {
  const newPlayer: Player = {
    cards: [],
    name: "New Player",
    playerID: id,
    stackAmount: 500
  };

  game.players.push(newPlayer);
}

export function createGame(): Game {
  return {
    deck: [],
    gameID: "asdf1234",
    // gameID: uuid(),
    players: []
  };
}

export function getGameState(currentGame: Game): GameState {
  return {
    ...{
      gameID: currentGame.gameID,
      players: currentGame.players
    }
  };
}

export function getGame(games: Game[], gameID: string): Game {
  return games[games.findIndex(game => game.gameID === gameID)!];
}

export function startGame(game: Game): void {
  game.deck = shuffleDeck(createDeck());
  clearPlayerCards(game);
  dealCards(game);
}
