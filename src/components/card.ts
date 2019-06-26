import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";

@customElement("card-element")
export class Card extends LitElement {
  @property() public card?: string;
  @property() private width: string = "60px";
  @property() private height: string = "90px";

  protected render(): TemplateResult {
    return html`
      <img
        width="${this.width}"
        height="${this.height}"
        src="../static/images/${this.card}.png"
      />
    `;
  }
}
