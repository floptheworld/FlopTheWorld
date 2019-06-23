import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult
} from "lit-element";
import { GameState } from "../common/types";
import { createConnection } from "../data/connection";
import "./card";

@customElement("table-element")
export class Table extends LitElement {
  @property() public game?: GameState;
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
            <button type="button" @click=${this._startGame}>Start Game!</button>
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

  private async _initialize(): Promise<void> {
    this.socket = await createConnection(
      (game: GameState) => (this.game = game)
    );
  }

  private _startGame(): void {
    this.socket!.emit("startGame", this.game!.gameID);
  }
}
