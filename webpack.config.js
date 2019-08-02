const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var fs = require("fs");

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

const common = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

const frontend = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  target: "web",
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "static/"),
        to: path.resolve(__dirname, "build/static"),
      },
    ]),
    new HtmlWebpackPlugin({
      title: "Flop The World Poker",
      filename: "login.html",
      template: "static/login.template.html",
    }),
    new HtmlWebpackPlugin({
      title: "Flop The World Poker",
      filename: "game.html",
      template: "static/game.template.html",
    }),
    new HtmlWebpackPlugin({
      title: "Flop The World Poker",
      filename: "lobby.html",
      template: "static/lobby.template.html",
    }),
    new HtmlWebpackPlugin({
      title: "Flop The World Poker",
      filename: "register.html",
      template: "static/register.template.html",
    }),
  ],
};

const backend = {
  entry: "./src/server.ts",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  target: "node",
  externals: nodeModules,
};

module.exports = [
  Object.assign({}, common, frontend),
  Object.assign({}, common, backend),
];
