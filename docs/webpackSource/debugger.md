## 搭建一个项目
这个项目跟平时使用`webpack`打包时使用的项目一样即可。
```js
// root dir
.vscode
  |--launch.json
src
  |--index.js
webpack.config.js
package.json
```

## 使用VsCode调试
VsCode集成了Node的调试模块，我们使用VsCode进行调试。
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
        // 路径可以去node_modules/.bin/webpack.cmd中寻找
        "program": "${workspaceFolder}/node_modules/_webpack-cli@4.0.0@webpack-cli/bin/cli.js", // 运行文件的入口
        "args": [ // 启动时传入的参数
          "--config=${workspaceFolder}/webpack.config.js"
        ]
      }
    ]
  }
  ```
+ 点击运行，正常情况下就可以启动`webpack`，输出`dist`目录，打包后的资源
  ```js
  // root dir
  dist
    |--bundle.js
  .vscode
    |--launch.json
  src
    |--index.js
  webpack.config.js
  package.json
  ```