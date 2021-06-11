## Resolve
### resolve.modules
`[string] = ['node_modules']`

告诉`webpack`解析模块时应该搜索的目录。绝对路径和相对路径都能使用。
+ 相对路径
  + 通过搜索当前目录及其祖先（即`./node_modules`、`../node_modules`等），将类似于Node扫描`node_modules`的方式扫描相对路径。
+ 绝对路径
  + 仅在给定目录中搜索(推荐)，减少一层一层的搜索有助于提高编译速度。
```js
const path = require('path')
module.exports = {
  resolve: {
    // 第三方模块，直接在根目录下的node_modules中查找，减少一层一层查找的次数
    modules: [path.resolve('node_modules')]
  }
}
```
### resolve.extensions
`[string] = ['.js', '.json', '.wasm']`

尝试按顺序解析这些后缀名。
> 建议引用文件时补全文件名以及后缀名，虽然可以通过配置实现省略，但是在编译解析的时候会多很多解析步骤，所以补全后缀名是更有效的优化构建速度的方式。
```js
module.exports = {
  resolve: {
    extensions: ['.js', '.css', '.json', '.vue']
  }
}
```
## Module
### module.noParse
防止`webpack`解析那些任何与给定正则表达式相匹配的文件。忽略的文件中**不应该含有`import`,`require`,`define`的调用**，或任何其他导入机制。忽略大型的`library`可以提高构建性能。
```js
module.exports = {
  module: {
    // jquery和lodash不依赖其他模块，所以不需要webpack去解析它们的依赖关系，这样可以提高构建性能
    noParse: /jquery|lodash/
  }
}
```
## Plugin
### IgnorePlugin
`IgnorePlugin`可以阻止生成**匹配了正则表达式**或**过滤函数**的通过`import`、`require`导入的模块
> 官方示例<br/>
从2.18版本开始，`moment.js`的所有语言包都与核心库捆绑在一起。因为`moment.js`用以下代码导入了所有语言包`require('./locale/' + name);`
```js
// webpack.config.js
const webpack = require('webpack')

module.exports = {
  plugins: [
    // 任何以'moment'结尾的目录中与'./locale'相匹配的require语句都将被忽略
    // 忽略moment自己引入的语言包，在项目中手动引入
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
}
```
```js
// main.js
import moment from 'moment'
// 手动引入语言包
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
```
### DllPlugin & DllReferencePlugin
`DllPlugin`和`DllReferencePlugin`用某种方法实现了拆分 bundles，同时还大幅度提升了构建的速度。

像`vue`、`react`、`react-dom`这些第三方库，一般是不会进行更改的，要么使用`noParse`忽略构建（Vue-cli的默认配置）要么可以先将这些不常变动的单独构建，之后只构建常变动的代码，以提高构建效率。
#### [DllPlugin](https://webpack.docschina.org/plugins/dll-plugin/#dllplugin)
此插件用于在**单独的`webpack`配置**中创建一个`dll-only-bundle`。此插件会生成一个名为`manifest.json`的文件，这个文件是用于让`DllReferencePlugin`能够映射到相应的依赖上。

在给定的`path`路径下创建一个`manifest.json`文件。这个文件包含了从`require`和`import`中`request`到模块`id`的映射。 `DllReferencePlugin`也会用到这个文件。

此插件与`output.library`的选项相结合可以暴露出（也称为放入全局作用域）`dll`函数。
#### [DllReferencePlugin](https://webpack.docschina.org/plugins/dll-plugin/#dllreferenceplugin)
此插件配置在`webpack`的**主配置文件**中，此插件会把`dll-only-bundles`引用到需要的预编译的依赖中。

通过引用`dll`的`manifest`文件来把依赖的名称映射到模块的`id`上，之后再在需要的时候通过内置的`__webpack_require__`函数来加载对应的模块。
#### 例子
```js
// webpack.react.config.js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '_dll_[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]' // 定义导出模块在全局的引用变量名
    // libraryTarget: 'var' // commonjs var this window umd ...
  },
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]', // 一定要与library相同，否则查找不到映射
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
}
// webpack --config webpack.react.config.js
// 构建出了一个_dll_react.js和一个manifest.json
```
```js
// webpack.config.js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // 引用动态链接库，设置映射关系文件，先从动态链接库中查找，如果没有则再进行打包
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
}
```
这样将不常变动的`react`、`react-dom`单独构建出来，以后构建时，将忽略这些第三方库，只构建开发的代码，提高了构建效率。
### [HappyPack](https://github.com/amireh/happypack)
::: warning 注意
这个插件是否能够提高构建效果，取决于项目的大小，因为分配进程是有性能消耗的，如果项目很小，分配进程消耗的资源可能比带来的优化更大，反而起到反效果。
:::
```js
// webpack.config.js
const path = require('path')
const Happypack = require('happypack')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js'
      },
      {
        test: /\.css$/,
        use: 'Happypack/loader?id=css'
      }
    ]
  },
  plugins: [
    // 对js进行多线程构建
    new Happypack({
      id: 'js',
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }]
    }),
    // 对css进行多线程构建
    new Happypack({
      id: 'css',
      loaders: ['style-loader', 'css-loader']
    })
  ]
}
```
### [SplitChunks](http://www.mjy-blog.cn/start/project/webpack.html#splitchunks)
## 相关文章
+ [使用 Preload&Prefetch 优化前端页面的资源加载](https://blog.csdn.net/vivo_tech/article/details/109485871)