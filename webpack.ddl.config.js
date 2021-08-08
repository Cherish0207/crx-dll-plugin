/**
 * 打包出  两个文件
 *  utils.dll.js
 *  utils.manifest.json: 清单文件,描述这里有那些模块(isarray, is-promise),以它们作为基准模块进行ddl打包,用的时候从里面拿
 */
const path = require("path");
const DllPlugin = require("webpack/lib/DllPlugin"); // webpack内置插件
// const DllPlugin2 = require("./plugins/DllPlugin");
module.exports = {
  mode: "development",
  devtool: false, // 没有sourcemap
  entry: {
    utils: ["isarray", "is-promise"], // react项目里可能就是react react-dom
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "utils.dll.js", // 打包后的文件名
    library: "_dll_utils", // 打包后导出模块的变量名
  },
  plugins: [
    new DllPlugin({
      name: "_dll_utils", // 同output.library 暴露出去的dll函数
      // 输出的manifest json文件的绝对路径
      path: path.join(__dirname, "dist", "utils.manifest.json"),
    }),
  ],
};
