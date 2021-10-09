## 计算机原理
## HTML
## CSS
### 1.如何实现一个上中下三行布局，顶部和底部最小高度是100px，中间自适应?
```html
<html>
  <body>
    <div class="top"></div>
    <div class="content"></div>
    <div class="bottom"></div>
  </body>
</html>
```
+ 定位
```css
/* 高度设置为浏览器高度 */
html, body {
  height: 100%;
  position: relative;
}

body > div {
  position: absolute;
}

.top {
  top: 0;
  width : 100%;
  height: 100px;
  background-color: red;
}

.content {
  top: 100px;
  bottom: 100px;
  background-color: blue;
}

.bottom {
  bottom: 0;
  height: 100px;
  background-color: red;
}
```
+ 弹性布局
```css
html, body {
  height:100%;
}

body {
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  background-color: blue;
}

.top, .bottom {
  height: 100px;
  background-color: red;
}
```
+ 网格布局
```css
html, body {
  height: 100%;
}

body {
  height: 100%;
  display: grid;
  background-color: blue;
  grid-template-rows: 100px auto 100px;
}

.top, .bottom {
  background-color: red;
}
```
### 2.如何判断一个元素`CSS`样式溢出，从而可以选择性的加`title`或者`Tooltip`
通过题目可以看出，这个问题的重点是如何判断一个元素的内容溢出。说到底是想考察盒子模型相关的问题，已经如何计算判断溢出，至于如何添加`title`或者`Tooltip`都是次要的。

![元素大小位置详细图解](http://www.mjy-blog.cn/blog-assets/元素大小详细图解.jpg)

**相关熟悉：**
+ `offsetWidth/offsetHeight`：对象的可见宽度（包含滚动条区域）
+ `clientWidth/clientHeight`：内容的可见宽度（不包含滚动条区域）
+ `scrollWidth/scrollHeight`：元素完整的高度和宽度（包含看不到的部分）
+ `offsetLeft/offsetTop`：当前元素距**浏览器**边界的偏移量，以像素为单位
+ `clientTop/clientLeft`：这个属性测试下来的结果就是border
+ `scrollLeft/scrollTop`：设置或返回已经滚动到元素的左边界或上边界的像素数

**相关公式：**
+ `clientWidth`(内容宽度)=`elementWidth`(元素宽度)+`padding`(内边距)-滚动条的宽度(如果有滚动条)(不考虑边界`border`)
+ `offsetWidth`(可见宽度)=`elementWidth`(元素宽度)+`padding`(内边距)+`border`(边界)(滚动条包含在边界内部了，没有产生额外距离，不用计算)
+ `clientTop`=`border-top`属性值
+ `offsetTop`=`border-top`属性值+`margin`

**添加title或者Tooltip：**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>CSS文字溢出显示提示title或者tooltip</title>
    <style>
      div {
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    </style>
  </head>
  <body>
    <div id="div">我是一段溢出的文字！</div>
  </body>
  <script>
      const div = document.getElementById('div')
      div.addEventListener('mouseover', function() {
        if (div.offsetWidth < div.scrollWidth) {
          div.title = '我是一段溢出的文字！'
        }
      })
  </script>
</html>
```
### 3.如何让`CSS`元素左侧自动溢出
`CSS`属性`direction`用来设置文本、表列水平溢出的方向。`rtl`表示从右到左，`ltr`表示从左到右。
### 4.什么是沙箱？浏览器的沙箱有什么作用？
相关文章：
+ [浏览器的沙箱机制](https://zhuanlan.zhihu.com/p/80390160)
+ [说说JS中的沙箱](https://juejin.cn/post/6844903954074058760)
## 编译原理
### 1.解释型语言和编译型语言的差异是什么？JavaScript是如何运行的？
**编译型语言**和**解释型语言**这两个都是概念，没有团体或者组织规定这些。

编译型语言是代码在**运行前**编译器将人类可以理解的语言（编程语言）转换成机器可以理解的语言。编译型语言编写的应用在编译后能直接在环境中运行。

解释型语言也是人类可以理解的语言（编程语言），也需要转换成机器可以理解的语言才能执行，但是是在**运行时**转换的，所以执行前需要将**解释器安装在环境中**。

共同点:
  + 都要将源代码转换为二进制代码才能执行。

不同点：
  + 从运行效果上来看。编译型语言要等全部写完后通过编译器去生成一个类似*.exe的二进制文件，然后双击这个文件才可以看到效果。而解释型语言并没生成*.exe文件，而是直接生成效果。
  + 运行的时候是否需要编译器的伴随。编译型语言运行的是最终生成的二进制代码，所以不需要编译器伴随。而解释型语言则一边解释一边运行，需要编译器伴随。
  + 执行的速度对比。编译型语言运行的已经是完全的二进制内容，运行起来十分干净利落，所以速度很快。而解释型语言运行的不一定是完全的二进制内容，因为它是一边解释成二进制一边运行。速度没有前者快，但是CPU的运行速度如果很快，可能看不出来，只是偶尔会看到“有点卡”的效果。
  + 可移植性对比。编译型语言是运行二进制内容，所以一旦CPU指令系统改变，那么之前的二进制文件可能运行不了。可移植性、平台兼容性比价差。而解释型语言是在需要的时候才开始编译、运行。所以它自然具有可移植性，即在任何平台都可以马上运行起来。
  > 要注意的是它的解释工具如：浏览器，本身就是编译型语言解释出来的二进制代码，所以浏览器本身不具备可移植性，是需要针对不同的平台弄出对应的浏览器最终二进制文件的，这里可别混淆。
  + 升级上对比。编译型语言弄出来的二进制文件若要升级，自然要重新下载一个新的二进制文件。所以重新下载、安装、覆盖是最大的特点，体验性就不大好。而解释型的语言只要重新写好源代码即可，用户想要最新的效果，只要刷新一下即可，所以体验性好。

结论：JavaScript代码需要在机器（node或者浏览器）上安装一个工具（JS引擎）才能执行。这是解释型语言需要的。编译型语言产品能够自由地直接运行。

相关文章：
+ [一文了解解释型语言和编译型语言之区别](https://zhuanlan.zhihu.com/p/111763425)
+ [通过v8 0.1.5源码分析js的编译、执行过程](https://zhuanlan.zhihu.com/p/106346315)

### 2.简单描述一下Babel的编译过程？
Babel的编译过程可分为以下是三个过程：
+ 解析(`@babel/parser`，解析器是`babylon`)
  + 该过程将源代码解析成`AST`，并分为两个阶段：词法分析与语法分析。
    + 词法分析:将代码字符串分解为`AST`节点(或者叫`token`令牌流)，如`var a = 1`被分解为`var`、`a`、`=`、`1`四个节点
    + 语法分析:将节点序列转换成一个由元素逐级嵌套的表示程序语法结构的树，这就是AST
+ 转换(`@babel/traverse`)
  + 它提供深度优先遍历`AST`语法树的能力，用于维护操作`AST`的状态，定义了更新、添加和移除节点的操作方法，转换成新的`ATS`。这部分也是`Babel`插件介入工作的部分。
+ 生成(`@babel/generator`)
  + 将经过转换的`AST`通过`@babel/generator`再转换成`js`代码，过程就是深度优先遍历整个 `AST`，然后构建可以表示转换后代码的字符串（就是转换后的es5代码），并生成源码的映射(`source maps)。

相关文章：
+ [Babel的一点理解](https://zhuanlan.zhihu.com/p/367046978)
### 3.JavaScript中的数组和函数在内存中是如何存储的？
**`JavaScript`中的数组存储大致需要分为两种情况：**
+ 快数组：同种类型数据的数组分配连续的内存空间，内部是通过扩容和收缩机制实现动态调整存储空间大小
  + 扩容：扩容后的新容量 = 旧容量的1.5倍 + 16，扩容后会将数组拷贝到新的内存空间中
  + 收缩：容量 >= length的2倍 + 16，则进行收缩容量调整，否则用holes对象填充未被初始化的位置。
+ 慢数组：存在非同种类型数据的数组使用哈希映射分配内存空间
  + 不用开辟大块连续的存储空间，节省了内存。
  + 由于需要维护一个`HashTable`，其效率会比快数组低。

**快数组、慢数组的区别：**
+ 存储方式方面：快数组内存中是连续的，慢数组在内存中是零散分配的。
+ 内存使用方面：由于快数组内存是连续的，可能需要开辟一大块供其使用，其中还可能有很多空洞，是比较费内存的。慢数组不会有空洞的情况，且都是零散的内存，比较节省内存空间。
+ 遍历效率方面：快数组由于是空间连续的，遍历速度很快，而慢数组每次都要寻找`key`的位置，遍历效率会差一些。

**JS函数浏览器中的存储（堆）:**
> 浏览器在读取到函数时，并非直接将函数体中代码执行，而是会将函数以字符串的形式存储在浏览器的内存中，这个过程浏览器会分配一块堆内存用于函数的存储，并记录函数存储的位置(16进制的地址)

**JS代码的执行环境--ECStack：**
+ `ECStack(Execution Context Stack)`
> `ECStack`执行环境栈，它也是浏览器从内存中拿出的一块内存，但是是栈结构内存，作用是执行代码，而非保存代码。
+ `EC(Execution Context)`
> `EC`执行上下文，`EC`不同于`ECStack`它虽然同样是栈内存，但是它的作用是为了在函数执行时，区分全局和函数作用域执行所处的不同作用域（保障每个词法作用域下的代码的独立性）
+ `GO(Global Object)`
> 浏览器会将供JS调用的属性和方法（内置对象）存放在`GO`中，同时浏览器会声明一个名为`window`的属性指向这个对象
+ `AO & VO (Active Object & Variable Object)`
> 代码执行时，会创建变量，`VO`就是用于存储这些变量的空间。`VO`通常用于存放全局变量（全局变量一般情况下是不被释放的），而函数执行或其他情况下形成的私有上下文的变量存储在`AO`中，`AO`是`VO`的一种，区别是`AO`通常指的是进出栈较为频繁的对象

![函数的创建和执行](http://www.mjy-blog.cn/blog-assets/函数运行过程.jpg)

**函数的创建和执行：**
> 函数创建时，会从内存中新建一块堆内存来存储代码块。在函数执行时，会从堆中取出代码字符串，存放在新建的栈中。
+ 创建
  + 开辟堆内存（16进制得到内存地址）
  + 声明当前函数的作用域（函数创建的上下文才是他的作用域，和在那执行的无关）
  + 把函数的代码以字符串的形式存储在堆内存中（函数在不执行的情况下，只是存储在堆内存中的字符串）
  + 将函数堆的地址，放在栈中供变量调用（函数名）
+ 执行
  + 会形成一个全新的执行上下文EC(xx)（目的是供函数体中的代码执行），然后进栈（ECStack执行环境栈）执行
  + 在私有上下文中有一个存放变量的变量对象AO(xx)
  + 代码执行之前需要做的事
    + 初始化作用域链<自己的上下文，函数的作用域>
    + 初始化`this`（箭头函数没有`this`）
    + 初始化`arguments`实参集合（箭头函数没有`arguments`）
    + 形参赋值（形参变量是函数的私有变量，需要存储在AO中）
    + 变量提升（在私有上下文中声明的变量都是私有变量）
![函数运行过程](http://www.mjy-blog.cn/blog-assets/函数的创建和执行.jpg)

相关文章：
+ [js数组内存分配](https://blog.csdn.net/qq_42928070/article/details/113931969)
+ [JavaScript函数的存储机制(堆)和执行原理(栈)](https://zhuanlan.zhihu.com/p/346366911)
### 4.浏览器和Node.js中的事件循环机制有什么区别？
**浏览器内核：**

简单来说浏览器内核是通过取得页面内容、整理信息（应用 CSS）、计算和组合最终输出可视化的图像结果，通常也被称为渲染引擎。

浏览器内核是多线程，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：
+ `GUI`渲染线程
  + 主要负责页面的渲染，解析`HTML`、`CSS`，构建`DOM`树，布局和绘制等。
  + 当界面需要重绘或者由于某种操作引发回流时，将执行该线程。
  + 该线程与`JS`引擎线程互斥，当执行`JS`引擎线程时，`GUI`渲染会被挂起，当任务队列空闲时，`JS`引擎才会去执行`GUI`渲染。

+ `JS`引擎线程
  + 该线程当然是主要负责处理`JavaScript`脚本，执行代码。
  + 也是主要负责执行准备好待执行的事件，即定时器计数结束，或者异步请求成功并正确返回时，将依次进入任务队列，等待`JS`引擎线程的执行。
  + 当然，该线程与`GUI`渲染线程互斥，当`JS`引擎线程执行`JavaScript`脚本时间过长，将导致页面渲染的阻塞。

+ 定时器触发线程
  + 负责执行异步定时器一类的函数的线程，如：`setTimeout`，`setInterval`。
  + 主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理，当计数完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待`JS`引擎线程执行。

+ 事件触发线程
  + 主要负责将准备好的事件交给`JS`引擎线程执行。
  > 比如`setTimeout`定时器计数结束，`ajax`等异步请求成功并触发回调函数，或者用户触发点击事件时，该线程会将整装待发的事件依次加入到任务队列的队尾，等待`JS`引擎线程的执行。

+ 异步`HTTP`请求线程
  + 负责执行异步请求一类的函数的线程，如：`Promise`、`axios`、`ajax`等。
  + 主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待`JS`引擎线程执行。

**浏览器中的Event Loop：**

**宏队列和微队列：**
  + `macro-task`(宏任务)也叫`tasks`：包括整体代码`script`、`setTimeout`、`setInterval`、`I/O`、`UI Rendering(浏览器独有)`、`requestAnimationFrame(浏览器独有)`、`setImmediate(Node独有)`等
  + `micro-task`(微任务)也叫`jobs`：`Promise.then catch finally`，`process.nextTick(Node独有)`，`MutationObserver`

**浏览器EventLoop的具体流程：**
+ 一开始执行栈（遵循先进后出的原则）空，`micro`队列空，`macro`队列里有且只有一个`script`脚本（整体代码）。
+ 全局上下文（script 标签）被推入执行栈，同步代码执行。在执行的过程中，会判断是同步任务还是异步任务，通过对一些接口的调用，可以产生新的`macro-task`与`micro-task`，它们会分别被其他辅助线程处理，处理完成后推入各自的任务队列里。同步代码执行完了，`script`脚本会被移出`macro`队列，这个过程本质上是队列的`macro-task`的执行和出队的过程。
+ 上一步我们出队的是一个`macro-task`，这一步我们处理的是`micro-task`。处理`micro`队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。
  > 需要注意的是：`macro-task`任务是**一个一个**执行的；而`micro-task`任务是**一队一队**执行的。
+ **执行渲染操作，更新界面**
+ 检查是否存在`Web worker`任务，如果有，则对其进行处理
+ 上述过程循环往复，直到两个队列都清空

**怎么知道主线程执行栈为空：**

js引擎存在`monitoring process`进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去`Event Queue`那里检查是否有等待被调用的函数。

![浏览器中的Event Loop](http://www.mjy-blog.cn/blog-assets/浏览器中的EventLoop.jpg)

**总结：当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。**
```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
  
  Promise.resolve().then(() => {
    console.log(6)
  }).then(() => {
    console.log(7)
    
    setTimeout(() => {
      console.log(8)
    }, 0);
  });
})

setTimeout(() => {
   console.log(9)
}, 0);
console.log(10)
// 答案：1，4，10，5，6，7，2，3，9，8 你做对了吗？ 如果还不明白的话对照图在走一次。
// Promise.resolve().then(() => {})会立即让回调处于就位状态
```
**`Node`中的`Event Loop`**

`Node`中的`Event Loop`和浏览器中的是完全不相同的东西。`Node.js`采用`V8`作为`js`的解析引擎，而`I/O`处理方面使用了自己设计的`libuv`，`libuv`是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的`API`，事件循环机制也是它里面的实现。
<img src="http://www.mjy-blog.cn/blog-assets/node-eventloop.jpg" style="width: 100%;"></img>
**Node.js 的运行机制如下：**

+ `V8`引擎解析`JavaScript`脚本
+ 解析后的代码，调用`Node API`
+ `libuv`库负责`Node API`的执行。它将不同的任务分配给不同的线程，形成一个`Event Loop`，以异步的方式将任务的执行结果返回给`V8`引擎
+ `V8`引擎再将结果返回给用户

**六个阶段：**

其中`libuv`引擎中的事件循环分为6个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当**队列为空**或者**执行的回调函数数量到达系统设定的阈值**，就会进入下一阶段。

![Node事件循环6个阶段](http://www.mjy-blog.cn/blog-assets/node-step.jpg)

从上图中，大致看出`node`中的事件循环的顺序：

外部输入数据(初始点) –> 轮询阶段(poll) –> 检查阶段(check) –> 关闭事件回调阶段(close callback) –> 定时器检测阶段(timer) –> I/O事件回调阶段(I/O callbacks) –> 闲置阶段(idle, prepare) –> 轮询阶段（按照该顺序反复运行）...
+ `timers`阶段：这个阶段执行`timer`(`setTimeout`、`setInterval`)的回调
+ `I/O callbacks`阶段：处理一些上一轮循环中的少数未执行的`I/O`回调
+ `idle`、`prepare`阶段：仅`node`内部使用
+ `poll`阶段：获取新的`I/O`事件，适当的条件下`node`将阻塞在这里
+ `check`阶段：执行`setImmediate()`的回调
+ `close callbacks`阶段：执行`socket`的`close`事件回调

**(1) timer阶段：**

`timers`阶段会执行`setTimeout`和`setInterval`回调，并且是由`poll`阶段控制的。
同样，在`Node`中定时器指定的时间也**不是准确时间**，只能是尽快执行。

**(2) poll阶段：**

`poll`是一个至关重要的阶段，这一阶段中，系统会做两件事情
+ 回到`timer`阶段执行回调
  + 如果没有设定了`timer`的话，会发生以下两件事情
    + 如果`poll`队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
    + 如果`poll`队列为空时，会有两件事发生
      + 如果有`setImmediate`回调需要执行，`poll`阶段会停止并且进入到`check`阶段执行回调
      + 如果没有`setImmediate`回调需要执行，会**等待回调**被加入到队列中并**立即执行回调**，这里同样会有个**超时时间**设置防止一直等待下去
  + 设定了`timer`的话且`poll`队列为空，则会判断是否有`timer`超时，如果有的话会回到`timer`阶段执行回调
+ 执行`I/O`回调

**(3) check 阶段：**

`setImmediate()`的回调会被加入`check`队列中，从`event loop`的阶段图可以知道，`check`阶段的执行顺序在 `poll`阶段之后。

相关文章：
+ [浏览器与Node的事件循环(Event Loop)有何区别?(推荐)](https://zhuanlan.zhihu.com/p/54882306)
+ [【图解】浏览器及nodeJS中的EventLoop事件循环机制](https://zhuanlan.zhihu.com/p/389250124)
+ [Node.js VS 浏览器以及事件循环机制](https://juejin.cn/post/6871832597891121166)
### 5.`ES6 Modules`相对于`CommonJS`的优势是什么?
**区别：**

`CommonJS`是一种模块规范，最初被应用于`Nodejs`，成为`Nodejs`的模块规范。

自`ES6`起，引入了一套新的`ES6 Module`规范，在语言标准的层面上实现了模块功能，而且实现得相当简单，有望成为浏览器和服务器通用的模块解决方案。但目前浏览器对`ES6 Module`兼容还不太好，平时在`Webpack`中使用的`export`和`import`，会经过`Babel`转换为`CommonJS`规范。在使用上的差别主要有：
+ `CommonJS`模块输出的是一个值的拷贝，`ES6`模块输出的是值的引用。
+ `CommonJS`模块是运行时加载，`ES6`模块是编译时输出接口。
+ `CommonJs`是单个值导出，`ES6 Module`可以导出多个。
+ `CommonJs`是动态语法可以写在判断里，`ES6 Module`静态语法只能写在顶层。
+ `CommonJs`的`this`是当前模块，`ES6 Module`的`this`是`undefined`。

**优势：**
+ `ES6 Module`在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 `CommonJS`和`AMD`规范，成为浏览器和服务器通用的模块解决方案。
+ `ES6 Module`的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，可以在编译时做“静态优化”，效率要比`CommonJS`模块的加载方式高。
+ 能进一步拓宽`JavaScript`的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。
+ 不再需要`UMD`模块格式了，将来服务器和浏览器都会支持`ES6`模块格式。目前，通过各种工具库，其实已经做到了这一点。
+ 将来浏览器的新`API`就能用模块格式提供，不再必须做成全局变量或者`navigator`对象的属性。
+ 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供。

相关文章：
+ [ECMAScript 6 入门-Module-概述](https://es6.ruanyifeng.com/#docs/module#%E6%A6%82%E8%BF%B0)
+ [CommonJs和ES6 module的区别是什么呢？](https://www.zhihu.com/question/62791509/answer/1535800470)
+ [ES6 模块与 CommonJS 模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)
## 数据结构
## 算法
## 设计模式
### 1.发布/订阅模式和观察者模式的区别是什么？
**观察者模式：**

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。主要解决一个对象状态改变给其他对象通知的问题，而且要考虑到易用和低耦合，保证高度的协作。
![观察者模式](http://www.mjy-blog.cn/blog-assets/观察者模式.jpg)

**发布订阅模式：**

发布者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为**消息代理**或**调度中心**或**中间件**，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者。
![观察者与发布订阅模式区别](http://www.mjy-blog.cn/blog-assets/观察者与发布订阅模式区别.jpg)

**两者区别：**
+ 订阅-发布是观察者模式的一个变种。
+ 观察者模式中主体和观察者是互相感知的，发布-订阅模式是借助第三方来实现调度的，发布者和订阅者之间互不感知（完全解耦）
+ 订阅-发布模式，观察者只有订阅了才能接受到被观察者的消息，同时观察者还可以取消订阅被观察者的消息
+ 观察者模式，多用于单个应用内部，发布订阅模式，则更多的是一种跨应用的模式

相关文章：
+ [观察者模式和发布-订阅模式的区别](https://www.jianshu.com/p/c577e9fc8ae4)
### 2.装饰器模式一般会在什么场合使用？
**基本概念和功能：**

装饰器模式能够**实现从一个对象的外部来给对象添加功能，有非常灵活的扩展性，可以在对原来的代码毫无修改的前提下，为对象添加新功能**。除此之外，装饰器模式还能够**实现对象的动态组合**，借此我们可以很灵活地给动态组合的对象，匹配所需要的功能。

**装饰器的使用：**

装饰器(`Decorator`)是`ES7`的一个新语法，是一种与类(`class`)相关的语法，用来注释或修改**类**和**类方法**，装饰器是一种函数，写成`@ + 函数名`。它可以放在类和类方法的定义前面。

+ 类的装饰
```js
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
```
`@testable`就是一个装饰器。它修改了`MyTestableClass`这个类的行为，为它加上了静态属性`isTestable`。`testable`函数的参数`target`是`MyTestableClass`类本身。装饰器函数的第一个参数，就是所要装饰的目标类。
```js
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```
如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。这就等于可以修改装饰器的行为。
:::warning 注意
装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。
:::
+ 类方法的装饰
```js
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```
装饰器函数`readonly`一共可以接受三个参数。
```js
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```
装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，所以只能去装饰原型（这不同于类的装饰，那种情况时`target`参数指的是类本身）；第二个参数是所要装饰的属性名，第三个参数是该属性的描述对象。

如果同一个方法有多个装饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

**应用场景：**
+ 当我们接手老代码，需要对它已有的功能做个拓展。

相关文章：
+ [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/decorator)
+ [装饰器模式的使用总结](https://blog.csdn.net/xiaofeng10330111/article/details/105608235)
## 编程范式
### 1.列举你所了解的编程范式？
编程范式（Programming paradigm）是指计算机编程的基本风格或者典型模式，可以简单理解为编程学科中实践出来的具有哲学和理论依据的一些经典原型。常见的编程范式有：
+ 面向过程（Process Oriented Programming，POP）
+ 面向对象（Object Oriented Programming，OOP）
+ 面向接口（Interface Oriented Programming， IOP）
+ 面向切面（Aspect Oriented Programming，AOP）
+ 函数式（Funtional Programming，FP）
+ 响应式（Reactive Programming，RP）
+ 函数响应式（Functional Reactive Programming，FRP）

不同的语言可以支持多种不同的编程范式，例如 C 语言支持 POP 范式，C++ 和 Java 语言支持 OOP 范式，Swift 语言则可以支持 FP 范式，而 Web 前端中的 JavaScript 可以支持上述列出的所有编程范式。