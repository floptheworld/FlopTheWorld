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
import { Player } from "../common/types";
import "./card";

const seatBetStyles: StyleInfo[] = [
  { top: "-40px", right: "-40px" },
  { top: "-40px", right: "-40px" },
  { bottom: "-40px", right: "-40px" },
  { bottom: "-40px", right: "-40px" },
  { bottom: "-40px", left: "-40px" },
  { bottom: "-40px", left: "-40px" },
  { top: "-40px", left: "-40px" },
  { top: "-40px", left: "-40px" },
];

@customElement("seat-element")
export class Seat extends LitElement {
  @property() public player!: Player;
  @property() public seatNumber!: number;
  @property() public currentPlayerID!: string;

  protected render(): TemplateResult {
    return html`
      <div class="seat">
        <div
          style=${styleMap(seatBetStyles[this.seatNumber])}
          class="player-bet"
          ?data-player-bet=${this.player.bet === ""}
        >
          <p>$${this.player.bet}</p>
        </div>
        <div class="card-box">
          ${this.player.cards.map(
            (card) => html`
              <card-element .card=${card}></card-element>
            `
          )}
        </div>
        <div
          ?data-dealer=${this.player.dealer}
          ?data-player-turn=${this.player.isTurn}
          class="player-box"
        >
          <span class="dealer-button">D</span>
          <p class="player-name">${this.player.name}</p>
          <p class="player-stack">
            $${this.player.stackAmount.toFixed(2)}
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
        background-color: #333;
        border: 2px solid #000;
        margin-top: -50px;
        position: absolute;
        width: 150px;
        z-index: 3;
      }
      .player-bet[data-player-bet] {
        display: none !important;
      }
      .player-box[data-dealer] .dealer-button {
        display: block !important;
      }
      .player-bet {
        position: absolute;
        background-color: #333;
        border: 2px solid #000;
        color: #fcbd07;
        text-align: center;
        font-weight: bold;
      }
      .player-bet p {
        margin: 0px;
        padding: 5px;
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
        display: none;
      }
      .player-box[data-player-turn] {
        background-color: #152642;
      }
      .card-box {
        text-align: center;
        height: 94px;
      }
      .player-name {
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding: 5px 0px;
      }
      .seat {
        width: 150px;
        position: relative;
      }
      .player-stack {
        text-align: center;
        font-weight: bold;
        padding: 0px 0px 5px 0px;
        color: #fcbd07;
      }
    `;
  }
}
