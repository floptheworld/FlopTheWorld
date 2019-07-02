import { PlayerType, GameState } from "../types";
import { GamePlay } from "./game-play";

export class Game extends GamePlay {
  constructor(
    gameID: string,
    bigBlind: number,
    littleBlind: number,
    cardBack: string
  ) {
    super(gameID, bigBlind, littleBlind, cardBack);
  }

  public getGameState(currentPlayerID: string): GameState {
    return {
      board: this.board,
      gameID: this.gameID,
      players: this.isOpen
        ? this.players
        : this.getGameStatePlayers(currentPlayerID),
      pot: this.pot,
      round: this.round,
      bigBlind: this.bigBlind,
      littleBlind: this.littleBlind,
      currentBet: this.currentBet,
      currentPot: this.currentPot,
      currentPlayerID,
      cardBack: this.cardBack,
      winDesc: this.winDesc,
      pots: this.pots,
      isGameOver: this.isGameOver,
      isStarted: this.isStarted,
      isOpen: this.isOpen,
      sittingInPlayers: this.sittingInPlayers,
      timer: this.timer,
    };
  }

  public getGameStatePlayers(currentPlayerID: string): PlayerType[] {
    const copyPlayers = this.players.map((player) => ({ ...player }));

    copyPlayers
      .filter(
        (player) =>
          player.playerID !== currentPlayerID && player.cards.length > 0
      )
      .map((player) => {
        player.cards = player.showCards
          ? player.cards
          : [this.cardBack, this.cardBack];
      });

    return copyPlayers;
  }

  public addPlayer(player: PlayerType): void {
    this.players.push(player);
  }

  public removePlayer(removePlayer: PlayerType): void {
    this.players.splice(
      this.players.findIndex((player) => player === removePlayer),
      1
    );
  }

  public findPlayerByID(userID: string): PlayerType | undefined {
    return this.players.find((player) => player.playerID === userID);
  }

  public playerAction(player: PlayerType, action: string, data: string): void {
    const dataNum = parseFloat(data);

    if (data !== "" && isNaN(dataNum)) {
      return;
    }

    this.actionPlayed(player, action, dataNum);
  }

  public OpenGame(callback: () => void): void {
    this.updateRound();
    callback();

    if (this.isGameOver) {
      this.solveHands();
      this.updatePlayerStacks();

      setTimeout(() => {
        this.start();
        callback();
      }, 5000);
      return;
    }

    setTimeout(() => this.OpenGame(callback), 3000);
  }

  public showdown(callback: () => void): void {
    this.solveHands();

    const winnerFound: boolean = false;
    const lastAggressorIndex = this.activePlayers.findIndex(
      (player) => player.isLastAggressor === true
    );
    const resultTemp: number[] = [];
    this.activePlayers.map((activePlayer) =>
      resultTemp.push(activePlayer.result)
    );

    setTimeout(
      () =>
        this.showdownHelper(lastAggressorIndex, winnerFound, resultTemp, () =>
          callback()
        ),
      1500
    );
  }

  private showdownHelper(
    lastAggressorIndex: number,
    winnerFound: boolean,
    resultTemp: number[],
    callback: () => void
  ): void {
    if (
      this.activePlayers.filter((activePlayer) => activePlayer.result > 0)
        .length === 0
    ) {
      this.activePlayers.map(
        (activePlayer, i) => (activePlayer.result = resultTemp[i])
      );

      this.updatePlayerStacks();
      callback();

      setTimeout(() => {
        this.start();
        callback();
      }, 5000);

      return;
    }

    const player = this.activePlayers[lastAggressorIndex];

    if (!player) {
      lastAggressorIndex = 0;

      this.showdownHelper(lastAggressorIndex, winnerFound, resultTemp, () =>
        callback()
      );
      return;
    }

    lastAggressorIndex++;

    if (winnerFound && player.result === 0) {
      this.showdownHelper(lastAggressorIndex, winnerFound, resultTemp, () =>
        callback()
      );
      return;
    }

    if (player.result > 0) {
      winnerFound = true;
      player.result = 0;
    }

    player.showCards = true;
    callback();
    setTimeout(
      () =>
        this.showdownHelper(lastAggressorIndex, winnerFound, resultTemp, () =>
          callback()
        ),
      1500
    );
  }
}
