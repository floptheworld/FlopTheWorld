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
  game.players.map((player) => {
    player.cards = [];
    player.isTurn = false;
    player.isBigBlind = false;
    player.isLittleBlind = false;
  });
  game.board = [];
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
    dealer: false,
    isLittleBlind: false,
    isBigBlind: false,
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
    pot: 0,
    round: 0,
    currentBet: 0,
    currentPot: 0,
    bigBlind: 0.1,
    littleBlind: 0.05,
    player: {
      cards: [],
      name: "",
      playerID: "",
      stackAmount: 5.0,
      isTurn: false,
      isLittleBlind: false,
      isBigBlind: false,
      dealer: false,
      status: "",
      bet: "",
    },
  };
}

export function getGameState(currentGame: Game, playerID: string): GameState {
  return {
    ...{
      board: currentGame.board,
      gameID: currentGame.gameID,
      players: currentGame.players,
      pot: currentGame.pot,
      round: currentGame.round,
      bigBlind: currentGame.bigBlind,
      littleBlind: currentGame.littleBlind,
      currentBet: currentGame.currentBet,
      currentPot: currentGame.currentPot,
      player: currentGame.players.find(
        (player) => player.playerID === playerID
      )!,
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
  updateNextDealer(game);
  updateBlinds(game);
  const bigBlindIndex = game.players.findIndex(
    (player) => player.isBigBlind === true
  );
  if (game.players[bigBlindIndex + 1]) {
    game.players[bigBlindIndex + 1].isTurn = true;
  } else {
    game.players[0].isTurn = true;
  }
  game.currentBet = game.bigBlind;
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
      player.bet = game.currentBet.toString();
      game.currentPot += dataNum;
      subtractBetFromPlayerStack(game, player);
      break;
    case "bet":
      player.bet = data;
      game.currentBet = dataNum;
      game.currentPot += dataNum;
      subtractBetFromPlayerStack(game, player);
      break;
    case "raise":
      player.bet = data;
      game.currentBet = dataNum;
      game.currentPot += dataNum;
      subtractBetFromPlayerStack(game, player);
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

export function updateNextDealer(game: Game): void {
  const dealerIndex = game.players.findIndex(
    (player) => player.dealer === true
  );
  if (dealerIndex === -1) {
    game.players[0].dealer = true;
    return;
  }

  if (game.players[dealerIndex + 1]) {
    game.players[dealerIndex].dealer = false;
    game.players[dealerIndex + 1].dealer = true;
    return;
  }

  game.players[game.players.length - 1].dealer = false;
  game.players[0].dealer = true;
}

export function updateBlinds(game: Game): void {
  const dealerIndex = game.players.findIndex(
    (player) => player.dealer === true
  );

  if (game.players[dealerIndex + 1]) {
    game.players[dealerIndex + 1].isLittleBlind = true;
    game.players[dealerIndex + 1].bet = game.littleBlind.toString();
    game.players[dealerIndex + 1].stackAmount -= game.littleBlind;
  } else {
    game.players[0].isLittleBlind = true;
    game.players[0].bet = game.littleBlind.toString();
    game.players[0].stackAmount -= game.littleBlind;
  }

  const littleBlindIndex = game.players.findIndex(
    (player) => player.isLittleBlind === true
  );

  if (game.players[littleBlindIndex + 1]) {
    game.players[littleBlindIndex + 1].isBigBlind = true;
    game.players[littleBlindIndex + 1].bet = game.bigBlind.toString();
    game.players[littleBlindIndex + 1].stackAmount -= game.bigBlind;
  } else {
    game.players[0].isBigBlind = true;
    game.players[0].bet = game.bigBlind.toString();
    game.players[0].stackAmount -= game.bigBlind;
  }
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

export function subtractBetFromPlayerStack(game: Game, player: Player): void {
  player.stackAmount -= game.currentBet;
}
