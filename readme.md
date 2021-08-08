## 什么是 DLL

> 术语 DLL(Dynamic-link library) 代表动态链接库，它最初是由 Microsoft 引入的。

## webpack 的 DDL-DllPlugin 和 DllReferencePlugin 插件

### 1.作用

** DDL 解决了重复打包公共模块的问题,减少了编译,提升打包速度 **

- DllPlugin 和 DllReferencePlugin 提供了拆分包的方法，可以极大地提高构建时性能。
- .dll 为后缀的文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据
- 把基础模块独立出来打包到单独的动态连接库里
- 当需要导入的模块在动态连接库里的时候，模块不能再次被打包，而是去动态连接库里获取

(可以先把基础模块打包起来,后续编译主项目的时候直接从 ddl 里取,不再需要打包了\
先把通用的库集体打包了ー下,后面项目中引用直接用打包后的方法)

### 2.使用

1. 打包出一个个动态连接库: 先使用 DllPlugin 插件打包出一个个动态连接库
2. 使用 ddl 文件:项目打包时使用 DllReferencePlugin 插件, 在配置文件中引入 DllPlugin 插件打包好的动态连接库 ddl 文件

### 2.1 webpack.dll.config.js

```js
/**
 * 打包出两个文件
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
```

2.2 webpack.dll.config.js

```js
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
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./utils.dll.js"></script>
  </body>
</html>
```
