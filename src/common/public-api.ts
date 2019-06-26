import uuid from "uuid";
import { Game, GameState, Player } from "./types";
import { roundToPrecision } from "../common/functions";

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
  clearPlayers(game);
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
  game.currentPot = game.bigBlind + game.littleBlind;
}

export function nextRound(game: Game) {
  let numberOfPlayers: number = 0;
  game.round++;
  game.currentBet = 0;
  game.currentPot = 0;
  updatePot(game);
  clearActivePlayers(game);
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
      player.cards = [];
      break;
    case "check":
      break;
    case "call":
      subtractBetFromPlayerStack(game, player);
      game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);
      player.bet = game.currentBet.toString();
      break;
    case "bet":
    case "raise":
      game.currentBet = dataNum;
      subtractBetFromPlayerStack(game, player);
      game.currentPot += game.currentBet - (parseFloat(player.bet) || 0);
      player.bet = data;
      break;
    default:
      break;
  }

  player.status = action;
}

export function nextPlayerTurn(game: Game): void {
  if (game.players.filter((player) => player.status !== "fold").length === 1) {
    game.players
      .filter((player) => player.status !== "fold")
      .map(
        (player) => (player.stackAmount += game.pot + parseFloat(player.bet))
      );
    startGame(game);
    return;
  }
  const playerIndex: number = game.players.findIndex(
    (player) => player.isTurn === true
  );
  let firstTurnIndex: number = game.players.findIndex(
    (player) => player.isLittleBlind === true
  );
  let nextPlayerIndex: number = playerIndex + 1;

  game.players[playerIndex].isTurn = false;

  while (
    !game.players[nextPlayerIndex] ||
    game.players[nextPlayerIndex].cards.length < 1 ||
    game.players[nextPlayerIndex].stackAmount === 0
  ) {
    if (!game.players[nextPlayerIndex]) {
      nextPlayerIndex = 0;
    } else {
      nextPlayerIndex++;
    }
  }

  if (
    (game.players[nextPlayerIndex].status === "check" &&
      game.currentBet === 0) ||
    nextPlayerIndex === playerIndex ||
    game.players[nextPlayerIndex].bet === game.currentBet.toString()
  ) {
    while (
      !game.players[firstTurnIndex] ||
      game.players[firstTurnIndex].cards.length < 1 ||
      game.players[firstTurnIndex].stackAmount === 0
    ) {
      if (!game.players[firstTurnIndex]) {
        firstTurnIndex = 0;
      } else {
        firstTurnIndex++;
      }
    }
    game.players[firstTurnIndex].isTurn = true;
    nextRound(game);
    return;
  }

  game.players[nextPlayerIndex].isTurn = true;
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
    .map((player) => (game.pot = game.pot + parseFloat(player.bet)));
}

export function clearPlayers(game: Game): void {
  game.players.map((player) => {
    player.bet = "";
    player.status = "";
  });
}

export function clearActivePlayers(game: Game): void {
  game.players.map((player) => {
    player.bet = "";
    if (player.status !== "fold") {
      player.status = "";
    }
  });
}

export function subtractBetFromPlayerStack(game: Game, player: Player): void {
  player.stackAmount =
    roundToPrecision(player.stackAmount, 0.01) -
    (roundToPrecision(game.currentBet, 0.01) -
      roundToPrecision(parseFloat(player.bet) || 0, 0.01));
}
