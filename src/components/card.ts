import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult
} from "lit-element";

@customElement("card-element")
export class Card extends LitElement {
  @property() public top!: string;
  @property() public left!: string;
  @property() public card!: string;
  @property() public cardBack: string = "gray_back";
  @property() public show: boolean = false;
  @property() private width: string = "60px";
  @property() private height: string = "90px";

  protected render(): TemplateResult {
    return html`
      <img
        width="${this.width}"
        height="${this.height}"
        src="../static/images/${this.show ? this.card : this.cardBack}.png"
      />
    `;
  }
}
