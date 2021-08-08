const path = require("path");
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin"); // webpack内置插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // 打包后的文件名
  },
  plugins: [
    new DllReferencePlugin({ manifest: require("./dist/utils.manifest.json") }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
