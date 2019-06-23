import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult
} from "lit-element";
import "./card";

@customElement("board-element")
export class Board extends LitElement {
  @property() public cards!: string[];

  protected render(): TemplateResult {
    return html`
      ${this.cards.map(
        card => html`
          <card-element .card=${card} .show=${true}></card-element>
        `
      )}
    `;
  }
}
