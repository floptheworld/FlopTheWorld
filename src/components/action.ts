import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
  PropertyValues,
} from "lit-element";
import { GameState, Player } from "../common/types";
import { roundToPrecision } from "../common/functions";

interface BetTarget extends EventTarget {
  multiplier: number;
}

interface TextBetTarget extends EventTarget {
  value: number;
}

interface ActionTarget extends EventTarget {
  action: string;
}

@customElement("action-element")
export class Action extends LitElement {
  @property() public game!: GameState;
  @property() private player?: Player;

  protected render(): TemplateResult {
    return html`
      ${!this.player || !this.player.isTurn
        ? ""
        : html`
            <div class="action-box">
              <div class="main-actions">
                ${this.game.currentBet <= 0
                  ? ""
                  : html`
                      <button
                        .action=${"fold"}
                        @click=${this._callPlayerAction}
                        class="button red-button action-button"
                        id="fold-button"
                      >
                        Fold
                      </button>
                      <button
                        .action=${"call"}
                        @click=${this._callPlayerAction}
                        class="button green-button action-button"
                        id="call-button"
                      >
                        Call
                      </button>
                      <button
                        .action=${"raise"}
                        @click=${this._callPlayerAction}
                        class="button blue-button action-button"
                        id="raise-button"
                        ?disabled=${parseFloat(this.player.bet) <
                          this.game.currentBet + this.game.bigBlind ||
                          parseFloat(this.player.bet) > this.player.stackAmount}
                      >
                        Raise
                      </button>
                    `}
                ${this.game.currentBet !== 0
                  ? ""
                  : html`
                      <button
                        .action=${"check"}
                        @click=${this._callPlayerAction}
                        class="button green-button action-button"
                        id="check-button"
                      >
                        Check
                      </button>
                      <button
                        .action=${"bet"}
                        @click=${this._callPlayerAction}
                        class="button blue-button action-button"
                        id="bet-button"
                        ?disabled=${parseFloat(this.player.bet) <
                          this.game.bigBlind ||
                          parseFloat(this.player.bet) > this.player.stackAmount}
                      >
                        Bet
                      </button>
                    `}
              </div>
              <div>
                <input
                  @keyup=${this._setBetFromText}
                  .value=${this.player.bet}
                  class="bet-text"
                  type="text"
                />
              </div>
              <div class="bet-actions">
                <button
                  .multiplier=${0.25}
                  @click=${this._setBet}
                  class="button-small dark-blue-button"
                >
                  1/4
                </button>
                <button
                  .multiplier=${0.5}
                  @click=${this._setBet}
                  class="button-small dark-blue-button"
                >
                  1/2
                </button>
                <button
                  .multiplier=${0.75}
                  @click=${this._setBet}
                  class="button-small dark-blue-button"
                >
                  3/4
                </button>
                <button
                  .multiplier=${1}
                  @click=${this._setBet}
                  class="button-small dark-blue-button"
                >
                  Full
                </button>
              </div>
            </div>
          `}
    `;
  }

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (!this.game) {
      return;
    }

    this.player = this.game.players.find(
      (player) => player.playerID === this.game.currentPlayerID
    );
  }

  static get styles(): CSSResult {
    return css`
      .action-box {
        background-color: #333;
        border: 2px solid #000;
        width: 400px;
        margin: auto;
        padding: 10px;
        margin-top: 20px;
      }
      .button:hover,
      .button-small:hover {
        opacity: 0.8;
        cursor: pointer;
      }
      .button,
      .button-small {
        border-radius: 5px;
        padding: 10px;
        color: white;
      }
      .button-small {
        font-size: 10px;
      }
      .red-button {
        border: 1px solid #6f0000;
        background-color: #bf0000;
      }
      .green-button {
        border: 1px solid #003000;
        background-color: green;
      }
      .blue-button {
        border: 1px solid #003f69;
        background-color: #0065a9;
      }
      .dark-blue-button {
        border: 1px solid #003f69;
        background-color: #004c80;
      }
      .button-gray,
      .button[disabled] {
        border: 1px solid #202020;
        background-color: #808080;
      }
      .bet-text {
        padding: 10px;
        border: 1px solid #000;
        border-radius: 5px;
        display: block;
        width: 100%;
        margin: 10px 0px;
        color: white;
        background-color: #5f5f5f;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box; /* Firefox, other Gecko */
        box-sizing: border-box;
      }
    `;
  }

  private _setBet(e: MouseEvent): void {
    if (!this.player) {
      return;
    }

    this.player.bet = roundToPrecision(
      (e.target! as BetTarget).multiplier *
        (this.game.pot + this.game.currentPot),
      0.01
    ).toString();
    this.requestUpdate();
  }

  private _setBetFromText(e: KeyboardEvent) {
    if (!this.player) {
      return;
    }

    this.player.bet = (e.target! as TextBetTarget).value.toString();
    this.requestUpdate();
  }

  private _callPlayerAction(e: MouseEvent): void {
    if (!this.player) {
      return;
    }
    if (parseFloat(this.player.bet) > this.player.stackAmount) {
      return;
    }
    this.player.status = (e.target! as ActionTarget).action;

    this.dispatchEvent(
      new CustomEvent("playerAction", {
        detail: { bet: this.player.bet, action: this.player.status },
      })
    );
  }
}
