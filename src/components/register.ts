import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from "lit-element";
import { register } from "../api/connection";
import { UserType } from "../common/types";

@customElement("register-element")
export class Register extends LitElement {
  @property() private error?: string;

  protected render(): TemplateResult {
    return html`
      <div class="register-box">
        <p class="player-input-label">Flop The World</p>
        ${!this.error
          ? ""
          : html`
              <div class="error">${this.error}</div>
            `}
        <input
          type="text"
          class="player-name input"
          placeholder="Name"
          autofocus
          @keydown=${this._enterKeyPress}
        />
        <input
          type="text"
          class="player-username input"
          placeholder="Username"
          @keydown=${this._enterKeyPress}
        />
        <input
          type="text"
          class="player-email input"
          placeholder="Email"
          @keydown=${this._enterKeyPress}
        />
        <input
          type="password"
          class="player-password input"
          placeholder="Password"
          @keydown=${this._enterKeyPress}
        />
        <input
          type="password"
          class="player-cpassword input"
          placeholder="Confirm Password"
          @keydown=${this._enterKeyPress}
        />
        <div class="login-bottom">
          <div class="login">
            <a href="/login" class="login-link">Login</a>
          </div>
          <div class="register-button">
            <button
              type="button"
              class="button register-button"
              @click=${this._register}
            >
              Register!
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .register-box {
        background-color: #383d45;
        border-radius: 5px;
        width: 300px;
        margin: auto;
        padding: 20px;
        margin-top: 10%;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
      }
      .player-input-label {
        color: white;
        margin: 0px;
        text-align: center;
        padding-bottom: 20px;
        font-size: 24px;
      }
      button.register-button {
        border: none;
        background-color: #1c6de1;
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
      .button-extra-small {
        padding: 3px 12px;
        border-radius: 5px;
        color: white;
      }
      .input {
        padding: 10px;
        border: none;
        border-radius: 5px;
        display: block;
        width: 100%;
        margin: 10px 0px;
        color: white;
        background-color: #2b3138;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box; /* Firefox, other Gecko */
        box-sizing: border-box;
      }
      .input:focus {
        outline: none;
      }
      div.register-button {
        text-align: right;
        width: 50%;
      }
      .login-bottom {
        display: flex;
        padding-top: 20px;
      }
      .login {
        width: 50%;
        margin: auto;
      }
      .login-link {
        color: gray;
      }
      .error {
        background: #f0cccf;
        padding: 10px;
        color: #752121;
        border-radius: 5px;
        border-left: #dc4e4e 4px solid;
        font-size: 14px;
      }
    `;
  }

  private get _playerUserNameInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(
      ".player-username"
    ) as HTMLInputElement;
  }

  private get _playerPasswordInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(
      ".player-password"
    ) as HTMLInputElement;
  }

  private get _playerCPasswordInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(
      ".player-cpassword"
    ) as HTMLInputElement;
  }

  private get _playerEmailInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(".player-email") as HTMLInputElement;
  }

  private get _playerNameInput(): HTMLInputElement {
    return this.shadowRoot!.querySelector(".player-name") as HTMLInputElement;
  }

  private _enterKeyPress(ev: KeyboardEvent): void {
    if (ev.keyCode === 13) {
      this._register();
    }
  }

  private async _register(): Promise<void> {
    await register(
      this._playerNameInput.value,
      this._playerUserNameInput.value,
      this._playerEmailInput.value,
      this._playerPasswordInput.value,
      this._playerCPasswordInput.value
    ).then((data) => {
      if (!(data as UserType).userID) {
        this.error = data as string;
        return;
      }

      window.location.href = "/lobby";
    });
  }
}
