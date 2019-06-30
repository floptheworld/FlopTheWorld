import assert from "assert";
import uuid from "uuid";
// tslint:disable-next-line:no-implicit-dependencies
import { describe, it } from "mocha";
import { getGame } from "../src/common/get-game";
import { games, users } from "../src/common/const";
import { Game } from "../src/common/game/game";
import { Player } from "../src/common/player/player";

const userNames: string[] = ["Bob", "Joe", "Sally"];
let currentGame: Game;

describe("Creates a Game", () => {
  it("Should push new game to Game Array", () => {
    games.push(new Game("asdf1234", 0.1, 0.05, "gray_back"));

    assert.strictEqual(games.length, 1);
  });

  it("Should get the new game from games Array, and store it", () => {
    currentGame = getGame("asdf1234");

    assert.notStrictEqual(currentGame, undefined);
  });

  it("Should loop 3 times, creating 3 users and 3 players", () => {
    for (let i = 0; i < 3; i++) {
      users.push({
        userID: uuid(),
        clientID: i.toString(),
        userName: userNames[i],
      });

      currentGame.addPlayer(new Player(users[i].userID, users[i].userName));
    }

    assert.strictEqual(users.length, 3);
    assert.strictEqual(currentGame.players.length, 3);
  });

  it("Should Start the current game", () => {
    currentGame.start();

    assert.strictEqual(currentGame.round, 0);
    assert.strictEqual(currentGame.board.length, 0);
    assert.strictEqual(currentGame.pots.length, 0);
  });
});

describe("Evaluates Game Rounds", () => {
  it("Should move to round 1, The Flop", () => {
    currentGame.players[0].invested = 50;
    currentGame.players[1].invested = 50;
    currentGame.players[2].invested = 50;

    currentGame.updateRound();

    assert.strictEqual(currentGame.round, 1);
    assert.strictEqual(currentGame.board.length, 3);
    assert.strictEqual(currentGame.pots.length, 1);
    assert.strictEqual(currentGame.pots[0], 150);
  });

  it("Should move to round 2, The Turn", () => {
    currentGame.players[0].invested = 100;
    currentGame.players[1].invested = 100;
    currentGame.players[2].invested = 100;

    currentGame.updateRound();

    assert.strictEqual(currentGame.round, 2);
    assert.strictEqual(currentGame.board.length, 4);
    assert.strictEqual(currentGame.pots.length, 1);
    assert.strictEqual(currentGame.pots[0], 450);
  });

  it("Should move to round 3, The River", () => {
    currentGame.players[0].invested = 200;
    currentGame.players[1].invested = 200;
    currentGame.players[2].invested = 200;

    currentGame.updateRound();

    assert.strictEqual(currentGame.round, 3);
    assert.strictEqual(currentGame.board.length, 5);
    assert.strictEqual(currentGame.pots.length, 1);
    assert.strictEqual(currentGame.pots[0], 1050);
  });

  it("Should move to round 1, with 2 Pots - 150 & 100", () => {
    currentGame.start();
    currentGame.players[0].invested = 50;
    currentGame.players[1].invested = 100;
    currentGame.players[2].invested = 100;

    currentGame.updateRound();

    assert.strictEqual(currentGame.round, 1, "should be round 1");
    assert.strictEqual(
      currentGame.board.length,
      3,
      "should have 3 cards on the board"
    );
    assert.strictEqual(currentGame.pots.length, 2, "should have 2 pots");
    assert.deepStrictEqual(
      currentGame.pots,
      [150, 100],
      "pots should be 50 & 100 Respectively"
    );
  });
});

describe("Evaluates Hand Results", () => {
  beforeEach(() => {
    currentGame.start();
  });

  it("should be a High Card Win, Player 0 Wins", () => {
    currentGame.players[0].cards = ["AS", "4S"];
    currentGame.players[0].invested = 50;
    currentGame.players[1].cards = ["5H", "6C"];
    currentGame.players[1].invested = 50;
    currentGame.players[2].cards = ["4D", "5S"];
    currentGame.players[2].invested = 50;
    currentGame.board = ["7C", "8H", "QS", "TD", "JS"];

    currentGame.solveHands();

    assert.strictEqual(currentGame.winDesc, "A High");
    assert.strictEqual(currentGame.players[0].result, 150);
  });
});
