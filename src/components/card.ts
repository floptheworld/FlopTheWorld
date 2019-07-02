import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";

@customElement("card-element")
export class Card extends LitElement {
  @property() public card!: string;
  @property() private width: string = "60px";
  @property() private height: string = "90px";

  protected render(): TemplateResult {
    return html`
      <picture style="width: ${this.width}; height: ${this.height}">
        <source
          srcset="../static/images/webp/${this.card}.webp"
          type="image/webp"
        />
        <source
          srcset="../static/images/png/${this.card}.png"
          type="image/png"
        />
        <img
          style="width: ${this.width}; height: ${this.height}"
          src="../static/images/png/${this.card}.png"
          alt="${this.card}"
        />
      </picture>
    `;
  }
}
