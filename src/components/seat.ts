import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult
} from "lit-element";
import { Player } from "../common/types";
import "./card";

@customElement("seat-element")
export class Seat extends LitElement {
  @property() public player!: Player;

  protected render(): TemplateResult {
    return html`
      <div class="seat">
        <div class="card-box">
          ${this.player.cards.map(
            card => html`
              <card-element .card=${card} .show=${true}></card-element>
            `
          )}
        </div>
        <div class="player-box">
          <p class="player-name">${this.player.name}</p>
          <p class="player-currency">$${this.player.stackAmount}</p>
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
      }
      .player-currency {
        text-align: center;
        font-weight: bold;
        padding: 0px 0px 5px 0px;
        color: #fcbd07;
      }
    `;
  }
}
