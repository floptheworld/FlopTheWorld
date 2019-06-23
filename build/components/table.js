"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("lit-element");
const connection_1 = require("../data/connection");
require("./card");
let Table = class Table extends lit_element_1.LitElement {
    constructor() {
        super();
        this._initialize();
    }
    render() {
        console.log(this.game);
        return lit_element_1.html `
      ${!this.game
            ? ""
            : lit_element_1.html `
            <p class="App-intro">
              This is the timer value: ${this.game.time}
            </p>
            <div id="Table">
              ${this.game.players.map(player => lit_element_1.html `
                    <div class="cards">
                      ${player.cards.map(card => lit_element_1.html `
                          <card-element
                            .card=${card}
                            .show=${true}
                          ></card-element>
                        `)}
                    </div>
                  `)}
            </div>
            <button type="button" @click=${this._reDeal}>Click Me!</button>
          `}
    `;
    }
    static get styles() {
        return lit_element_1.css `
      #Table {
        background-image: url("../static/images/table.jpg");
        width: 1000px;
        height: 500px;
        margin: auto;
      }
    `;
    }
    _initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket = yield connection_1.createConnection((game) => (this.game = game));
        });
    }
    _reDeal() {
        this.socket.emit("redeal", this.game);
    }
};
__decorate([
    lit_element_1.property()
], Table.prototype, "game", void 0);
__decorate([
    lit_element_1.property()
], Table.prototype, "socket", void 0);
Table = __decorate([
    lit_element_1.customElement("table-element")
], Table);
exports.Table = Table;
//# sourceMappingURL=table.js.map