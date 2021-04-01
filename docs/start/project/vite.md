<img src="./img/vite.svg" style="display: block; width: 30%; margin-left: auto; margin-right: auto;">

## 简介
Vite(法语单词“fast”，发音为`/vit/`)是一种构建工具，旨在为现代Web项目提供更快，更精简的开发体验。它包括两个主要部分：
+ 一个开发服务器，它在本地ES模块上提供了丰富的增强功能，例如，极快的热模块更换（HMR）。
+ 一个构建命令，它使用Rollup打包您的代码，并为生产环境提供了配置已产出高度优化的输出资源。

Vite武断的提供了开箱即用的智能默认设置，但通过`Plugin API`和`JavaScript API`也可以高度扩展。
## 功能特点
+ NPM依赖解析和预编译
  + 通过`esbuild`将第三方包(`CommonJS/UMD`)预编译为`ESM`，使用`esbuild`大大提高编译速度。
  + 重写引用的路径，使能够引用到正确的编译为`ESM`的第三方包
+ 热更新(HMR)，Vite通过本地`ESM`提供了`HMR API`。
+ 支持开箱即用的`TypeScript`
  + Vite使用`esbuild`将`TypeScript`转换为`JavaScript`，这比普通`tsc`快20到30倍，并且`HMR`更新可以在不到50毫秒的时间内反映在浏览器中。
+ Vite对Vue提供完全支持
+ 支持开箱即用的JSX和TSX
+ CSS更多的支持
  + 导入`.css`文件将通过具有HMR支持的`<style>`标签将其内容注入页面。
  + 支持`@import`内联，，所有CSS`url()`引用会自动重新设置基础路径，以确保正确性（Sass和Less文件也支持）。
  + 支持PostCSS配置。
  + 支持CSS模块文件。任何以`.module.css`结尾的CSS文件都被视为CSS模块文件。
  + 支持各种CSS预处理。Vite确实为`.scss`，`.sass`，`.less`，`.styl`和`.stylus`文件提供了**内置支持**。无需为其安装Vite专用插件，但必须安装相应的预处理器本身。
+ 支持多种静态资源引入
+ 支持导入JSON，还支持命名导入。
+ 提供默认的智能构建优化
  + 异步导入Polyfill
  + CSS代码分割
  + 为入口`chunks`生成预加载指令
  + 优化异步块加载
## 依赖预编译
### 预编译的原因
+ **CommonJS和UMD兼容性**：在开发过程中，Vite的开发人员将所有代码用作本地ESM。因此，Vite必须首先将以`CommonJS`或`UMD`形式提供的依赖项转换为ESM。
  > 转换`CommonJS`依赖项时，Vite会执行智能导入分析，以便即使动态分配了导出（例如React），对`CommonJS`模块的命名导入也可以按预期工作：
  ```js
  // works as expected
  import React, { useState } from 'react'
  ```
+ **性能**：Vite将带有许多内部模块的ESM依赖关系转换为单个模块，以提高后续页面加载性能。
  > 某些包附带了其ES模块，因为它们相互之间导入了许多单独的文件。例如，`lodash-es`有600多个内部模块！当我们从` lodash-es`导入`import { debounce } from 'lodash-es'`时，浏览器会同时触发600多个HTTP请求！当使用预编译时，则会将`lodash-es`编译成一个模块，现在我们只需要一个请求即可！
### 自动发现依赖
如果在现有的缓存中找不到依赖，Vite将抓取源代码并自动发现依赖项导入(从node_modules中的导入)，并将这些找到的导入用作预编译的入口点。预编译是通过`esbuild`执行的，因此通常非常快。

服务器启动后，如果遇到新的依赖项导入（尚未在缓存中），则Vite将重新运行依赖编译进程并重新加载页面。
### Monorepos和链接的依赖项
在monorepo设置中，依赖项可能是来自同一存储库的链接包。Vite自动检测到未从`node_modules`解析的依赖关系，并将链接的dep视为源代码。它不会尝试编译链接的dep，而是将分析链接的dep的依赖项列表。
### 自定义操作
默认的依赖项查找方式可能并不总是令人满意的。如果要从列表中明确**包含/排除**依赖关系，请使用[optimizeDeps](https://vitejs.dev/config/#dep-optimization-options)配置选项。

对于`optimizeDeps.include`或`optimizeDeps.exclude`，典型的用例是在源代码中无法直接查找到导入的情况下。例如，也许导入是由于插件转换而创建的。这意味着Vite将无法在初始扫描中发现`import`只能在浏览器请求并转换文件后才发现`import`。这将导致服务器在服务器启动后立即重新编译。

`include`和`exclude`均可用于处理此问题。如果依赖关系很大（有许多内部模块）或是CommonJS，则应包括它；如果依赖性很小并且已经是有效的ESM，则可以将其排除，然后让浏览器直接加载它。
### 缓存
#### 文件系统缓存
Vite将预编译的依赖项缓存在`node_modules/.vite`中。它根据以下情况确定是否需要重新运行预编译步骤：
+ `package.json`中的`dependencies`列表
+ 软件包管理器锁定文件，例如`package-lock.json`，`yarn.lock`或`pnpm-lock.yaml`
+ `vite.config.js`中的相关字段（如果存在）

仅在上述情况之一发生更改时，才需要重新运行预编译步骤。

如果出于某种原因要强制Vite重新编译依赖，则可以使用`--force`命令行选项启动开发服务器，也可以手动删除`node_modules/.vite`缓存目录。
#### 浏览器缓存
已加载的依赖项请求使用HTTP请求头`max-age=31536000`进行了强缓存，不可更改，以提高开发期间的页面重新加载性能。一旦被缓存，这些请求将永远不会再次到达开发服务器。如果安装了其他版本的依赖，则附加的版本查询会自动使它们无效（如软件包管理器锁定文件中所示）。如果要通过进行本地编辑来调试依赖项，则可以：
+ 通过禁用浏览器控制台`Network`选项卡的`disable cache`选项
+ 通过`--force`命令重新启动Vite开发服务器以重新编译依赖
+ 重新加载页面

## 静态资源处理
相关：[公共基础路径](https://vitejs.dev/guide/build.html#public-base-path)

相关：[`assetsInclude`配置选项](https://vitejs.dev/config/#assetsinclude)
### 导入静态资源作为URL
导入静态资源后，将返回解析后的URL：
```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```
例如，`imgUrl`在开发过程中将为`/img.png`，在生产版本中成为`/assets/img.2d8efhg.png`。

这种功能类似于webpack的`file-loader`。不同之处在于，`import`可以使用绝对公共路径（基于开发期间的项目根目录）或相对路径。
+ CSS中的`url()`引用
+ 如果使用Vue插件，则Vue SFC模板中的资源引用将自动转换
+ 常见的图像，媒体和字体文件类型会自动检测为静态资源。可以使用`assetsInclude`选项扩展内部列表。
+ 引用的资源作为构建资产图的一部分包括在内，将获得散列的文件名，并且可以由插件进行处理以进行优化。
+ 小于`assetsInlineLimit`选项的资源将作为`base64`数据`URL`内联
#### 明确以URL引入
可以使用`?url`后缀将未包含在内部列表或者`assetsInclude`内的静态资源显式导入为URL。例如，这对于导入`Houdini Paint Worklets`非常有用。
```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```
#### 导入资源作为字符串
可以使用`?raw`后缀将资源作为字符串导入。
```js
import shaderString from './shader.glsl?raw'
```
#### 导入脚本文件作为Worker
可以将脚本文件作为带有后缀`?worker`的`web worker`导入。
```js
// Separate chunk in the production build
import Worker from './shader.js?worker'
const worker = new Worker()
```
### `public`目录
如果你有以下资源：
+ 从未在源代码中引用过（例如robots.txt）
+ 必须保留完全相同的文件名
+ ...或者您只是不想仅仅为了获取其URL而导入资源

你可以将资产放置在项目根目录下的特殊公共目录中。在开发过程中，此目录中的资产将在根路径`/`下提供，并按原样复制到`dist`目录的根目录中。

该目录默认为`<root>/public`，但可以通过`publicDir`选项进行配置。
::: warning 注意
+ 您应该始终使用根绝对路径引用公共资源。例如，在源代码中应将`public/icon.png`引用为`/icon.png`。
+ 无法从JavaScript导入公共资源。
:::
## 生成环境编译
当需要将应用程序部署到生产环境时，只需运行`vite build`命令。默认情况下，它使用`<root>/index.html`作为构建入口点，并生成适合通过静态托管服务提供服务的应用程序构建后的包。请查看[部署静态站点](https://vitejs.dev/guide/static-deploy.html)以获取有关流行服务的指南。
### 浏览器兼容性
生产环境下编译后的`chunck`假定对现代`JavaScript`有基线支持。默认情况下，所有代码都是针对具有[本地`ESM`脚本标签支持的浏览器](https://caniuse.com/es6-module)进行转译的：
+ Chrome >=61
+ Firefox >=60
+ Safari >=11
+ Edge >=16

轻量级[动态导入Polyfill](https://github.com/GoogleChromeLabs/dynamic-import-polyfill)也会自动注入。可以通过[`build.target`选项](https://vitejs.dev/config/#build-target)指定自定义目标，其中最低目标为`es2015`。

请注意，默认情况下，Vite仅处理语法转换，并且默认情况下不覆盖`polyfill`。您可以签出[Polyfill.io](https://polyfill.io/v3/)，这是一项基于用户浏览器的`UserAgent`字符串自动生成`polyfill`的服务。

可以通过[`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)支持旧版浏览器，它将自动生成旧版块和相应的ES语言功能`polyfill`。仅在不具有本机ESM支持的浏览器中有条件地加载旧版块。
### Public Base Path
如果要在嵌套的公共路径下部署项目，只需指定`base`选项，所有资源路径都将被相应地重写。也可以将此选项指定为命令行命令，例如`vite build --base=/my/public/path/`。

在构建过程中，JS导入的URL资源，CSS的`url()`引用和`.html`文件中的资源引用，将自动遵循这个选项。

另外当您需要动态地链接URL时。在这种情况下，可以使用全局注入的`import.meta.env.BASE_URL`变量，它将是公共基本路径。请注意，此变量在构建过程中会被静态替换，因此必须完全按原样显示（即`import.meta.env['BASE_URL']`无法正常工作）。
### 自定义构建
可以通过各种[构建配置选项](https://vitejs.dev/config/#build-options)来自定义构建。 具体来说，您可以通过`build.rollupOptions`直接调整基础的Rollup选项：
```js
// vite.config.js
module.exports = {
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
    }
  }
}
```
### 多页面应用
假设您具有以下源代码结构：
```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```
在开发过程中，只需导航或链接到`/nested/`即可正常工作，就像正常的静态文件服务器一样。

在构建期间，您需要做的就是指定多个`.html`文件作为入口点：
```js
// vite.config.js
const { resolve } = require('path')

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
}
```
### 库模式
当开发面向浏览器的库时，您可能大部分时间都花在导入实际库的测试/演示页上。使用Vite，您可以为此使用`index.html`以获得流畅的开发体验。

是时候打包您的库以进行分发了，请使用[`build.lib`配置选项](https://vitejs.dev/config/#build-lib)。确保还要外部化您不想打包到库中的所有依赖项，例如`vue`或`react`：
```js
// vite.config.js
const path = require('path')

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'MyLib'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
}
```
使用此配置运行`vite build`会使用构建为库的Rollup预设，并会产生两种包格式：es和umd（可通过build.lib进行配置）：
```
$ vite build
building for production...
[write] my-lib.es.js 0.08kb, brotli: 0.07kb
[write] my-lib.umd.js 0.30kb, brotli: 0.16kb
```
自动生成`package.json`:
```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```
## 环境变量和模式
### 环境变量
Vite在特殊的`import.meta.env`对象上公开`env`变量。在所有情况下都可以使用一些内置变量：
+ `import.meta.env.MODE`:{string}应用运行的模式
+ `import.meta.env.BASE_URL`:{string}从其提供应用程序的基本URL。这由`base`配置选项确定
+ `import.meta.env.PROD`:{boolean}应用程序是否正在生产模式中运行
+ `import.meta.env.DEV`:{boolean}应用程序是否正在开发模式中运行（始终与`import.meta.env.PROD`相反）

在生产过程中，这些env变量将被静态替换。因此，必须始终使用完整的静态字符串来引用它们。例如`import.meta.env[key]`将不起作用。
### `.env`文件
Vite使用[dotenv](https://github.com/motdotla/dotenv)从项目根目录中的以下文件加载其他环境变量：
```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```
加载的env变量也可以通过`import.meta.env`公开给您的客户端源代码。

为避免将env变量意外泄露给客户端，只有以`VITE_`开头的变量才对Vite处理的代码公开。例如以下文件：
```
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```
只有`VITE_SOME_KEY`会作为`import.meta.env.VITE_SOME_KEY`公开给您的客户端源代码，而`DB_PASSWORD`不会。
::: warning 安全注意事项
+ `.env.*.local`文件仅是本地文件，可以包含敏感变量。您应该将`.local`添加到`.gitignore`中，以避免将它们检入`git`中。
+ 由于暴露给Vite源代码的任何变量都将最终出现在您的客户端包中，因此`VITE_ *`变量不应包含任何敏感信息。
:::
### 模式
默认情况下，dev服务器（serve命令）在`development`模式下运行，而build命令在`production`模式下运行。

这意味着在运行`vite build`时，如果存在以下情况，它将从`.env.production`加载env变量：
```
# .env.production
VITE_APP_TITLE=My App
```
在您的应用中，您可以使用`import.meta.env.VITE_APP_TITLE`渲染标题。

但是，重要的是要理解，模式是一个更广泛的概念，而不仅仅是开发与生产。一个典型的示例是，您可能需要一种“staging”模式，该模式应具有与生产类似的行为，但与生产中的env变量略有不同。

您可以通过传递`--mode`选项标志来覆盖用于命令的默认模式。例如，如果您要为我们的假设staging模式构建应用程序：
```sh
vite build --mode staging
```
为了获得我们想要的行为，我们需要一个`.env.staging`文件：
```
# .env.staging
NODE_ENV=production
VITE_APP_TITLE=My App (staging)
```