import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult
} from "lit-element";

interface BetTarget extends EventTarget {
  multiplier: number;
}

@customElement("action-element")
export class Action extends LitElement {
  @property() public pot: number = 1;
  @property() private bet: string = "0";

  protected render(): TemplateResult {
    return html`
      <div class="action-box">
        <div class="main-actions">
          <button class="button red-button">Fold</button>
          <button class="button green-button">Call</button>
          <button class="button green-button">Check</button>
          <button class="button blue-button">Raise</button>
          <button class="button blue-button">Bet</button>
        </div>
        <div>
          <input .value=${this.bet} class="bet-text" type="text" />
        </div>
        <div class="bet-actions">
          <button
            .multiplier=${0.25}
            @click=${this._setBet}
            class="button-small button-gray"
          >
            1/4
          </button>
          <button
            .multiplier=${0.5}
            @click=${this._setBet}
            class="button-small button-gray"
          >
            1/2
          </button>
          <button
            .multiplier=${0.75}
            @click=${this._setBet}
            class="button-small button-gray"
          >
            3/4
          </button>
          <button
            .multiplier=${1}
            @click=${this._setBet}
            class="button-small button-gray"
          >
            Full
          </button>
        </div>
      </div>
    `;
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
      .button-gray {
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
    this.bet = this._roundToPrecision(
      (e.target! as BetTarget).multiplier * this.pot,
      0.01
    ).toString();
  }

  private _roundToPrecision(x: number, precision: number) {
    const y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  }
}
