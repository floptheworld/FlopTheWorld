"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("lit-element");
let Card = class Card extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.cardBack = "gray_back";
        this.show = false;
        this.width = "60px";
        this.height = "90px";
    }
    render() {
        return lit_element_1.html `
      <img
        width="${this.width}"
        height="${this.height}"
        src="../static/images/${this.show ? this.card : this.cardBack}.png"
      />
    `;
    }
};
__decorate([
    lit_element_1.property()
], Card.prototype, "top", void 0);
__decorate([
    lit_element_1.property()
], Card.prototype, "left", void 0);
__decorate([
    lit_element_1.property()
], Card.prototype, "card", void 0);
__decorate([
    lit_element_1.property()
], Card.prototype, "cardBack", void 0);
__decorate([
    lit_element_1.property()
], Card.prototype, "show", void 0);
__decorate([
    lit_element_1.property()
], Card.prototype, "width", void 0);
__decorate([
    lit_element_1.property()
], Card.prototype, "height", void 0);
Card = __decorate([
    lit_element_1.customElement("card-element")
], Card);
exports.Card = Card;
//# sourceMappingURL=card.js.map