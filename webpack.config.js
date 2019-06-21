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
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};

const frontend = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  target: "web",
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(
          "node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"
        ),
        to: path.resolve(__dirname, "build/vendor")
      },
      {
        from: path.resolve(
          "node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"
        ),
        to: path.resolve(__dirname, "build/vendor")
      }
    ]),
    new HtmlWebpackPlugin({
      title: "Flop The World Poker",
      template: "build/index.template.html"
    })
  ]
};

const backend = {
  entry: "./src/server.ts",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  target: "node",
  externals: nodeModules
};

module.exports = [
  Object.assign({}, common, frontend),
  Object.assign({}, common, backend)
];

// module.exports = {
//   entry: "./src/index.ts",
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: "ts-loader",
//         exclude: /node_modules/
//       }
//     ]
//   },
//   externals: [
//     path.join(__dirname, "../node_modules/ws"),
//     path.join(__dirname, "../node_modules/socket.io")
//   ],
//   resolve: {
//     extensions: [".tsx", ".ts", ".js"]
//   },
//   output: {
//     filename: "bundle.js",
//     path: path.resolve(__dirname, "build")
//   },
//   target: "web",
//   plugins: [
//     new CopyWebpackPlugin([
//       {
//         from: path.resolve(
//           "node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"
//         ),
//         to: path.resolve(__dirname, "build/vendor")
//       },
//       {
//         from: path.resolve(
//           "node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"
//         ),
//         to: path.resolve(__dirname, "build/vendor")
//       }
//     ])
//   ]
// };
