## 简介
![gulp](http://www.mjy-blog.cn/blog-assets/gulp.gif)

`Gulp.js`是一个自动化构建工具，开发者可以使用它在项目开发过程中自动执行常见任务。`Gulp.js`是基于`Node.js`构建的，利用`Node.js`流的威力，你可以快速构建项目并减少频繁的`IO`操作。`Gulp.js`源文件和你用来定义任务的`Gulp`文件都是通过 `JavaScript`（或者`CoffeeScript`）源码来实现的。
## Gulp和Webpack的区别
`Gulp`侧重于前端开发的**整个过程**的控制管理（像是流水线），我们可以通过给`gulp`配置不通的`task`来让`gulp`实现不同的功能，从而构建整个前端开发流程。

`Webpack`更侧重于模块打包，当然我们可以把开发中的所有资源（图片、js文件、css文件等）都可以看成模块，通过`loader`（加载器）和`plugins`（插件）对资源进行处理。

`Gulp`是对整个过程进行控制，所以在其配置文件（gulpfile.js）中配置的每一个`task`对项目中该`task`配置**路径**下所有的资源都可以管理。
```js
// 对sass文件进行预编译的task可以对其配置路径下的所有sass文件进行预编译处理
gulp.task('sass', function() {
  gulp.src('src/styles/*.scss')
  .pipe(sass().on('error',sass.logError))
  .pipe(gulp.dest('./build/prd/styles/'));//编译后的输出路径
});
```
`Webpack`则不是这样管理资源的，它是根据模块的**依赖关系**进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。如将`css`文件引入到入口文件（`main.js`）中，最后通过插件将这个模块中的`css`再分离出来（`extract-text-webpack-plugin`）。
## 创建任务
每个`gulp`任务（task）都是一个异步的`JavaScript`函数，此函数是一个可以接收`callback`作为参数的函数，或者是一个返回 `stream`、`promise`、`event emitter`、`child process`或`observable`类型值的函数。
### 导出任务
任务（tasks）可以是`public（公开）或`private`（私有）类型的。
+ 公开任务（Public tasks）从`gulpfile`中被导出（export），可以通过`gulp`命令直接调用。
+ 私有任务（Private tasks）被设计为在内部使用，通常作为`series()`或`parallel()`组合的组成部分。
```js
const { series } = require('gulp');

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb();
}

// `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```
::: warning 注意：
在以前的`gulp`版本中，`task()`方法用来将函数注册为任务（task）。虽然这个`API`依旧是可以使用的，但是导出（export）将会是主要的注册机制，除非遇到`export`不起作用的情况。
:::
### 组合任务
`Gulp`提供了两个强大的组合方法：`series()`和`parallel()`，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。`series()`和`parallel()`可以互相嵌套至任意深度。
+ 如果需要让任务（task）按顺序执行，请使用`series()`方法。
+ 对于希望以最大并发来运行的任务（tasks），可以使用`parallel()`方法将它们组合起来。
## 处理文件
`gulp`暴露了`src()`和`dest()`方法用于处理计算机上存放的文件。

`src()`接受`glob`参数，并从文件系统中读取文件然后生成一个`Node`流（stream）。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。

`dest()`接受一个输出目录作为参数，并且它还会产生一个`Node`流（stream），通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。

流（stream）所提供的主要的`API`是`.pipe()`方法，用于连接转换流（Transform streams）或可写流（Writable streams）。
```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
```
## 文件监控
`Gulp`中的`watch()`方法利用文件系统的监控程序（file system watcher）将`globs`与任务（task）进行关联。它对匹配 `glob`的文件进行监控，如果有文件被修改了就执行关联的任务（task）。
```js
const { watch, series } = require('gulp');
function clean(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

// 可以只关联一个任务
watch('src/*.css', css);
// 或者关联一个任务组合
watch('src/*.js', series(clean, javascript));
```
## [API](https://www.gulpjs.com.cn/docs/api/concepts/)
## [插件](https://gulpjs.com/plugins/)
常用的插件：
+ 操作文件
  + [gulp-concat](https://github.com/gulp-community/gulp-concat)：文件合并插件
  + [gulp-rename](https://github.com/hparra/gulp-rename)：文件重命名插件
+ 开发调试
  + [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps)：支持sourcemap
  + [gulp-connect](https://github.com/avevlad/gulp-connect)：实时刷新插件
  + [gulp-clean](https://github.com/peter-vilja/gulp-clean)：清除文件插件
  + [gulp-open](https://github.com/stevelacy/gulp-open)：自动打开浏览器
+ 功能性
  + [gulp-inject](https://github.com/klei/gulp-inject)：全局注入插件
+ HTML
  + [gulp-htmlhint](https://github.com/bezoerb/gulp-htmlhint)：压缩HTML
+ JS
  + [gulp-babel](https://github.com/babel/gulp-babel)：用于转换ES6、7等下一代语法
  + [gulp-uglify](https://github.com/terinjokes/gulp-uglify)：压缩JS
  + [gulp-typescript](https://github.com/ivogabe/gulp-typescript)：转换TS
+ CSS
  + [gulp-sass](https://github.com/dlmanning/gulp-sass)：支持转换SASS
  + [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)：添加CSS私有前缀
  + [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont)：用于字体图标
  + [gulp-clean-css](https://github.com/scniro/gulp-clean-css)：压缩css
  + [gulp-image](https://github.com/1000ch/gulp-image)：压缩PNG、JPG、GIF、SVG


