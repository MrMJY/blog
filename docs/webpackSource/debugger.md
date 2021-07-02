## 下载webpack源码
我们先下载源码，笔记调试的是`v4.44.2`版本，源码已经打了`tag`切换到此版本即可。
```sh
git clone https://github.com/webpack/webpack.git
cd webpack
git checkout v4.44.2
npm install -g yarn
yarn
yarn link
yarn link webpack
```
## 新建一个项目
在源码目录的根目录下新建一个`debugge`文件夹，用于新建项目。
```js
debugge
  |- node_modules
  |- src
    |- index.js
    |- utils
      |- index.js
  |- webpack.config.js
```
```js
// webpack.config.js
const path = require('path')

module.exports = {
  context: path.resolve(__dirname), // 一定要指定编译的上下文，path.resolve(__dirname)指定为debugge
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  }
}
```
## 使用VsCode调试
VsCode集成了Node的调试模块，我们使用VsCode进行调试。

在进行调试之前先在根目录下安装`webpack-cli`启动调试会用到，如果未安装则会输出提示信息，让安装。
+ 在项目根目录下新建`.vscode`目录
+ 在`.vscode`目录下新建`launch.json`文件，模拟`npm run build`(`webpack --config=./webpack.config.js`)
  ```json
  {
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node", // 使用node作为运行环境
        "request": "launch",
        "name": "启动webpack调试程序",
        "program": "${workspaceFolder}/lib/webpack.js", // 运行文件的入口
        "args": [ // 启动时传入的参数
          "--config=${workspaceFolder}/debugge/webpack.config.js"
        ]
      }
    ]
  }
  ```
+ 点击运行，正常情况下就可以启动`webpack`，输出`dist`目录，打包后的资源