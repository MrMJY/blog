## Webpack是什么？
![Webpack](http://www.mjy-blog.cn/blog-assets/webpack.png)
webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

Webpack 可以看做是模块打包工具：它做的事情是，分析你的项目结构，找到JavaScript模块以及其他的一些浏览器不能直接运行的拓展语言（SCSS、TypeScript等等），并将其打包为合适的格式以供浏览器使用。

:::tip 注意
Webpack 本身只能分析 JavaScript 模块，但是它设计了丰富的扩展点。可以通过 Loader、Plugin 进行其他的丰富操作。
:::

### 构建
构建就是把源代码转换成可以发布到线上的可执行 JavaScript、CSS、HTML 文件，包括如下操作：

+ **代码转换**： TypeScript 编译成 JavaScript、SCSS 编译成 CSS等等
+ **文件优化**： 压缩 JavaScript、CSS、HTML 代码，压缩合并图片等
+ **代码分割**： 提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
+ **模块合并**： 在采用模块化的项目里会有很多个模块和文件，需要分类把这些模块合并成一个文件
+ **自动刷新**： 监听本地源代码的变化，自动重新构建、刷新浏览器
+ **代码校验**： 在代码提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过

### 核心概念
+ **Entry**： 入口，Webpack 执行构建的第一步将从 Entry 开始，可以抽象成输入。
+ **Module**: 模块，在 Webpack 中一切皆模块，一个模块对应一个文件。Webpack 会从 Entry 开始递归找出所有依赖的模块。
+ **Chunk**: 代码块，一个 Chunk 由一个或多个模块组合而成，用于代码合并分割。
+ **Loader**: 模块转换器，用于把模块原内容按照需求转换成新内容。
+ **Plugin**: 扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想做的事情。
+ **Output**: 输出结果，在 Webpack 经历了一系列处理并得出最终想要的代码后输出结果。

:::tip 流程
Webpack 启动后会从每个 **Entry** 开始递归解析所有所依赖的 **Module**。每找到一个 **Module** 就会根据配置的 **Loader** 去找出对应的转换规则（rule）。这些 **Module** 会以 **Entry** 为单位进行分组，一个 **Entry** 和其所依赖的所有 **Module** 被分到一个组也就是一个 **Chunk**。最后 Webpack 会把所有 **Chunk** 转换成文件输出。在整个流程中 Webpack 会在恰当的时机执行 **Plugin** 里定义的逻辑。
:::

## 开始
### 配置文件以及配置对象
webpack会自动寻找根目录下的 webpack.config.js 配置文件，以这个文件作为配置。配置文件支持多种导出配置的方式，包括：**单个对象**、**函数**、**配置对象数组**、**Promise**

常用的还是导出一个**单个对象**和**函数**

**导出的函数可传入两个参数**
+ 环境对象(environment)作为第一个参数
+ 一个选项 map 对象（argv）作为第二个参数

> 之所以导出一个函数，是因为可能项目存在多个环境（开发dev、测试test、预发prev、部署build）等，不同的环境需要进行不同的配置，通过函数的方式可以接收一些自定义的参数，然后根据这些参数进行不同的配置。

**具体的传入自定义变量的方式**
![environment](http://www.mjy-blog.cn/blog-assets/webpack-env.png)

### Entry
入口可以是单入口，也可以是多入口

> 如果传入一个字符串或字符串数组，chunk 会被命名为 main。如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。

+ 单入口
  + 字符串：`entry: path.resolve(__dirname, './src/index.js')`
  + 数组： `entry: [path.resolve(__dirname, './src/index.js')]`
  + 对象： `entry: { index: path.resolve(__dirname, './src/index.js') }`
+ 多入口
  + 数组
  ```js
  entry: [
    path.resolve(__dirname, './src/index.js'),
    path.resolve(__dirname, './src/home.js')
  ]
  ```
  + 对象(推荐)
  ```js
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
    home: path.resolve(__dirname, './src/home.js')
  }
  ```
### Output
#### filename
此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下

+ 对于**单个入口起点**，filename 会是一个静态名称`filename: "bundle.js"`
+ 当通过**多个入口起点**(entry point)、代码拆分(code splitting)或各种插件(plugin)创建多个 bundle，应该使用以下一种替换方式，来赋予每个 bundle 一个唯一的名称 
  + 使用入口名称：`filename: "[name].bundle.js"`，只有 Entry 是通过对象的方式配置是可以获取name
  + 使用内部 chunk id: `filename: "[id].bundle.js"`
  + 使用唯一的 hash： `filename: "[name].[hash].bundle.js"`
  + 使用基于每个 chunk 内容的 hash: `filename: "[chunkhash].bundle.js"`
> + 注意此选项被称为文件名，但是你还是可以使用像 "js/[name]/bundle.js" 这样的文件夹结构
> + [hash] 和 [chunkhash] 的长度可以使用 [hash:16]、[hash:8]（默认为20）来指定。或者，通过指定output.hashDigestLength 在全局配置长度。

![filename](http://www.mjy-blog.cn/blog-assets/webpack-output-filename.png)

#### path
构建后资源输出的目录，必须是**绝对路径**
```js
path: path.resolve(__dirname, 'dist')
```

#### libraryTarget
`string = 'var'`

配置如何导出一个公共的库。它有以下值可选`var`、`this`、`window`、`global`、`commonjs`、`amd`。通常与`output.library`使用。
> 这个选项意思就是将一个模块作为公共的库，如何导出到全局中，`var`就是通过`var`声明一个变量来接收导出的内容，`window`就是在`window`将导出的内容挂在`window`上，以此类推。

#### library
`string object`

配置导出的公共库的名称。搭配`output.library`使用，导出的内容的变量名称。

### Module

#### Module.noParse
`RegExp [RegExp] function(resource) string [string]`

阻止`webpack`解析与给定正则表达式匹配的任何文件。被忽略的文件不应具有`import`，`require`，`define`或任何其他导入机制的调用。忽略大型库时，这可以提高构建性能。
```js
module.exports = {
  module: {
    noParse: /jquery|lodash/ // noParse: [/jquery/, /lodash/]
  }
}
```

#### Module.rules
规则数组，当规则匹配时使用。创建模块时，匹配配置的规则数组。这些规则能够修改模块的创建方式。这些规则能够对模块(module)应用 loader，或者修改解析器(parser)数组的每个元素是一个描述**规则的对象(Rule)**，多个 loader 顺序**从后往前**

#### 匹配规则
+ **Rule.test**：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的
+ **Rule.include**：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的
+ **Rule.exclude**：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的
+ **Rule.and**：必须匹配数组中的所有条件
+ **Rule.or**：匹配数组中任何一个条件
+ **Rule.not**：必须排除这个条件

匹配规则的取值可以有一下几种：
+ 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。
+ 正则表达式：test 输入值。
+ 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。
+ 条件数组：至少一个匹配条件。
+ 对象：匹配所有属性。每个属性都有一个定义行为。

#### Rule.use
应用于模块的 Loader 列表(数组)
+ 字符串写法`use: ['style-loader', 'css-loader']`
  + 传递参数`use: ['style-loader?xxx!yyy', 'css-loader'`
+ 对象写法
  ```js
  ues: [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader'
    }
  ]
  ```
  + 传递参数
  ```js
  ues: [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    }
  ]
  ```
#### Rule.loader
Rule.loader 是 Rule.use: [ { loader } ] 的简写。

### Resolve
配置如何解析模块。简单来说就是配置`webpack`查找模块解析模块的方式，`webpack`设置了合理的默认解析查找规则，可以通过此配置项，进行调整和更改，在一定范围内可以起到优化的作用。
#### resolve.alias

`object`

创建别名以更轻松地`import`或`require`某些模块。`resolve.alias`优先于其他模块分辨率。例如：给`src`目录起一个别名`@`。
```js
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      Utils: path.resolve(__dirname, 'src/utils/'),
      Assets: path.resolve(__dirname, 'src/assets/')
    }
  }
}
```

#### resolve.extensions
`[string] = ['.wasm', '.mjs', '.js', '.json']`

尝试按此配置项的顺序解析那些未指定扩展名的模块。
> 如果多个文件共享相同的名称，但具有不同的扩展名，则`webpack`将使用数组中第一个列出的扩展名解析该文件，然后跳过其余文件。
```js
module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.css'] // 引用频率越高的，写在前面
  }
}
```

#### resolve.modules
`[string] = ['node_modules']`

告诉`webpack`解析模块时应搜索哪些目录。绝对路径和相对路径都可以使用，但是请注意它们的行为会有所不同。
+ 相对路径
  + 通过搜索当前目录及其祖先（即`./node_modules`、`../node_modules`等），将类似于`Node`扫描`node_modules`的方式扫描相对路径。
+ 绝对路径
  + 仅在给定目录中搜索(推荐)，减少一层一层的搜索有助于提高编译速度。

## Loaders
### JS资源
#### babel-loader
编译项目中的 ES6+ 代码，转换成 ES5 代码。

**安装**

`npm i babel-loader @babel/core @babel/preset-env -D`
> webpack 4.x | babel-loader 8.x | babel 7.x
+ `babel-loader`解析器读取js代码
+ `@babel/core`核心包，相当于主程序
+ `@babel/preset-env`预设，相当于一个 ES5 代码模板库，遇到 ES6+ 代码就去`@babel/preset-env`中找对应的 ES5 代码
  + 官方的解释：`@babel/preset-env`是一个智能预设，它使您可以使用最新的JavaScript，而无需微观管理目标环境所需的语法转换（以及可选的浏览器polyfill）。

**使用 Babel 的几种方式**
+ 在`webpack.config.js`中使用
  + 使用
    ```js
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/, // 缩小编译范围，可有效的缩短编译时间
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // 使用预设
              plugins: ['@babel/plugin-proposal-object-rest-spread'], // 跟babel配合的插件，更多详情见babel官网
              cacheDirectory: true, // 缓存构建后的结果，减少重新编译
            }
          }
        }
      ]
    }
    ```
  + loader选项
    |名称|类型|默认值|描述|
    |---|---|---|---|
    |`cacheDirectory`|`{Boolean|String}`|`false`|设置后，将缓存构建的结果。未来的`webpack`构建将尝试从缓存中读取数据，以避免在每次运行时都可能运行可能代价昂贵的Babel重新编译过程|
    |`cacheIdentifier`|`{String}`||可以将其设置为自定义值，以在标识符更改时强制执行高速缓存清除。|
    |`cacheCompression`|`{Boolean}`|`true`|设置后，每个Babel变换输出将使用Gzip压缩。 如果要选择不使用缓存压缩，请将其设置为false －如果它可以编译成千上万个文件，则项目可以从中受益。|
    |`customize`|`{null}`|`null`|导出自定义回调（如您传递给.custom（）的回调）的模块的路径。|
+ 使用单独的配置文件(更多配置查看官网)
  ```json
  // .babelrc.json
  {
    "presets": [
      ["@babel/preset-env", {
          "modules": false,
          "targets": "ie >= 8"
        }
      ],
      ["@babel/react"], {
          // ...
        }
      ],
    "plugins": [
      ["@babel/plugin-transform-runtime", {
        "corejs": 2
      }]
    ]
  }
  ```


### CSS资源
#### css-loader
css-loader 解释 @import 和 url() ，会在 import/require() 后再解析它们。

**使用**
```js
{
   test: /\.css$/,
   use: [
     'style-loader',
     'css-loader'
   ]
}
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`url`|`{Boolean|Function}`|`true`|启用/禁用`url()`处理|
|`import`|`{Boolean|Function}`|`true`|启用/禁用`@import`处理|
|`modules`|`{Boolean|String|Object}`|`false`|启用/禁用CSS模块|
|`sourceMap`|`{Boolean }`|`compiler.devtool`|启用/禁用sourceMap|
|`importLoaders`|`{Number}`|`0`|在 css-loader 前应用的 loader 数|
|`esModule`|`{Boolean}`|`true`|是否使用esModule规范打包|

#### style-loader
将CSS文件标签插入到`<head></head>`标签中
**使用**
```js
{
   test: /\.css$/,
   use: [
     'style-loader',
     'css-loader'
   ]
}
```
**[选项](https://www.webpackjs.com/loaders/style-loader/#选项)**

![style-loader-options](http://www.mjy-blog.cn/blog-assets/style-loader-options.png)

#### less-loader
将`Less`文件编译成`Css`，先使用`less-loader`转换为`css`，再用`css-loader、style-loader`
> `less-loader`依赖`less`模块，所以需要安装`less`

**安装**

`npm install less less-loader -D`

**使用**
```js
module.exports = {
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          options: {
            // 对 less 的配置放到 lessOptions 中
            lessOptions: {
              strictMath: true,
              noIeCompat: true
            }
          }
        }
      ]
    }]
  }
};
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`lessOptions`|`{Object|Function}`|`{ relativeUrls: true }`|对`less`的配置[更多Options](http://lesscss.org/usage/#command-line-usage-options)|
|`additionalData`|`{String|Function}`|`undefined`|在实际的文件前/后添加`Less`代码|
|`sourceMap`|`{Boolean}`|`compiler.devtool`|是否开启源码映射|
|`webpackImporter`|`{Boolean}`|`true`|是否开启对以`〜`开头的别名和`@import`引用的功能|

**SourceMap**

要启用 CSS 的 source map，你需要将 sourceMap 选项传递给 `less-loader` 和 `css-loader`
```js
module.exports = {
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader", 
          options: {
            sourceMap: true // 同时开启sourceMap
          }
        },
        {
          loader: "less-loader",
          options: {
            sourceMap: true // 同时开启sourceMap
          }
        }
      ]
    }]
  }
};
```
**将less提取为单独文件**
+ [extract-loader](https://github.com/peerigon/extract-loader) (更简单，但专门针对css-loader的输出)
+ [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) (更复杂，但在所有用例中都适用)

#### sass-loader
加载`Sass/SCSS`文件并转换为`CSS`文件
> `sass-loader`依赖`sass`或者`node-sass`,需要安装它们。`node-sass`使用`npm`容易安装失败，建议使用`cnpm`安装。
> `sass-loader`默认使用`sass`解析，可以通过配置指定`node-sass`所以默认可以只安装`sass`包

**安装**

`cnpm install sass-loader sass -D`

**使用**
```js
module.exports = {
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
    }]
  }
};
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`implementation`|`{Object}`|`sass`|指定使用哪个解析器，`sass`或者`node-sass`|
|`sassOptions`|`{Object\|Function}`|默认值是`sass`解析器|`sass`的相关配置|
|`sourceMap`|`{Boolean}`|`compiler.devtool`|是否生成映射包|
|`additionalData`|`{String\|Function}`|`undefined`|在真是的文件前/后注入`sass`代码|
|`webpackImporter`|`{Boolean}`|`true`|是否开启对以`〜`开头的别名和`@import`引用的功能|

**SourceMap**

要启用 CSS 的 source map，你需要将 sourceMap 选项传递给 `sass-loader` 和 `css-loader`
```js
module.exports = {
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader", 
          options: {
            sourceMap: true // 同时开启sourceMap
          }
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true // 同时开启sourceMap
          }
        }
      ]
    }]
  }
};
```
**将scss提取为单独文件**
+ [extract-loader](https://github.com/peerigon/extract-loader) (更简单，但专门针对css-loader的输出)
+ [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) (更复杂，但在所有用例中都适用)

#### [postcss-loader](https://github.com/postcss/postcss)
[PostCSS](https://github.com/postcss/postcss) 是一个允许使用 JS 插件转换样式的工具。 这些插件可以检查（lint）你的 CSS，支持 CSS Variables 和 Mixins， 编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。
> `postcss-loader`只是核心loader，并不会下载依赖的插件，所以你需要去自己找符合需求的[插件](https://github.com/postcss/postcss)。
+ [Autoprefixer](https://github.com/postcss/autoprefixer) 添加各个浏览器的私有前缀插件
> PostCSS插件，用于解析CSS并使用“[Can I Ues](https://caniuse.com/)”中的值向CSS规则添加供应商前缀。 它是Google推荐的，并在Twitter和阿里巴巴中使用。它会根据项目适用于哪些浏览器来自动添加私有前缀。

:::tip 关于Can I Use
它是根据`browserslist`筛选出符合的本项目的浏览器，具体的关于`browserslist`可查看这篇文章[前端工程基础知识点--Browserslist (基于官方文档翻译）](https://juejin.im/post/6844903669524086797)
:::

> PostCSS 的配置方式也有多种，可以写在`webpack.config.js`中，也可以单独写一个配置文件。常见的方式是在项目根目录下新建`postcss.config.js`或`.postcssrc.json`，第一种更灵活，可以根据环境变量做不动的设置。

**更多的参考**
+ [PostCSS配置指北](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/CSS/PostCSS%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8C%97.md)
+ [PostCSS自学笔记](https://segmentfault.com/a/1190000010926812)

### 图片资源
#### file-loader
用于 js 模块中通过`import`或`require()`方式引入的文件，以及`CSS`文件中通过`url`方式引用的图片，`file-loader`会将引入的文件拷贝到输出目录下。

**使用**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: 'file-loader'
      }
    ]
  }
};
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`name`|`{String|Function}`|`'[contenthash].[ext]'`|为输出的文件指定一个名称的模板|
|`outputPath`|`{String|Function}`|`undefined`|在`output.path`基础上指定一个输出目录|
|`publicPath`|`{String|Function}`|`__webpack_public_path__ + outputPath`|指定一个公共的路径|
|`postTransformPublicPath`|`{Function}`|`undefined`|指定自定义函数以对生成的公共路径进行后处理|
|`context`|`{String}`|`context`|指定当前文件的上下文|
|`emitFile`|`{Boolean}`|`true`|如果值为`true`则把文件写到磁盘上，否则返回一个URL的引用|
|`regExp`|`{RegExp}`|`undefined`|通过正则表达式匹配文件路径，匹配的内容可用在`name`上|
|`esModule`|`{Boolean}`|`true`|输出的`module`是否为`ESModule`规范|

**[关于name更多占位符](https://webpack.js.org/loaders/file-loader/#placeholders)**

#### url-loader
这是一个将文件转换成 base64 URL 的插件，`url-loader`的使用方式跟`file-loader`很相似，只不过`url-loader`返回的是一个base64 url。

**使用**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|bmp|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024 // 小于8kb的文件才会被转换成base64
            }
          }
        ]
      }
    ]
  }
}
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`limit`|`{Boolean|Number|String}`|`undefined`|设定一个最大的阈值(字节数: 1kb = 1 * 1024)|
|`mimetype`|`{Boolean|String}`|基于[mime-types](https://github.com/jshttp/mime-types)|设置要转换文件的MIME类型|
|`encoding`|`{Boolean|String}`|`base64`|设置编码格式|
|`generator`|`{Function}`|`() => type/subtype;encoding,base64_data`|可以创建自己的自定义编码格式|
|`fallback`|`{String}`|`file-loader`|指定当目标文件的大小超过阈值时要使用的备用loader|
|`esModule`|`{Boolean}`|`true`|输出的`module`是否为`ESModule`规范|

#### html-withimg-loader
处理 HTML 文件中 `<img />`使用的静态资源

## Plugins
### HTML相关
#### HtmlWebpackPlugin
该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包。

如果你有多个 entry, 那么所有入口产出的资源都会被注入到 html 中，可以通过配置 chunks 指定使用那些 chunk

**使用**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <!-- 使用插件中配置的变量 -->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
  </body>
</html>
```
```js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: 'assets/admin.html'
    })
  ]
}
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`title`|`{String}`|`Webpack App`|用于生成的 HTML 文件的 title|
|`filename`|`{String}`|`'index.html'`|生成的 HTML 文件名称，也可以指定文件目录(eg: assets/admin.html)|
|`template`|`{String}`|`'src/index.ejs'`| 模板(相对/绝对路径)[更多](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)|
|`templateContent`|`{string|Function|false}`|`false`|可以代替模板使用以提供嵌入式模板[更多](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates)|
|`templateParameters`|`{Boolean|Object|Function}`|`false`|允许覆盖模板中使用的参数[例子](https://github.com/jantimon/html-webpack-plugin/tree/master/examples/template-parameters)|
|`inject`|`{Boolean|String}`|`true`|可选的值有`true || 'head' || 'body' || false`，将所有资产注入给定的`template`或`templateContent`。当值为`true`或`body`时，所有的`javascript`资源都将放置在`body`元素的底部。值为`head`时会将脚本放置在head元素中。[false示例](https://github.com/jantimon/html-webpack-plugin/tree/master/examples/custom-insertion-position)|
|`scriptLoading`| `{'blocking'|'defer'}'`| `blocking'`| 现代浏览器支持非阻塞`javascript`加载（` defer`），以提高页面启动性能。|
|`favicon`|`{String}`|``|设置 HTML 的 icon 图标|
|`meta`|`{Object}`|`{}`|允许注入`meta`标签 E.g. `meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}`|
|`base`|`{Object|String|false}`|`false`|允许注入`base`标签 E.g. `base: "https://example.com/path/page.html`|
|`minify`|`{Boolean|Object}`|`true`| 生产环境下，压缩 HTML[更多](https://github.com/jantimon/html-webpack-plugin#minification)|
|`hash`|`{Boolean}`|`false`|如果设置为`true`将会给所有产出的`js文件、css文件`追加一个唯一的hash值，这对于清除缓存很有用|
|`cache`|`{Boolean}`|`true`| 如果模板发生改变，触发编译|
|`showErrors`|`{Boolean}`|`true`|编译的错误详细信息会写入到 HTML 中|
|`chunks`|`{?}`|`?`|允许添加一些指定的`chunk` (e.g only the unit-test chunk)|
|`chunksSortMode`|`{String|Function}`|`auto`|对`chunks`排序，可选值`'none' | 'auto' | 'manual' | {Function}`|
|`excludeChunks`|`{Array:string}`|`''`|排除部分`chunk` (e.g don't add the unit-test chunk)|
|`xhtml`|`{Boolean}`|`false`|如果为`true`，则将标签设置为自动闭合（符合XHTML）|

### CSS相关
#### extract-text-webpack-plugin
:::tip 注意
此插件只适用于 wepack1.x、webpack2.x、webpack3.x，不适应于 webpack4.x，4.x官方推荐的提取 css 的插件是 `mini-css-extract-plugin`
:::

**使用**
```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 创建多个实例，提取不同的文件
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css'); // 可以设置输出的目录 stylesheets
const extractLESS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract([ 'css-loader', 'less-loader' ])
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    extractCSS,
    extractLESS,
    new ExtractTextPlugin('stylesheets/[name].css')
  ]
};
```
**选项**
+ 创建实例
  
  `new ExtractTextPlugin(options: filename | object)`
  |名称|类型|描述|
  |---|---|---|
  |`id`|`{String}`|此插件实例的唯一标识（仅对于高级用法，默认情况下自动生成）|
  |`filename`|`{String|Function}`|输出文件的名称，支持模板语法，包括`[name]`, `[id]`和`[contenthash]`|
  |`allChunks`|`{Boolean}`|从所有的`chunk`中提取（默认情况下，它仅从初始块中提取）|
  |`disable`|`{Boolean}`|禁用插件|
  |`ignoreOrder`|`{Boolean}`|禁用订单检查（对CSS模块有用！），默认情况下为false|
+ `extract`方法

  `ExtractTextPlugin.extract(options: loader{String} | object)`
  |名称|类型|描述|
  |---|---|---|
  |`use`|`{String}|{Array}|{Object}`|用于转换css的loaders(必须)|
  |`fallback`|`{String}|{Array}|{Object}`|未提取CSS时应使用的loader(例如`style-loader`)|
  |`publicPath`|`{String}`|覆盖此加载程序的publicPath设置|

#### mini-css-extract-plugin
该插件将CSS提取到单独的文件中。 它为每个包含CSS的JS文件创建一个CSS文件。 它支持CSS和SourceMap的按需加载。它基于新的webpack v4功能（模块类型）构建，并且需要webpack 4才能工作。**建议将mini-css-extract-plugin与css-loader结合使用**

**对比**

与extract-text-webpack-plugin相比：
+ 支持异步加载
+ 不重复编译（提高性能）
+ 更容易使用
+ 特定于CSS

**[loader选项](https://webpack.js.org/plugins/mini-css-extract-plugin/#options)**

|名称|类型|默认值|描述|
|---|---|---|---|
|`publicPath`|`{String|Function}`|`webpackOptions.output`|指定自定义的公共路径|
|`esModule`|`{Boolean}`|`false`|默认生成的`module`使用的是`CommonJS`规范，设置为`true`之后使用esModule规范|
|`hmr`|`{Boolean}`|`false`|是否开启热更新|
|`reloadAll`|`{Boolean}`|`false`|强制更新|
|`modules`|`{Object}`|`undefined`|`CSS module`配置|
|`modules.namedExport`|`{Boolean}`|`false`|是否开启`css`导出功能(从css中导出类名，驼峰命名)|

**实例选项**

实力选项与`webpackOptions.output`中的选项类似，所有选项都是可选的。

**压缩**

`webpack4.x`压缩相关配置有自己的默认值，如果想覆盖，请使用像`optimize-css-assets-webpack-plugin`的插件，并配置`optimization.minimizer`,需要注意会覆盖JS模块的压缩，所以需要谨慎使用。

### 压缩相关
`webpack4.x`中所有与性能相关的大部分都在`optimization`选项中。
#### 压缩js
`webpack4.x`集成了默认的压缩，当构建模式为`production`时，自动会压缩js代码。当然你也可以重写默认的配置。官方推荐的是`terser-webpack-plugin`

**使用**
```js
module.exports = {
  optimization: {
    minimize: true, // 是否开启压缩功能，总开关
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i, // 处理匹配的文件
        include: /\/src/, // 设置处理范围
        exclude: /\/node_modules/, // 设置排除范围
        cache: true, // 启用缓存
        parallel: 3, // 使用多进程并行运行可提高构建速度，默认数量：os.cpus().length - 1
        sourceMap: true,
        sourceMap: true,
      }),
    ],
  },
}
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`test`|`{String|RegExp|Array<String|RegExp>}`|`/\.m?js(\?.*)?$/i`|筛选符合条件的文件进行处理|
|`include`|`{String|RegExp|Array<String|RegExp>}`|`undefined`|设置搜索范围|
|`exclude`|`{String|RegExp|Array<String|RegExp>}`|`undefined`|设置排除范围|
|`cache`|`{Boolean|String}`|`true`|是否缓存编译结果，默认的缓存路径是`node_modules/.cache/terser-webpack-plugin`，*webpack5已忽略此选项*|
|`cacheKeys`|`{Function}`|`defaultCacheKeys => defaultCacheKeys`|设置缓存时的唯一key，*webpack5已忽略此选项*|
|`parallel`|`{Boolean|Number}`|`true`|多线程编译，值为`true`时，为当前cpu内核数减一|
|`sourceMap`|`{Boolean}`|`false`|值使用的是`devtool`中的`source-map`,`inline-source-map`,`hidden-source-map`,` nosources-source-map`|
|`minify`|`{Function}`|`undefined`|可以重写压缩的功能，使用自己自定义的压缩规则|
|`terserOptions`|`{Object}`|[default](https://github.com/terser/terser#minify-options)|压缩时配置项|
|`extractComments`|`{Boolean|String|RegExp|Function<(node, comment) -> Boolean|Object>|Object}`|`true`|是否将注释提取到单独的文件中，默认情况下，仅使用`/^\**|@preserve|@license|@cc_on/i`条件提取注释，并删除其余注释。|

#### 压缩css
`webpack4.x`不再使用`ExtractTextPlugin`压缩css，推荐使用的是`optimize-css-assets-webpack-plugin`，然后设置`optimization.minimizer`，这会覆盖`webpack`提供的默认值，因此请确保还指定一个JS压缩器。

`optimize-css-assets-webpack-plugin`将在`Webpack`构建期间搜索`CSS`资源，并优化/最小化`CSS`（默认情况下，它使用`cssnano`，但可以指定自定义`CSS`处理器）。它解决了`extract-text-webpack-plugin`构建中`css`添加重复的问题。

**使用**
```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: MiniCssExtractPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: [
    // 提取css到单独的文件
    new MiniCssExtractPlugin({
      filename: 'style/[name].css',
      ignoreOrder: false, // 删除有关顺序冲突的警告
    })
  ],
  optimization: {
    // 压缩器
    minimizer: [
      new TerserJSPlugin({}), // 官方文档有一个 '...' 的语法，但是没有成功，报错配置无效
      // 压缩CSS
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g, // 默认为 /\.css$/g
        cssProcessor: require('cssnano'), // 默认使用的是 cssnano 解析器
        cssProcessorPluginOptions: { // 对解析器的配置
          preset: ['default', { 
              discardComments: { removeAll: true } // 去掉注释
            }
          ]
        },
        canPrint: true // 是否打印编译信息
      })
    ]
  }
};
```
**选项**
|名称|类型|默认值|描述|
|---|---|---|---|
|`assetNameRegExp`|正则|`/\.css$/g`|符合匹配的文件才会被插件压缩，不是匹配源文件而是基于其他`loader`转换输出的文件名|
|`cssProcessor`|`promise`|`cssnano`|用于优化/压缩`CSS`的`CSS`处理器|
|`cssProcessorOptions`|`{Object}`|`{}`|对`CSS`处理器的配置|
|`cssProcessorPluginOptions`|`{Object}`|`{}`|传递给`CSS`处理器的插件选项|

### webpack自带的pulgin
#### webpack.ProvidePlugin
自动加载模块，并将模块注入到引用它的模块中，使用注入的模块时不必引入。

**使用**
```js
module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Vue: ['vue/dist/vue.esm.js', 'default']
    });
  ]
}
```
然后在我们任意源码中
```js
$('#app') // 起作用，不会报找不到 $ 的错误
jQuery('#app') // 起作用，不会报找不到 jQuery 的错误
new Vue({}) // 起作用，不会报找不到 Vue 的错误
```

#### webpack.DefinePlugin
`DefinePlugin`允许您创建可以在编译时配置的全局常量。这对于在开发版本和生产版本之间允许不同的行为很有用。这个地方指的是在代码中而不是配置文件中，配置文件中使用的是`webpack`的环境变量，代码中使用的全局常量的环境变量。

**使用**
```js
// 这些值将内联到代码中，从而允许最小化操作删除多余的条件代码。
const webpack = require('webpack')

const webpackConfig = {
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('v1.2'),
      BROWSER_SUPPORTS_HTML5: true,
      'typeof window': JSON.stringify('object'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
```
```js
// 代码中使用这些全局环境变量
console.log('Running App version ' + VERSION);
if(!BROWSER_SUPPORTS_HTML5) require('html5shiv');
if (PRODUCTION) {
  console.log('production code')
} else {
  console.log('debuge info')
}
```
:::tip 注意
在为`process`定义值时，最好使用`'process.env.NODE_ENV'：JSON.stringify('production')`而不是`process：{env：{NODE_ENV：JSON.stringify('production')}}`。使用后者将覆盖`process`对象，这可能会破坏与期望在`process`对象上定义其他值的某些模块的兼容性。
:::
> 当代码编译压缩之后会剔除那些不满足全局变量的代码，已达到最大程度的压缩代码。

### 代码分割
`SplitChunkPlugin`是`webpack4.x`内置的一个开箱即用的**提取公共代码，代码分割**的插件。相比于`CommonsChunkPlugin`，增加了更多的功能来进一步优化。

默认情况下，它仅影响按需块，因为更改`entry`块会影响`HTML`文件应包含的`script`标签以运行项目。

`webpack`将根据以下条件自动拆分`chunk`：
+ 可以被共享的新`chunk`，或者模块来自`node_modules`文件夹
+ 新的`chunk`大于20kb(在gz压缩之前)
+ 当按需加载`chunk`时，并行请求的最大数量小于或等于30
+ 初始页面加载时并行请求的最大数量小于或等于30
> 当尝试满足最后两个条件时，最好使用较大的`chunk`。

#### 默认值
```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```
:::warning 注意
当webpack处理文件路径时，它们在Unix系统上始终包含/，在Windows上始终包含\。 这就是为什么在{cacheGroup} .test字段中使用[\\ /]来表示路径分隔符的原因。 在跨平台使用时，{cacheGroup} .test中的/或\将导致问题。
:::

#### Optimization.splitChunks配置项
|名称|类型|默认值|描述|
|---|---|---|---|
|`automaticNameDelimiter`|`{String}`|`~`|默认情况下，webpack将使用块的来源和名称生成名称（例如vendors~main.js）。此选项使您可以指定用于生成名称的定界符。|
|`chunks`|`{String|Function}`|`'async'`|这表明将选择哪些块进行优化，有效值为`all`，`async`和`initial`。提供`all`可能特别强大，因为这意味着即使在异步和非异步块之间也可以共享块。|
|`maxAsyncRequests`|`{Number}`|`30`|按需加载时的最大并行请求数|
|`maxInitialRequests`|`{Number}`|`30`|入口点的最大并行请求数|
|`minChunks`|`{Number}`|`1`|拆分前必须共享模块的最小块数|
|`minSize`|`{Number}`|`20000`|生成块的最小大小(以字节为单位)|
|`enforceSizeThreshold`|`{Number}`|`50000`|强制执行拆分的大小的阈值，其他限制(`minRemainingSize`，`maxAsyncRequests`，`maxInitialRequests`)将被忽略|
|`maxSize`|`{Number}`|`0`|告诉`webpack`尝试将大于`maxSize`字节的块拆分为较小的部分|
|`maxAsyncSize`|`{Number}`||与`maxSize`类似，区别在于仅会影响按需加载块|
|`maxInitialSize`|`{Number}`||与`maxSize`类似，区别在于仅会影响初始加载块|
|`name`|`{Boolean|Function}`|`true`|拆分块的名称。提供`true`将基于块和缓存组密钥自动生成一个名称|
|`automaticNamePrefix`|`{String}`|`''`|为创建的块设置名称前缀|
|`cacheGroups`|`{Object}`|见上面配置|缓存组可以继承/覆盖`splitChunks.*`中的任何选项，但是`test`，`priority`和`reuseExistingChunk`只能在高速缓存组级别配置，要禁用任何默认缓存组，请将它们设置为`false`|

#### splitChunks.cacheGroups.{cacheGroup}配置项
|名称|类型|默认值|描述|
|---|---|---|---|
|`priority`|`{Number}`|`0`|一个模块可以属于多个缓存组。优化将首选具有较高`priority`的缓存组|
|`reuseExistingChunk`|`{Boolean}`||如果当前`chunck`包含已从主捆绑包中拆分出的模块，则它将被重用，而不是生成新的模块。|
|`type`|`{Function|RegExp|String}`|`''`|允许按模块类型将模块分配给缓存组|
|`test`|`{Function|RegExp|String}`|`''`|控制此缓存组选择的模块。省略它会选择所有模块。|
|`filename`|`{Function|String}`|`''`|仅在`entry`模块时才允许覆盖文件名|
|`enforce`|`{Boolean}`|`false`|告诉`webpack`忽略`splitChunks.minSize`，`splitChunks.minChunks`，`splitChunks.maxAsyncRequests`和`splitChunks.maxInitialRequests`只为这个高速缓存组创建块|
|`idHint`|`{String}`|`''`|设置块ID的提示。它将被添加到块的文件名中。|

### 其他功能
#### clean-webpack-plugin
清除`webpack.output.path`目录，防止文件越来越多。

**使用**
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackConfig = {
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

## 代码分割
此功能使您可以将代码分成多个`bundle`，然后**按需**或**并行**加载。它可用于实现较小的捆绑包并控制资源负载优先级，如果正确使用，则会对负载时间产生重大影响。

> `webpack4.x`已经将`CommonsChunkPlugin`移除，使用`SplitChunksPlugin`替代。

共有三种通用的代码拆分方法：
+ 入口点：使用`entry`配置手动拆分代码
  + 这是拆分代码的最简单方法，更偏向手动拆分，并且有一些问题，最大的问题就是**可能会包含重复的模块**。
+ 去除重复代码：使用`SplitChunksPlugin`来去除重复数据，将重复代码拆分出单独的`bundle`
  + 通过`SplitChunksPlugin`可以灵活的提取公共代码（推荐）
+ 动态导入：通过模块内的内联导入函数调用拆分代码
  + 在导入模块时，进行**特殊的注释**，`webpack`支持两种导入方式

### 入口点分割
入口点分割其实就是默认的多入口，每一个入口构建出一个`bundle`，是天然的分割。存在的问题是，如果多个入口中包含相同的模块，那么这个模块都会被打包进各自的`bundle`中。
```js
const path = require('path');

module.exports = {
  mode: 'development',
  // 有两个入口文件，每个入口文件都引入了 loadsh
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
}
```
构建结果，从大小上看得出都将`lodash`打包进来了。
```js
...
            Asset     Size   Chunks             Chunk Names
another.bundle.js  550 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
...
```

**结论：这不是理想的代码分割。**

### 去除重复代码(提取公共代码)
在这里重点是使用`webpack4.x`内置的`SplitChunksPlugin`插件进行代码分割，相关的配置在`optimization.splitChunks`配置项下。
```js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

### 动态导入
对于动态代码拆分，`webpack`支持两种类似的技术。一种是符合`ECMAScript`规范的`import()`语法进行动态导入(推荐)。另一种是特定于`webpack`的`require.ensure`。
> 注意使用`chunkFilename`，它确定非入口文件的名称。
```js
// src/index.js
function getComponent() {
  // 使用 import 方法异步加载 lodash 模块，前面的注释很关键，然后通过回调获取加载结果
  return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
    const element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
  }).catch(error => 'An error occurred while loading the component');
}

getComponent().then(component => {
  document.body.appendChild(component);
})
```
可以通过`async`函数转换为同步
```js
// src/index.js
async function getComponent() {
  const element = document.createElement('div');
  // 使用 import 方法异步加载 lodash 模块，前面的注释很关键，然后通过回调获取加载结果
  const _ = await import(/* webpackChunkName: "lodash" */ 'lodash')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(getComponent())
```
### 预请求/预加载
`webpack 4.6.0+`开始支持预请求和预加载。此功能换言之是懒加载的功能。
+ `prefetch`: 懒加载，浏览器在空闲时间加载
  + 场景：当点击某个按钮才加载相应的`bundle`时，使用懒加载，不点击不加载。
+ `preload`: 提前加载依赖，并行于父模块加载，父模块加载完成开始`prefetch`
  + 场景：某个模块需要其他依赖，需要提前下载依赖，使用`preload`
```js
// 懒加载
import(/* webpackPrefetch: true */ 'LoginModal')
// 预加载
import(/* webpackPreload: true */ 'ChartingLibrary')
```

:::warning 注意
错误地使用webpackPreload实际上会影响性能，因此使用时请务必小心。
:::

### 打包分析工具
+ [webpack-chart](https://alexkuz.github.io/webpack-chart/)：Webpack统计信息的交互式饼图。
+ [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)：可视化和分析您的包，以查看哪些模块占用了空间，哪些可能是重复的。
+ [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)：一个插件和CLI实用程序，将包内容表示为方便的交互式可缩放树形图。
+ [webpack软件包优化助手](https://webpack.jakoblind.no/optimize)：此工具将分析您的软件包，并为您提供切实可行的建议，以减少软件包的大小。
+ [bundle-stats](https://github.com/bundle-stats/bundle-stats)：生成捆绑包报告（捆绑包大小，资产，模块），并比较不同版本之间的结果。
