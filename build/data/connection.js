"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
function createConnection() {
    const socket = socket_io_client_1.default("http://localhost:3000");
    socket.on("connect", () => {
        socket.emit("join", "Hello World from client");
    });
    // socket.on("message", (message: string) => {
    //   console.log(message);
    // });
    return socket;
}
exports.createConnection = createConnection;
//# sourceMappingURL=connection.js.map