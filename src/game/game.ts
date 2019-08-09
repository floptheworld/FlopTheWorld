import { PlayerType, GameState } from "../common/types";
import { GamePlay } from "./game-play";

export class Game extends GamePlay {
  public getGameState(currentPlayerID: string): GameState {
    return {
      board: this.board,
      gameID: this.gameID,
      name: this.name,
      players: this.isOpen
        ? this.players
        : this.getGameStatePlayers(currentPlayerID),
      pot: this.pot,
      round: this.round,
      bigBlind: this.bigBlind,
      smallBlind: this.smallBlind,
      currentBet: this.currentBet,
      currentPot: this.currentPot,
      currentPlayerID,
      cardBack: this.cardBack,
      winDesc: !this.showWinningDescription ? "" : this.winDesc,
      pots: this.pots,
      isGameOver: this.isGameOver,
      isStarted: this.isStarted,
      isOpen: this.isOpen,
      sittingInPlayers: this.sittingInPlayers,
      timer: this.timer,
      handCount: this.handCount,
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

  public removePlayer(removePlayer: PlayerType): void {
    this.players.splice(
      this.players.findIndex((player) => player === removePlayer),
      1
    );
  }

  public findPlayerByID(userID: string): PlayerType | undefined {
    return this.players.find((player) => player.playerID === userID);
  }

  public playerAction(
    player: PlayerType,
    action: string,
    data: string,
    callback: () => void
  ): void {
    const dataNum = parseFloat(data);

    if (data !== "" && isNaN(dataNum)) {
      return;
    }

    this.actionPlayed(player, action, dataNum);

    if (this.isOpen) {
      this.OpenGame(() => callback());
      return;
    }

    // Game has ended, show last cards and winning desc then wait 5 secs and start a new game
    if (this.isGameOver) {
      callback();
      this.showdown(() => callback());
      return;
    }

    callback();
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
    // Everyone has folded but one player
    if (this.activePlayers.length === 1) {
      this.pots.map(
        (pot) => (this.activePlayers[0].stackAmount += parseFloat(pot))
      );
      this.activePlayers[0].stackAmount += this.currentPot;
      this.activePlayers[0].result += this.currentPot;
      callback();

      setTimeout(() => {
        this.start();
        callback();
      }, 1500);
      return;
    }

    this.solveHands();

    const resultTemp: number[] = [];
    const winnerFound: boolean = false;
    const lastAggressorIndex = this.activePlayers.findIndex(
      (player) => player.isLastAggressor === true
    );

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
    // If there are no more players hands to show
    if (
      this.activePlayers.filter((activePlayer) => activePlayer.result > 0)
        .length === 0
    ) {
      this.activePlayers.map(
        (activePlayer, i) => (activePlayer.result = resultTemp[i])
      );

      this.updatePlayerStacks();
      this.showWinningDescription = true;
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
