import { Game } from "./types";

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

export function redeal(game: Game) {
  const players = game.players;
  players.map(player => {
    while (player.cards.length > 0) {
      player.cards.pop();
    }
  });

  game.deck = shuffleDeck(createDeck());

  dealCards(game);
}

export function dealCards(game: Game) {
  const players = game.players;

  players.map(player => {
    while (player.cards.length < 2) {
      player.cards.push(game.deck!.pop()!);
    }
  });
}
