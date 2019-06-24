import uuid from "uuid";
import { Game, GameState, Player } from "./types";
import { createSecureContext } from "tls";

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
  "K",
]);

export function createDeck(): string[] {
  const cards: string[] = new Array();

  suits.forEach((suit) => {
    numbers.forEach((num) => {
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

export function clearTable(game: Game): void {
  game.board = [];

  game.players.map((player) => {
    player.cards = [];
  });

  game.deck = [];

  game.round = 0;

  game.pot = 0;
}

export function dealCards(game: Game): void {
  const players = game.players;

  players.map((player) => {
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
    stackAmount: 5.0,
    isTurn: false,
    blind: "",
    status: "",
    bet: "",
  };

  game.players.push(newPlayer);
}

export function createGame(): Game {
  return {
    board: [],
    deck: [],
    gameID: "asdf1234",
    // gameID: uuid(),
    players: [],
    pot: 100,
    round: 0,
    currentBet: 0,
  };
}

export function getGameState(currentGame: Game): GameState {
  return {
    ...{
      board: currentGame.board,
      gameID: currentGame.gameID,
      players: currentGame.players,
      pot: currentGame.pot,
      round: currentGame.round,
      currentBet: currentGame.currentBet,
    },
  };
}

export function getGame(games: Game[], gameID: string): Game {
  return games[games.findIndex((game) => game.gameID === gameID)!];
}

export function startGame(game: Game): void {
  clearTable(game);
  game.deck = shuffleDeck(createDeck());
  dealCards(game);
  game.players[0].isTurn = true;
  game.players[0].blind = "dealer";
}

export function nextRound(game: Game) {
  game.round++;
  game.currentBet = 0;
  updatePot(game);
  clearPlayerBets(game);
  switch (game.round) {
    case 1:
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      break;
    case 2:
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      break;
    case 3:
      game.deck!.pop();
      game.board.push(game.deck!.pop()!);
      break;
    default:
      startGame(game);
  }
}

export function isPlayerAction(game: Game, id: string): Player {
  return game.players.filter(
    (player) => player.playerID === id && player.isTurn === true
  )[0];
}

export function playerAction(
  game: Game,
  player: Player,
  action: string,
  data: string
): void {
  const dataNum = parseFloat(data);

  if (data !== "" && isNaN(dataNum)) {
    return;
  }

  switch (action) {
    case "fold":
      break;
    case "check":
      break;
    case "call":
      removeBet(game, player);
      player.bet = game.currentBet.toString();
      break;
    case "bet":
      game.currentBet = dataNum;
      removeBet(game, player);
      player.bet = data;
      break;
    case "raise":
      game.currentBet = dataNum;
      removeBet(game, player);
      player.bet = data;
      break;
    default:
      break;
  }

  player.status = action;
}

export function nextPlayerTurn(game: Game): void {
  const playerIndex = game.players.findIndex(
    (player) => player.isTurn === true
  );

  game.players[playerIndex].isTurn = false;

  if (!game.players[playerIndex + 1]) {
    game.players[0].isTurn = true; // TODO: Dealer + 1
    if (
      game.players[0].bet === game.currentBet.toString() ||
      game.currentBet === 0
    ) {
      nextRound(game);
    }
    return;
  }

  if (
    (game.players[playerIndex + 1].status === "raise" ||
      game.players[playerIndex + 1].status === "bet") &&
    game.players[playerIndex + 1].bet === game.currentBet.toString()
  ) {
    nextRound(game);
  }

  game.players[playerIndex + 1].isTurn = true;
}

export function updatePot(game: Game): void {
  game.players
    .filter((player) => player.bet !== "")
    .map((player) => {
      player.stackAmount -= parseFloat(player.bet);
      game.pot += parseFloat(player.bet);
    });
}

export function clearPlayerBets(game: Game): void {
  game.players.map((player) => (player.bet = ""));
}

export function removeBet(game: Game, player: Player): void {
  if (player.bet === "") {
    player.stackAmount -= game.currentBet;
  } else {
    player.stackAmount -= game.currentBet - parseFloat(player.bet);
  }
}
