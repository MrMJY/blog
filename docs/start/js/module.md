## 什么是模块?
+ 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起
+ 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

模块化主要是用来抽离公共代码，隔离作用域，避免变量冲突等。将一个复杂的系统分解为多个模块以方便编码。

## CommonJS
::: tip 提示
同步加载
:::
CommonJS 是以在浏览器环境之外构建 JavaScript 生态系统为目标而产生的项目，比如在服务器和桌面环境中。

ComminJS规范中，每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。**在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。**

CommonJS 的模块主要由原生模块 module 来实现，这个类上的一些属性对我们理解模块机制有很大帮助。
```js
Module {
  id: '.', // 如果是 mainModule id 固定为 '.'，如果不是则为模块绝对路径
  exports: {}, // 模块最终 exports
  filename: '/absolute/path/to/entry.js', // 当前模块的绝对路径
  loaded: false, // 模块是否已加载完毕
  children: [], // 被该模块引用的模块
  parent: '', // 第一个引用该模块的模块
  paths: [ // 模块的搜索路径
   '/absolute/path/to/node_modules',
   '/absolute/path/node_modules',
   '/absolute/node_modules',
   '/node_modules'
  ]
}
```

CommonJS 代表：Node 应用中的模块，通俗的说就是你用 npm 安装的模块。

### 特点：
+ 所有代码都运行在模块作用域，不会污染全局作用域。
+ 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取 缓存结果。要想让模块再次运行，必须清除缓存。
+ 模块加载的顺序，按照其在代码中出现的顺序。

### 基本语法
+ 暴露模块：`module.exports = value`或`exports.xxx = value`
+ 引入模块：`require(xxx)`,如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

### CommonJS暴露的模块到底是什么?

CommonJS规范规定，每个模块内部，module变量代表当前模块。这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。**加载某个模块，其实是加载该模块的module.exports属性。**
```js
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```
require命令用于加载模块文件。**require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象。如果没有发现指定模块，会报错。**

CommonJS模块的加载机制是，**输入的是被输出值的拷贝**。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

### 服务端
+ 最常用的就是 Node，各个模块都是通过CommonJS引入

由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。

### 浏览器端
借助 Browserify 将 CommonJS 规范代码编译为浏览器可以识别的ES5代码
+ 安装Browserify
  + 全局: `npm install browserify -g`
  + 局部: `npm install browserify --save-dev`
+ 打包处理js
  + 根目录下运行 `browserify js/src/app.js -o js/dist/bundle.js`

## AMD
AMD规范则是非同步加载模块，允许指定回调函数。**浏览器端一般采用AMD规范**，原因是**浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式（Ajax异步请求模块）**

### 基本语法
```js
// 定义没有依赖的模块
define(function() {
   return 模块
})

// 定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
   return 模块
})

// 引入模块
require(['module1', 'module2'], function(m1, m2){
   // 使用m1、m2
})
```
### 使用
+ 下载require.js, 并引入
  + RequireJS是一个工具库，主要用于客户端的模块管理。它的模块管理遵守AMD规范，RequireJS的基本思想是，**通过define方法，将代码定义为模块；通过require方法，实现代码的模块加载。**
+ 使用`define`方法定义模块，`require`方法导入模块

## CMD
CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD规范整合了CommonJS和AMD规范的特点。
### 基本语法
```js
// 定义没有依赖的模块
define(function(require, exports, module){
  exports.xxx = value
  module.exports = value
})

// 定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
  //引入依赖模块(异步)
  require.async('./module3', function (module3) {
  })
  //暴露模块
  exports.xxx = value
})

// 引入使用模块
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

## ES6模块化
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

### 基本语法
```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}

// 默认导出
// export-default.js
export default function () {
  console.log('foo');
}
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```
### ES6 模块与 CommonJS 模块的差异
+ CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
+ CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

### 使用
使用Babel将ES6编译为ES5代码，使用Browserify编译打包js。
+ 安装babel-cli, babel-preset-es2015和browserify
  + npm install babel-cli browserify -g
  + npm install babel-preset-es2015 --save-dev
  + preset 预设(将es6转换成es5的所有插件打包)
+ 定义.babelrc文件
  + ```json
    {
      "presets": ["es2015"]
    }
    ```
+ 编写ES Module 代码
+ 编译
  + 使用Babel将ES6编译为ES5代码(但包含CommonJS语法) : `babel js/src -d js/lib`
  + 使用Browserify编译js : `browserify js/lib/app.js -o js/lib/bundle.js`

### 总结
+ CommonJS规范主要用于**服务端编程，加载模块是同步的**，这并不适合在浏览器环境，因为同步意味着**阻塞加载**，浏览器资源是异步加载的，因此有了AMD CMD解决方案。
+ AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
+ CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行。不过，依赖 SPM 打包，模块的加载逻辑偏重
+ ES Module 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

参考资料：
+ [前端模块化详解](https://github.com/ljianshu/Blog/issues/48)
+ [CommonJS 和 ES6 Module 究竟有什么区别？](https://mp.weixin.qq.com/s/mbEb2fCCqVEXJCtX_5_8bg)