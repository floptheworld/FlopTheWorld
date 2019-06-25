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
import { createConnection } from "../data/connection";
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
        ? ""
        : html`
            <div id="Table">
              ${this.game.players.map(
                (player, index) =>
                  html`
                    <seat-element
                      .seatNumber=${index}
                      .player=${player}
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
              .player=${this.game.player}
              .currentBet=${this.game.currentBet}
              .currentPot=${this.game.currentPot}
              .pot=${this.game.pot}
              @playerAction=${this._playerAction}
            ></action-element>
            <button type="button" @click=${this._startGame}>Start Game!</button>
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
        border: 5px solid #000;
        position: relative;
      }
      .table-pot {
        position: absolute;
        background-color: #333;
        border: 2px solid #000;
        color: #fcbd07;
        text-align: center;
        font-weight: bold;
        left: 479px;
        top: 160px;
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

  private _startGame(): void {
    this.socket!.emit("startGame", this.game!.gameID);
  }

  private _playerAction(e: CustomEvent): void {
    this.socket!.emit(
      "playerAction",
      this.game!.gameID,
      localStorage.userID,
      e.detail.action,
      e.detail.bet
    );
  }
}
