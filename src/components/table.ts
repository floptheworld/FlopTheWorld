import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { GameState, User } from "../common/types";
import { connectToGame, createConnection, getUser } from "../data/connection";
import "./action";
import "./board";
import "./card";
import "./seat";
import "./nav-bar";

@customElement("table-element")
export class Table extends LitElement {
  @property() public game?: GameState;
  @property() private socket?: SocketIOClient.Socket;
  @property() private user?: User;

  public constructor() {
    super();
    this._initialize();
  }

  protected render(): TemplateResult {
    // tslint:disable-next-line: no-console
    console.log(this.game); // TODO: Remove before production build

    return html`
      ${!this.game || !this.user
        ? html``
        : html`
            <nav-bar .user=${this.user}></nav-bar>
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
              ${this.game.pots.length === 0
                ? ""
                : html`
                    <div class="table-pot">
                      <p>
                        $${this.game.pots.map(
                          (pot) =>
                            html`
                              ${pot.toFixed(2)}
                            `
                        )}
                      </p>
                    </div>
                  `}
              <div id="Board">
                <board-element .cards=${this.game.board}></board-element>
              </div>
              ${this.game.winDesc === ""
                ? ""
                : html`
                    <div id="WinDesc">${this.game.winDesc}</div>
                  `}
            </div>
            <action-element
              .socket=${this.socket!}
              .user=${this.user}
              .game=${this.game}
            ></action-element>
          `}
    `;
  }

  static get styles(): CSSResult {
    return css`
      #Table {
        width: 1000px;
        height: 500px;
        margin: auto;
        background-color: #24263b;
        border-radius: 50%;
        position: relative;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 15px solid rgb(56, 61, 70);
      }
      #Table:before {
        content: "";
        border: 7px solid rgba(0, 0, 0, 0.1);
        display: block;
        width: 1015px;
        height: 515px;
        border-radius: 50%;
        position: absolute;
      }
      #Table:after {
        content: "";
        border: 7px solid rgba(0, 0, 0, 0.1);
        display: block;
        width: 985px;
        height: 485px;
        border-radius: 50%;
        position: absolute;
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
      .table-pot {
        position: absolute;
        background: hsla(230, 6%, 25%, 1);
        text-align: center;
        padding: 0px 15px;
        height: 30px;
        color: #d4d4d4;
        font-size: 16px;
        line-height: 30px;
        border-radius: 25px;
        left: 479px;
        top: 160px;
      }
      .table-pot p {
        margin: 0px;
      }
      #Board {
        border: 5px solid hsla(233, 18%, 28%, 1);
        width: 317px;
        padding: 5px 5px 0px 5px;
        border-radius: 8px;
        height: 95px;
      }
      .App-intro {
        color: #fff;
        font-weight: bold;
      }
      #WinDesc {
        position: absolute;
        background: hsla(230, 6%, 25%, 1);
        border-radius: 25px;
        color: #d4d4d4;
        text-align: center;
        width: 11rem;
        left: 415px;
        top: 325px;
        padding: 0px 15px;
        height: 30px;
        font-size: 16px;
        line-height: 30px;
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
    await getUser().then((user) => (this.user = user));
    if (!this.user) {
      window.location.href = "/";
      return;
    }

    this.socket = await createConnection(this.user.userID);
    await await connectToGame(
      this.socket,
      this.user.userID,
      (game: GameState) => (this.game = game)
    );
  }
}
