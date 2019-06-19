import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult
} from "lit-element";
import { fetchDeck } from "../data/deck";
import "./card";

interface Player {
  name: string;
  cards: string[];
}

@customElement("table-element")
export class Table extends LitElement {
  @property() public deck?: string[];
  @property() private players: Player[] = [
    { name: "zack", cards: [] },
    { name: "zack", cards: [] },
    { name: "zack", cards: [] },
    { name: "zack", cards: [] }
  ];

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

  public connectedCallback(): void {
    super.connectedCallback();
    this._getDeck();
  }

  protected render(): TemplateResult {
    return html`
      <div id="Table">
        ${this.players.map(player => {
          player.cards.push(this.deck!.pop()!);
          player.cards.push(this.deck!.pop()!);
          console.log(this.deck);
          return player.cards.map(
            card => html`
              <card-element .card=${card} .show=${true}></card-element>
            `
          );
        })}
      </div>
    `;
  }

  private async _getDeck(): Promise<void> {
    // tslint:disable-next-line:no-console
    this.deck = await fetchDeck();
    console.log(this.deck);
  }
}
