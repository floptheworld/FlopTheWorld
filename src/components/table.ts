import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult
} from "lit-element";
import { Game } from "../common/types";
import { createConnection } from "../data/connection";
import "./action";
import "./card";
import "./seat";

@customElement("table-element")
export class Table extends LitElement {
  @property() public game?: Game;
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
            <p class="App-intro">
              This is the timer value: ${this.game.time}
            </p>
            <div id="Table">
              ${this.game.players.map(
                player =>
                  html`
                    <seat-element .player=${player}></seat-element>
                  `
              )}
            </div>
            <action-element></action-element>
            <button type="button" @click=${this._reDeal}>Click Me!</button>
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

  private async _initialize() {
    this.socket = await createConnection((game: Game) => (this.game = game));
  }

  private _reDeal(): void {
    this.socket!.emit("redeal", this.game);
  }
}
