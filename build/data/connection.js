"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
function createConnection(setState) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = socket_io_client_1.default("http://localhost:3000");
        socket.on("connect", () => {
            socket.emit("join", "Hello World from client");
        });
        socket.on("gameUpdate", (state) => setState(state));
        socket.emit("subscribeToGame", 1000);
        return socket;
    });
}
exports.createConnection = createConnection;
//# sourceMappingURL=connection.js.map