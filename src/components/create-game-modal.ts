import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
  css,
  CSSResult,
} from "lit-element";
import "./modal";
import { createGame } from "../data/connection";

@customElement("create-game-modal")
export class CreateGameModal extends LitElement {
  @property() private modalVisable: boolean = false;
  @property() private error?: string;

  protected render(): TemplateResult {
    return html`
      <modal-element
        .opened="${this.modalVisable}"
        @accept="${this._createGame}"
        @cancel="${this._closeModal}"
        .accept="${"Create"}"
      >
        <h2 class="title" slot="title">Create Game</h2>
        <div slot="content">
          ${!this.error
            ? ""
            : html`
                <div class="error">${this.error}</div>
              `}
          <input type="text" class="game-name input" placeholder="Name" />
          <div class="side-by-side">
            <input
              type="number"
              step="0.01"
              class="game-small-blind input"
              placeholder="Small Blind"
            />
            <input
              type="number"
              step="0.01"
              class="game-big-blind input"
              placeholder="Big Blind"
            />
          </div>
        </div>
      </modal-element>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .error {
        background: #f0cccf;
        padding: 10px;
        color: #752121;
        border-radius: 5px;
        border-left: #dc4e4e 4px solid;
        font-size: 14px;
      }
      .input {
        padding: 10px;
        border: none;
        border-radius: 5px;
        display: block;
        width: 100%;
        margin: 10px 0px;
        color: white;
        background-color: #2b3138;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      .title {
        color: white;
        margin-top: 0;
        font-size: 22px;
        font-weight: normal;
      }
      .side-by-side {
        display: flex;
        justify-content: space-between;
      }
      .side-by-side input {
        width: 49%;
      }
    `;
  }

  private get _gameNameInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(".game-name") as HTMLInputElement;
  }

  private get _gameSmallBlindInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(
      ".game-small-blind"
    ) as HTMLInputElement;
  }

  private get _gameBigBlindInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(
      ".game-big-blind"
    ) as HTMLInputElement;
  }

  private _closeModal(e: Event) {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _createGame() {
    await createGame(
      this._gameNameInput.value,
      this._gameSmallBlindInput.value,
      this._gameBigBlindInput.value
    ).then((data) => {
      if (data.error) {
        this.error = data.error;
        return;
      }

      this.dispatchEvent(new CustomEvent("close"));
    });
  }
}
