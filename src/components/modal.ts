import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
  css,
  CSSResult,
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";

@customElement("modal-element")
export class Modal extends LitElement {
  @property() public opened: boolean = false;
  @property() public accept: string = "Ok";
  @property() public cancel: string = "Cancel";

  protected render(): TemplateResult {
    return html`
      <div
        id="Modal"
        class="${classMap({
          dialog: true,
          opened: this.opened,
          closed: !this.opened,
        })}"
        @click=${this._modalClicked}
      >
        <div class="modal-content">
          <slot name="title"></slot>
          <slot name="content"></slot>
          <div class="buttons">
            <button
              class="cancel button"
              @click="${() => this.dispatchEvent(new CustomEvent("cancel"))}"
            >
              ${this.cancel}
            </button>
            <button
              class="accept button"
              @click="${() => this.dispatchEvent(new CustomEvent("accept"))}"
            >
              ${this.accept}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .opened {
        display: block;
      }
      .closed {
        display: none;
      }
      .dialog {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0); /* Fallback color */
        background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
      }
      .modal-content {
        flex-direction: column;
        display: flex;
        justify-content: space-between;
        z-index: 2;
        margin: 10% auto;
        max-height: 500px;
        max-width: 600px;
        border-radius: 5px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
        background-color: #383d45;
        padding: 25px;
      }
      .button:hover {
        opacity: 0.8;
        cursor: pointer;
      }
      .button {
        border-radius: 5px;
        padding: 10px;
        color: white;
        border: none;
      }
      .buttons {
        display: flex;
        justify-content: flex-end;
        padding-top: 20px;
      }
      .accept {
        background-color: #1976d2;
        width: 62px;
        margin-left: 5px;
      }
      .cancel {
        background-color: #c62828;
        min-width: 62px;
      }
    `;
  }

  private get _modalElement(): HTMLElement {
    return this.shadowRoot!.querySelector("#Modal") as HTMLElement;
  }

  private _modalClicked(e: Event): void {
    if (e.target === this._modalElement) {
      this.dispatchEvent(new CustomEvent("cancel"));
    }
  }
}
