import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { GameState } from "../common/types";
import { createConnection, findOrCreatePlayer } from "../data/connection";
import "./action";
import "./board";
import "./card";
import "./seat";

@customElement("table-element")
export class Table extends LitElement {
  @property() public game?: GameState;
  @property() private socket?: SocketIOClient.Socket;

  public constructor() {
    super();
    this._initialize();
  }

  protected render(): TemplateResult {
    // tslint:disable-next-line: no-console
    console.log(this.game);

    return html`
      ${!this.game
        ? html`
            <div class="login-box">
              <p class="player-input-label">Choose a Nickname</p>
              <input
                @keydown=${this._enterKeyPress}
                type="text"
                class="player-input"
              />
              <button
                type="button"
                class="button green-button"
                @click=${this._createPlayer}
              >
                Join Game!
              </button>
            </div>
          `
        : html`
            <div id="Table">
              ${this.game.players.map(
                (player, index) =>
                  html`
                    <seat-element
                      .seatNumber=${index}
                      .player=${player}
                      .currentPlayerID=${this.game!.currentPlayerID}
                    ></seat-element>
                  `
              )}
              <div id="Board">
                <board-element .cards=${this.game.board}></board-element>
              </div>
              ${this.game.pot === 0
                ? ""
                : html`
                    <div class="table-pot">
                      <p>$${this.game.pot.toFixed(2)}</p>
                    </div>
                  `}
            </div>
            <action-element
              .game=${this.game}
              @playerAction=${this._playerAction}
            ></action-element>
            <button type="button" @click=${this._startGame}>Start Game!</button>
            ${this.game.winDesc}
          `}
    `;
  }

  static get styles(): CSSResult {
    return css`
      #Table {
        width: 1000px;
        height: 500px;
        margin: auto;
        background-color: #8a0000;
        border-radius: 50%;
        position: relative;
        box-shadow: 0px 0px 20px #000;
        -webkit-box-shadow: 0px 0px 20px #000;
      }
      .login-box {
        background-color: #373737;
        border-radius: 5px;
        width: 300px;
        margin: auto;
        padding: 20px;
        margin-top: 10%;
      }
      .player-input-label {
        font-weight: bold;
        color: white;
        margin: 0px;
      }
      .green-button {
        border: 1px solid #003000;
        background-color: green;
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
      .player-input {
        padding: 10px;
        border: none;
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
      .table-pot {
        position: absolute;
        background-color: #333;
        border-radius: 5px;
        color: #fcbd07;
        text-align: center;
        font-weight: bold;
        left: 479px;
        top: 160px;
        box-shadow: 0px 0px 4px #000;
        -webkit-box-shadow: 0px 0px 4px #000;
      }
      .table-pot p {
        margin: 0px;
        padding: 5px;
      }
      #Board {
        position: absolute;
        left: 342px;
        top: 205px;
      }
      .App-intro {
        color: #fff;
        font-weight: bold;
      }
      #Table seat-element:nth-child(1) {
        position: absolute;
        bottom: 0px;
        left: 200px;
      }
      #Table seat-element:nth-child(2) {
        position: absolute;
        bottom: 100px;
        left: 0px;
      }
      #Table seat-element:nth-child(3) {
        position: absolute;
        top: 100px;
        left: 0px;
      }
      #Table seat-element:nth-child(4) {
        position: absolute;
        top: 0px;
        left: 200px;
      }
      #Table seat-element:nth-child(5) {
        position: absolute;
        top: 0px;
        right: 200px;
      }
      #Table seat-element:nth-child(6) {
        position: absolute;
        top: 100px;
        right: 0px;
      }
      #Table seat-element:nth-child(7) {
        position: absolute;
        bottom: 100px;
        right: 0px;
      }
      #Table seat-element:nth-child(8) {
        position: absolute;
        bottom: 0px;
        right: 200px;
      }
    `;
  }

  private async _initialize(): Promise<void> {
    this.socket = await createConnection(
      (game: GameState) => (this.game = game)
    );
  }

  private get _playerNameInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(".player-input") as HTMLInputElement;
  }

  private _enterKeyPress(ev: KeyboardEvent): void {
    if (ev.keyCode === 13) {
      this._createPlayer();
    }
  }

  private _startGame(): void {
    this.socket!.emit("startGame", this.game!.gameID);
  }

  private _createPlayer(): void {
    findOrCreatePlayer(this.socket!, this._playerNameInput.value);
  }

  private _playerAction(e: CustomEvent): void {
    this.socket!.emit(
      "playerAction",
      this.game!.gameID,
      localStorage.playerID,
      e.detail.action,
      e.detail.bet
    );
  }
}
