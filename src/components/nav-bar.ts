import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { User } from "../common/types";

@customElement("nav-bar")
export class NavBar extends LitElement {
  @property() public user!: User;

  protected render(): TemplateResult {
    return html`
      <div class="nav">
        <div class="nav-title"><a href="/">Flop The World</a></div>
        <div class="nav-user">
          ${!this.user ? "" : this.user.name} | <a href="/logout">Logout</a>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .nav {
        height: 75px;
        padding: 15px;
        display: flex;
        padding: 15px 30px;
      }
      .nav-title {
        width: 50%;
        margin: auto;
      }
      .nav-title a {
        text-decoration: none;
        color: white;
        font-size: 24px;
      }
      .nav-user {
        width: 50%;
        text-align: right;
        font-size: 20px;
        margin: auto;
        color: white;
      }
      .nav-user a {
        text-decoration: none;
        color: white;
      }
    `;
  }
}
