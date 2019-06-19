"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const app = express_1.default();
const port = process.env.PORT || 3000;
app.use(express_1.default.static("static"));
app.use("/deck", controllers_1.DeckController);
app.use(express_1.default.static(__dirname, { extensions: ["html"] }));
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Listening at http://localhost:${port}/`);
});
