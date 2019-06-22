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
import "./card";

@customElement("table-element")
export class Table extends LitElement {
  @property() public game?: Game;
  @property() private socket?: SocketIOClient.Socket;

  public constructor() {
    super();
    this._initialize();
  }

  protected render(): TemplateResult {
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
                    <div class="cards">
                      ${player.cards.map(
                        card => html`
                          <card-element
                            .card=${card}
                            .show=${true}
                          ></card-element>
                        `
                      )}
                    </div>
                  `
              )}
            </div>
            <button type="button" @click=${this._reDeal}>Click Me!</button>
          `}
    `;
  }

  static get styles(): CSSResult {
    return css`
      #Table {
        background-image: url("../static/images/table.jpg");
        width: 1000px;
        height: 500px;
        margin: auto;
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
