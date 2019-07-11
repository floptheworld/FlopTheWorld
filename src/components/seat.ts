import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { styleMap, StyleInfo } from "lit-html/directives/style-map.js";
import { PlayerState } from "../common/types";
import "./card";

const seatBetStyles: StyleInfo[] = [
  { top: "-40px", right: "-40px" },
  { top: "-40px", right: "-40px" },
  { bottom: "-48px", right: "-40px" },
  { bottom: "-48px", right: "-40px" },
  { bottom: "-48px", left: "-40px" },
  { bottom: "-48px", left: "-40px" },
  { top: "-40px", left: "-40px" },
  { top: "-40px", left: "-40px" },
];

@customElement("seat-element")
export class Seat extends LitElement {
  @property() public player!: PlayerState;
  @property() public seatNumber!: number;
  @property() public currentPlayerID!: string;

  protected render(): TemplateResult {
    return html`
      <div class="seat">
        ${this.player.bet === ""
          ? ""
          : html`
              <div
                style=${styleMap(seatBetStyles[this.seatNumber])}
                class="player-bet"
              >
                <p>$${this.player.bet}</p>
              </div>
            `}
        <div class="card-box">
          ${this.player.cards.map(
            (card) => html`
              <card-element .card=${card}></card-element>
            `
          )}
        </div>
        <div
          class="player-box"
          ?data-player-turn=${this.player.isTurn}
          ?data-current-player-turn=${this.player.playerID ===
            this.currentPlayerID && this.player.isTurn}
        >
          ${!this.player.dealer
            ? ""
            : html`
                <span class="dealer-button">
                  D
                </span>
              `}
          <p class="player-name">${this.player.name}</p>
          <p class="player-stack">
            ${this.player.isSittingOut
              ? html`
                  Sitting Out
                `
              : html`
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="icon-currency-dollar"
                  >
                    <circle cx="12" cy="12" r="10" class="primary" />
                    <path
                      class="secondary"
                      d="M13 7.12v3.96c2.25.36 4 1.93 4 3.92 0 2-1.75 3.56-4 3.92V19a1 1 0 0 1-2 0v-.08a4.82 4.82 0 0 1-3.67-2.49 1 1 0 0 1 1.8-.85c.29.6.98 1.09 1.87 1.3v-3.96C8.75 12.56 7 11 7 9c0-2 1.75-3.56 4-3.92V5a1 1 0 0 1 2 0v.08a4.81 4.81 0 0 1 3.68 2.5 1 1 0 0 1-1.81.85c-.28-.6-.98-1.1-1.87-1.31zm-2 3.76V7.12C9.81 7.4 9 8.18 9 9c0 .82.81 1.6 2 1.88zm2 2.24v3.76c1.19-.28 2-1.06 2-1.88 0-.82-.81-1.6-2-1.88z"
                    />
                  </svg>
                  $${this.player.stackAmount.toFixed(2)}
                `}
          </p>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .player-box p {
        margin: 0px;
      }
      .player-box {
        background-color: #373737;
        border-radius: 5px;
        margin-top: -50px;
        position: absolute;
        width: 150px;
        z-index: 3;
        box-shadow: 0px 0px 10px #000;
        -webkit-box-shadow: 0px 0px 10px #000;
      }
      .player-bet {
        position: absolute;
        text-align: center;
        border-radius: 25px;
        background: hsla(230, 6%, 25%, 1);
        padding: 0px 15px;
        height: 30px;
        color: #d4d4d4;
        font-size: 16px;
        line-height: 30px;
      }
      .player-bet p {
        margin: 0px;
      }
      .dealer-button {
        position: absolute;
        background-color: #ded50c;
        border-radius: 100%;
        width: 25px;
        height: 25px;
        text-align: center;
        top: -12.5px;
        left: -12.5px;
        border: 1px solid #777200;
        font-size: 18px;
      }
      .player-box[data-player-turn] {
        background-color: #152642;
      }
      .player-box[data-current-player-turn] {
        box-shadow: 0 0 0 2pt white;
      }
      .card-box {
        text-align: center;
        height: 94px;
      }
      .player-name {
        color: #fff;
        text-align: center;
        padding: 5px 0px;
      }
      .seat {
        width: 150px;
        position: relative;
      }
      .player-stack {
        text-align: center;
        padding: 0px 0px 5px 0px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .icon-currency-dollar {
        height: 18px;
        width: 1.125rem;
        margin-right: 4px;
      }
      .icon-currency-dollar .primary {
        fill: rgb(250, 160, 1);
      }
      .icon-currency-dollar .secondary {
        fill: rgb(42, 44, 60);
      }
    `;
  }
}
