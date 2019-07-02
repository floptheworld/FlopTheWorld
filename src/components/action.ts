import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import { GameState, PlayerState } from "../common/types";
import { roundToPrecision } from "../common/round-to-precision";
import {
  sendPlayerAction,
  startGame,
  leaveGame,
  callClock,
} from "../data/connection";

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
  @property() public socket!: SocketIOClient.Socket;
  @property() private player?: PlayerState;

  protected render(): TemplateResult {
    if (!this.game) {
      return html``;
    }

    this.player = this.game.players.find(
      (player) => player.playerID === this.game.currentPlayerID
    );

    if (!this.player) {
      return html``;
    }

    if (this.player.bet === "" && this.player.isTurn && !this.game.isGameOver) {
      this.player.bet = (this.game.currentBet !== 0
        ? this.game.currentBet + this.game.bigBlind
        : this.game.bigBlind + this.game.littleBlind
      ).toFixed(2);
    }

    return html`
      <div class="action-box">
        <div class="main-actions">
          ${!this.player.isTurn || this.game.isGameOver || !this.game.isStarted
            ? ""
            : html`
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
                          parseFloat(this.player.bet) >
                            this.player.stackAmount ||
                          this.player.bet === ""}
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
                          parseFloat(this.player.bet) >
                            this.player.stackAmount ||
                          this.player.bet === ""}
                      >
                        Bet
                      </button>
                    `}
              `}
        </div>
        <div>
          <input
            @keyup=${this._setBetFromText}
            .value=${this.player.bet}
            class="bet-text input"
            type="number"
          />
        </div>
        <div class="bottom-main-box">
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
          <div class="timer">${this.game.timer || ""}</div>
        </div>
      </div>
      <div class="action-box sm-box">
        <div class="rebuy-action">
          <button
            .action=${"rebuy"}
            @click=${this._callPlayerAction}
            class="button dark-blue-button width-50 rebuy-button"
          >
            Buy Chips
          </button>
          <input
            class="input rebuy-input width-50"
            type="number"
            step="0.1"
            min="0"
          />
        </div>
        <div class="sit-out-action">
          <button
            .action=${"toggleSitOut"}
            @click=${this._callPlayerAction}
            class="${classMap({
              button: true,
              "dark-blue-button": true,
              "sit-out-button": true,
              "width-50": this.player.isSittingOut,
            })}"
          >
            ${this.player.isSittingOut || this.player.pendingSitOut
              ? html`
                  Sit Down
                `
              : html`
                  Sit Out
                `}
          </button>
          ${!this.player.isSittingOut
            ? ""
            : html`
                <button
                  @click=${this._leaveGame}
                  class="button red-button leave-button width-50"
                >
                  Leave
                </button>
              `}
        </div>
        ${this.game.isStarted ||
        this.game.sittingInPlayers.length < 2 ||
        this.player.isSittingOut
          ? ""
          : html`
              <div class="start-game-action">
                <button
                  @click=${this._startGame}
                  class="button green-button start-game-button"
                >
                  Start Game!
                </button>
              </div>
            `}
        ${this.game.timer !== undefined ||
        !this.game.isStarted ||
        this.player.isSittingOut ||
        this.game.isGameOver ||
        this.game.isOpen
          ? ""
          : html`
              <button @click=${this._callClock} class="button dark-blue-button">
                Call Clock
              </button>
            `}
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: flex;
        justify-content: center;
      }
      .action-box {
        background-color: #373737;
        border-radius: 5px;
        width: 400px;
        padding: 10px;
        margin-top: 20px;
        margin-right: 20px;
      }
      .sm-box {
        width: 175px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
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
      .input {
        padding: 10px;
        border: none;
        border-radius: 5px;
        margin: 10px 0px;
        color: white;
        background-color: #5f5f5f;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box; /* Firefox, other Gecko */
        box-sizing: border-box;
      }
      .bet-text {
        display: block;
        width: 100%;
      }
      .rebuy-input {
        flex-grow: 1;
        width: 0rem;
        margin: 0 0 0 5px;
      }
      .rebuy-action,
      .sit-out-action {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sit-out-button,
      .start-game-button {
        width: 100%;
      }
      .width-50 {
        width: calc(50% - 5px);
      }
      .leave-button {
        margin: 0 0 0 5px;
        flex-grow: 1;
      }
      .main-actions {
        height: 37px;
      }
      .rebuy-button {
        font-size: 12px;
      }
      .bottom-main-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .timer {
        color: white;
        padding-right: 4px;
      }
    `;
  }

  private get _rebuyInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(".rebuy-input") as HTMLInputElement;
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

    const action: string = (e.target! as ActionTarget).action;

    if (
      parseFloat(this.player.bet) > this.player.stackAmount &&
      (action === "raise" || action === "bet")
    ) {
      return;
    }

    const amount: string =
      action !== "rebuy" ? this.player.bet : this._rebuyInput.value;

    sendPlayerAction(this.socket, this.game.gameID, action, amount);
  }

  private _startGame(): void {
    startGame(this.socket, this.game.gameID);
  }

  private _leaveGame(): void {
    leaveGame(this.socket, this.game.gameID);
  }

  private _callClock(): void {
    callClock(this.socket, this.game.gameID);
  }
}
