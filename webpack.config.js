const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
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
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  target: "node",
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
    ])
  ]
};
