import { PlayerType } from "../types";
import { roundToPrecision } from "../round-to-precision";

export class Player implements PlayerType {
  public cards: string[] = [];
  public name: string;
  public playerID: string;
  public stackAmount: number = 5.0;
  public isTurn: boolean = false;
  public dealer: boolean = false;
  public isLittleBlind: boolean = false;
  public isBigBlind: boolean = false;
  public status: string = "";
  public bet: string = "";
  public invested: number = 0;
  public result: number = 0;
  public pendingSitOut: boolean = false;
  public isSittingOut: boolean = false;
  public isLastAggressor: boolean = false;
  public showCards: boolean = false;
  public pendingBuyIn: number = 0;

  get isActive(): boolean {
    return this.cards.length === 2 && this.status !== "fold";
  }

  get isCheck(): boolean {
    return this.status === "check";
  }

  get numBet(): number {
    return roundToPrecision(parseFloat(this.bet), 0.01);
  }

  constructor(uuid: string, name: string) {
    this.name = name;
    this.playerID = uuid;
  }

  public subtractBet(currentBet: number): void {
    const turnBet =
      roundToPrecision(currentBet, 0.01) -
      roundToPrecision(parseFloat(this.bet) || 0, 0.01);

    this.stackAmount = roundToPrecision(this.stackAmount, 0.01) - turnBet;
    this.invested = roundToPrecision(this.invested, 0.01) + turnBet;
  }

  public setBigBlind(blind: number): void {
    this.isBigBlind = true;
    const amount = this.stackAmount < blind ? this.stackAmount : blind;
    this.bet = amount.toFixed(2);
    this.stackAmount -= amount;
    this.invested += amount;
  }

  public setLittleBlind(blind: number): void {
    this.isLittleBlind = true;
    const amount = this.stackAmount < blind ? this.stackAmount : blind;
    this.bet = amount.toFixed(2);
    this.stackAmount -= amount;
    this.invested += amount;
  }

  public cleanPlayer(): void {
    this.cards = [];
    this.isTurn = false;
    this.isBigBlind = false;
    this.isLittleBlind = false;
    this.isLastAggressor = false;
    this.showCards = false;
    this.invested = 0;
    this.result = 0;
  }
}
