"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suits = new Set(["H", "S", "C", "D"]);
const numbers = new Set([
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
]);
function createDeck() {
    const cards = new Array();
    suits.forEach(suit => {
        numbers.forEach(num => {
            cards.push(num + suit);
        });
    });
    return cards;
}
exports.createDeck = createDeck;
function shuffleDeck(deck) {
    const shuffledDeck = deck;
    let tempCard;
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const randomPos = Math.floor(Math.random() * (i + 1));
        tempCard = shuffledDeck[i];
        shuffledDeck[i] = shuffledDeck[randomPos];
        shuffledDeck[randomPos] = tempCard;
    }
    return shuffledDeck;
}
exports.shuffleDeck = shuffleDeck;
function redeal(game) {
    const players = game.players;
    players.map(player => {
        while (player.cards.length > 0) {
            player.cards.pop();
        }
    });
    game.deck = shuffleDeck(createDeck());
    dealCards(game);
}
exports.redeal = redeal;
function dealCards(game) {
    const players = game.players;
    players.map(player => {
        player.cards.push(game.deck.pop());
        player.cards.push(game.deck.pop());
    });
}
exports.dealCards = dealCards;
//# sourceMappingURL=public-api.js.map