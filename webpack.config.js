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
        from: path.resolve(
          "node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"
        ),
        to: path.resolve(__dirname, "build/vendor"),
      },
      {
        from: path.resolve(
          "node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"
        ),
        to: path.resolve(__dirname, "build/vendor"),
      },
      {
        from: path.resolve(__dirname, "static/"),
        to: path.resolve(__dirname, "build/static"),
      },
    ]),
    new HtmlWebpackPlugin({
      title: "Flop The World Poker",
      template: "static/index.template.html",
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
