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
import { classMap } from "lit-html/directives/class-map";
import { GameState, PlayerState, UserType } from "../common/types";
import { roundToPrecision } from "../common/round-to-precision";
import {
  sendPlayerAction,
  startGame,
  leaveGame,
  callClock,
  sendMessage,
  subscribeToMessage,
} from "../api/connection";
import { turnActions } from "../common/const";

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
  @property() public user!: UserType;
  @property() private bet?: string;
  @property() private messages: string[] = [];
  private player?: PlayerState;
  private scrolled: boolean = false;

  protected render(): TemplateResult {
    if (!this.game) {
      return html``;
    }

    this.player = this.game.players.find(
      (player) => player.playerID === this.game.currentPlayerID
    );

    this.bet = this.bet || "";

    if (!this.player) {
      return html``;
    }

    if (this.bet === "" && this.player.isTurn && !this.game.isGameOver) {
      this.bet = (this.game.currentBet !== 0
        ? this.game.currentBet + this.game.bigBlind
        : this.game.bigBlind + this.game.smallBlind
      ).toFixed(2);
    }

    const playerBetNum = roundToPrecision(parseFloat(this.bet), 0.01);
    const playerStackRounded = roundToPrecision(this.player.stackAmount, 0.01);

    const raiseDisabled =
      (playerBetNum < this.game.currentBet + this.game.bigBlind ||
        playerBetNum > playerStackRounded ||
        this.bet === "") &&
      playerBetNum !== playerStackRounded;

    const betDisabled =
      (playerBetNum < this.game.bigBlind ||
        playerBetNum > playerStackRounded ||
        this.bet === "") &&
      playerBetNum !== playerStackRounded;

    return html`
      <div class="action-box md-box flex-end">
        <div class="scroll-box" @scroll=${this._boxScrolled}>
          ${this.messages.map(
            (handText) =>
              html`
                <p>${handText}</p>
                <hr />
              `
          )}
        </div>
        <div class="chat-input-wrapper">
          <input
            type="text"
            class="chat-input"
            @keydown=${this._enterKeyPress}
          />
          <button class="chat-send" @click=${this._chatMessage}>
            Send
          </button>
        </div>
      </div>
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
                        ?disabled=${raiseDisabled}
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
                        ?disabled=${betDisabled}
                      >
                        Bet
                      </button>
                    `}
              `}
        </div>
        <div>
          <input
            @keyup=${this._setBetFromText}
            .value=${this.bet}
            class="bet-text input"
            type="number"
            step="${this.game.bigBlind}"
            min="0"
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

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!changedProps.has("game")) {
      return this.bet !== "";
    }

    return true;
  }

  protected firstUpdated(): void {
    subscribeToMessage(this.socket, (message: string) => {
      this.messages.push(message);
    });
  }

  protected updated(changedProps: PropertyValues): void {
    if (!changedProps.has("game")) {
      return;
    }

    const scrollBox = this.shadowRoot!.querySelector(
      ".scroll-box"
    ) as HTMLElement;

    if (!scrollBox) {
      return;
    }

    scrollBox.scrollTop = !this.scrolled
      ? scrollBox.scrollHeight
      : scrollBox.scrollTop;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: flex;
        justify-content: center;
      }
      .action-box {
        background-color: #383d45;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
        border-radius: 5px;
        width: 400px;
        padding: 10px;
        margin-top: 20px;
        margin-right: 20px;
        height: 145px;
      }
      .sm-box {
        width: 175px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
      .md-box {
        width: 250px;
        display: flex;
        flex-direction: column;
      }
      .scroll-box {
        overflow: auto;
        color: #949ea8;
        width: 100%;
        overflow-x: hidden;
      }
      .scroll-box::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      .scroll-box::-webkit-scrollbar-track {
        border: 1px solid rgb(68, 71, 92);
        border-radius: 10px;
      }
      .scroll-box::-webkit-scrollbar-thumb {
        background: rgb(68, 71, 92);
        border-radius: 10px;
      }
      .scroll-box::-webkit-scrollbar-thumb:hover {
        background: rgb(42, 44, 60);
      }
      .scroll-box p {
        margin: 0;
        margin-bottom: 5px;
      }
      .scroll-box hr {
        width: 100%;
      }
      .chat-input {
        background-color: #2b3138;
        border: none;
        border-radius: 4px;
        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 6px;
        padding-bottom: 6px;
        flex: 2;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        color: white;
      }
      .chat-send {
        box-shadow: none;
        color: #fff;
        margin-left: -1px;
        background-color: #0083e2;
        border-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border: 1px solid transparent;
      }
      .chat-input-wrapper {
        display: flex;
        justify-content: start;
        margin-top: 5px;
      }
      .flex-end {
        justify-content: flex-end;
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
        background-color: #1c6de1;
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
        background-color: #2b3138;
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

  private get _chatInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(".chat-input") as HTMLInputElement;
  }

  private _setBet(e: MouseEvent): void {
    if (!this.player) {
      return;
    }

    this.bet = roundToPrecision(
      (e.target! as BetTarget).multiplier *
        (this.game.pot + this.game.currentPot),
      0.01
    )
      .toFixed(2)
      .toString();
  }

  private _setBetFromText(e: KeyboardEvent) {
    if (!this.player) {
      return;
    }

    this.bet = (e.target! as TextBetTarget).value.toString();
  }

  private _callPlayerAction(e: MouseEvent): void {
    if (!this.player) {
      return;
    }

    const action: string = (e.target! as ActionTarget).action;

    if (
      parseFloat(this.bet!) > this.player.stackAmount &&
      (action === "raise" || action === "bet")
    ) {
      return;
    }

    const amount: string =
      action !== "rebuy" ? this.bet! : this._rebuyInput.value;

    sendPlayerAction(
      this.socket,
      this.user.userID,
      this.game.gameID,
      action,
      amount
    );

    if (turnActions.has(action)) {
      this.bet = "";
    }

    if (action === "rebuy") {
      alert(
        `You bought $${this._rebuyInput.value} that will be added after this hand`
      );
    }
  }

  private _startGame(): void {
    startGame(this.socket, this.game.gameID);
  }

  private _leaveGame(): void {
    leaveGame(this.socket, this.user.userID, this.game.gameID);
  }

  private _callClock(): void {
    callClock(this.socket, this.game.gameID);
  }

  private _boxScrolled(e: Event): void {
    const scrollBox: HTMLElement = e.target as HTMLElement;

    this.scrolled =
      scrollBox.scrollTop + scrollBox.clientHeight !== scrollBox.scrollHeight
        ? true
        : false;
  }

  private _enterKeyPress(ev: KeyboardEvent): void {
    if (ev.keyCode === 13) {
      this._chatMessage();
    }
  }

  private _chatMessage(): void {
    if (this._chatInput.value === "") {
      return;
    }

    sendMessage(
      this.socket,
      this.user.userID,
      this.game.gameID,
      this._chatInput.value
    );

    this._chatInput.value = "";
  }
}
