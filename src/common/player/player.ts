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

  get isActive(): boolean {
    return this.status !== "fold";
  }

  get isCheck(): boolean {
    return this.status === "check";
  }

  get numBet(): number {
    return parseFloat(this.bet);
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
    this.bet = blind.toString();
    this.stackAmount -= blind;
    this.invested += blind;
  }

  public setLittleBlind(blind: number): void {
    this.isLittleBlind = true;
    this.bet = blind.toString();
    this.stackAmount -= blind;
    this.invested += blind;
  }

  public cleanPlayer(): void {
    this.cards = [];
    this.isTurn = false;
    this.isBigBlind = false;
    this.isLittleBlind = false;
    this.invested = 0;
    this.result = 0;
  }
}
