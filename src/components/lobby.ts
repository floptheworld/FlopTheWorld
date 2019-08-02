import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { getGames, createConnection, getUser } from "../data/connection";
import { User } from "../common/types";
import { Game } from "../common/game/game";
import "./nav-bar";
import "./create-game-modal";

interface JoinTarget extends EventTarget {
  gameID: string;
}

@customElement("lobby-element")
export class Lobby extends LitElement {
  @property() public user?: User;
  @property() private socket?: SocketIOClient.Socket;
  @property() private games?: Game[];
  @property() private modalVisable: boolean = false;

  public constructor() {
    super();
    this._initialize();
  }

  protected render(): TemplateResult {
    // tslint:disable-next-line:no-console
    console.log(this.user);

    if (!this.user) {
      return html``;
    }

    return html`
      <nav-bar .user=${this.user}></nav-bar>
      <create-game-modal
        .modalVisable=${this.modalVisable}
        @close=${() => {
          this.modalVisable = false;
          this._getGames();
        }}
      ></create-game-modal>
      <div class="lobby">
        <div class="games-box">
          <div class="games-title">
            <div class="title">Games</div>
            <div class="new-game-button">
              <button type="button" class="button" @click=${this._toggleDialog}>
                Create Game
              </button>
            </div>
          </div>
          <hr />
          <div class="games">
            <div class="game-name title">Name</div>
            <div class="game-players title">Players</div>
            <div class="game-blinds title">Blinds</div>
            <div class="game-join title"></div>
            ${this.games!.map(
              (game) =>
                html`
                  <div class="game-name">${game.name}</div>
                  <div class="game-players">${game.players.length}</div>
                  <div class="game-blinds">
                    ${game.littleBlind} / ${game.bigBlind}
                  </div>
                  <div class="game-join">
                    <button
                      type="button"
                      class="button button-extra-small join-button"
                      .gameID=${game.gameID}
                      @click=${this._navigateGame}
                    >
                      Join
                    </button>
                  </div>
                `
            )}
          </div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .join-button {
        border: none;
        background-color: #1976d2;
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
      .games-box {
        margin: 25px auto;
        height: 300px;
        width: 300px;
        border-radius: 5px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
        background-color: #383d45;
        padding: 25px;
      }
      .games {
        display: grid;
        grid-template-columns: 30% 20% 30% auto;
        grid-auto-rows: 50px;
        height: 85%;
        overflow-y: auto;
        padding-right: 10px;
      }
      .games::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      .games::-webkit-scrollbar-track {
        border: 1px solid rgb(68, 71, 92);
        border-radius: 10px;
      }
      .games::-webkit-scrollbar-thumb {
        background: rgb(68, 71, 92);
        border-radius: 10px;
      }
      .games::-webkit-scrollbar-thumb:hover {
        background: rgb(42, 44, 60);
      }
      .games-title {
        display: flex;
      }
      .games-title > div {
        width: 50%;
      }
      .games-title .title {
        color: white;
        font-size: 22px;
      }
      .new-game-button {
        text-align: right;
      }
      .new-game-button button {
        background-color: #2e7d32;
        border: none;
      }
      .games div {
        margin: auto 0;
        color: white;
      }
      .game-players,
      .game-blinds {
        text-align: center;
      }
      .game-join {
        text-align: right;
      }
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
      .lobby {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  private async _initialize(): Promise<void> {
    await getUser().then((user) => (this.user = user));
    if (!this.user) {
      window.location.href = "/";
      return;
    }

    this.socket = await createConnection(this.user.userID);
    this._getGames();
  }

  private async _getGames(): Promise<void> {
    await getGames(this.socket!, (games: Game[]) => (this.games = games));
  }

  private _navigateGame(e: MouseEvent): void {
    if (!this.user) {
      return;
    }

    const gameID = (e.target as JoinTarget).gameID;

    localStorage.gameID = gameID;
    window.location.href = "../game/" + gameID;
  }

  private _toggleDialog() {
    this.modalVisable = !this.modalVisable;
  }
}
