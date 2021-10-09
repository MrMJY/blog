## JavaScript
### 1.常用的数组方法有哪些？
**ES5**
+ concat() 连接多个数组，进行一层解构
  + `Array.prototype.concat.apply([], [1, [2, 3]]) // [1, 2, 3]`
+ slice()、splice()、sort()、replace()、join()、split()、reverse()
+ push()、shift()、pop()、unshift()、indexOf()
+ forEach()、filter()、map()、some()、every()、reduce()

**ES6**
+ Array.from() 伪数组转数组
+ Array.isArray() 检查是否是数组
+ entries() 返回一个新的Array Iterator对象，该对象包含数组中每个索引的键/值对
+ find() 返回满足提供的测试函数的第一个元素的值
+ findIndex() 返回满足提供的测试函数的第一个元素的索引
+ includes() 是否包含一个指定的值,返回一个布尔值，替换indexOf()

[更多查看MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
### 2.常用的对象方法有哪些？
**ES5**
+ Object.create() 创建一个对象，指定原型或者返回一个没有原型的对象（继承）
+ Object.defineProperty() Vue2.x数据双向绑定的原理
+ Object.defineProperties() 批量定义属性，相当于defineProperty的批量操作
+ Object.getPrototypeOf() 返回指定对象的原型

**ES6**
+ Object.assign() 浅拷贝
+ Object.keys() 获取目标对象自身的可遍历的key集合
+ Object.values() 获取目标对象自身的可遍历的value集合
+ Object.entries() 获取目标对象自身的可遍历的key,value数组
### 3.ES6新增了哪些方法和功能？
+ let、const 不能重复声明，变量提升问题
+ 解构赋值、字符串扩展（模板字符串）、字符串方法新增
+ 函数扩展（默认参数、剩余参数、尾调用优化、箭头函数）
+ 数组扩展（...扩展运算符、新增方法）
+ 对象扩展（对象属性增强写法、...扩展运算符、super关键字、方法新增）
+ Symbol基础类型（同名但可以不重复的值）
+ Set和Map数据结构
+ Prmoise异步回调解决方案
+ async、await(ES7)终极解决方案
+ Class类的定义
+ Module模块化语法

### 4.谈一谈你对模块化的理解？
### 5.JavaScript中的`const`数组可以进行`push`操作吗？为什么？
`const`实际上保证的，并不是变量的值不得改动，**而是变量指向的那个内存地址所保存的数据不得改动**。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

相关文章：
+ [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/let#%E6%9C%AC%E8%B4%A8)
### 6.JavaScript中对象的属性描述符有哪些？分别有什么作用？
属性描述符是`ECMAScript5`新增的语法，它其实就是一个内部对象，用来描述对象的属性的特性。
+ `configurable`：控制该属性的描述符能否被改变
+ `enumerable`：控制该属性是否可以被枚举
+ `value`：该属性对应的值
+ `writable`：控制属性的值是否可以被赋值运算符改变
+ `get`：当访问该属性时，会调用此函数
+ `set`：当属性值被修改时，会调用此函数
:::warning 注意
属性描述符有两种主要形式：**数据描述符**和**存取描述符**。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由`getter`函数和`setter`函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。
:::
相关文章：
+ [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
### 7.JavaScript中`console`有哪些api?
+ `log()`：向控制台输出一条消息。
+ `count()`：输出被调用的次数，此函数接受一个可选参数`label`。
+ `time()`：你可以启动一个计时器来跟踪某一个操作的占用时长。
+ `timeEnd()`：结束特定的计时器并以豪秒打印其从开始到结束所用的时间。
+ `dir()`：在控制台中显示指定`JavaScript`对象的属性，并通过类似文件树样式的交互列表显示。
+ `error()`：向控制台输出一条错误消息。
+ `table()`：将列表型的数据打印成表格。
+ ...

相关文章：
+ [Console](https://developer.mozilla.org/zh-CN/docs/Web/API/Console)
### 8.简单对比一下`Callback`、`Promise`、`Generator`、`Async`几个异步API的优劣？
**Callback(回调函数)：**
+ 优点：简单、很常用。常见的有定时器回调函数等
+ 缺点：
  + 因为调用环境的变化而导致`this`的指向性变化
  ```js
  const obj = {
    value: 'hello',
    deferExecBind() {
      // 使用箭头函数可达到一样的效果
      setTimeout(this.console.bind(this), 1000);
    },
    deferExec() {
      setTimeout(this.console, 1000);
    },
    console() {
      console.log(this.value);
    }
  }
  obj.deferExecBind(); // hello
  obj.deferExec(); // undefined
  ```
  + 多个继发的异步任务时容易导致回调地狱
  ```js
  fs.readFile(fileA, 'utf-8', function (err, data) {
    fs.readFile(fileB, 'utf-8', function (err, data) {
      fs.readFile(fileC, 'utf-8', function (err, data) {
        fs.readFile(fileD, 'utf-8', function (err, data) {
          // 假设在业务中 fileD 的读写依次依赖 fileA、fileB 和 fileC
          // 或者经常也可以在业务中看到多个 HTTP 请求的操作有前后依赖（继发 HTTP 请求）
          // 这些异步任务之间纵向嵌套强耦合，无法进行横向复用
          // 如果某个异步发生变化，那它的所有上层或下层回调可能都需要跟着变化（比如 fileA 和 fileB 的依赖关系倒置）
          // 因此称这种现象为 回调地狱
          // ....
        });
      });
    });
  });
  ```
  + 回调函数不能通过`return`返回数据，只能通过再次回调的方式进行参数传递
  ```js
  // 希望延迟 1s 后执行并拿到结果
  function getAsyncResult(result) {
    setTimeout(() => {
      return result * 3;
    }, 1000);
  }
  // 尽管这是常规的编程思维方式
  const result = getAsyncResult(3000);
  // 但是打印 undefined
  console.log('result: ', result);

  function getAsyncResultWithCb(result, cb) {
    setTimeout(() => {
      cb(result * 3);
    }, 1000);
  }

  // 通过回调的形式获取结果
  getAsyncResultWithCb(3000, (result) => {
    console.log('result: ', result); // 9000
  });
  ```
  + 无法通过在外部进行`try...catch...`的方式进行错误捕获
  ```js
  try {
    setTimeout(() => {
      // 下述是异常代码
      // 你可以在回调函数的内部进行 try...catch...
      console.log(a.b.c)
    }, 1000)
  } catch(err) {
    // 这里不会执行
    // 进程会被终止
    console.error(err)
  }
  ```
  + 如果使用第三方的异步`API`并且提供了回调能力时，这些`API`可能是非受信的
    + 使用者的回调函数设计没有进行错误捕获，而恰恰三方库进行了错误捕获却没有抛出错误处理信息，此时使用者很难感知到自己设计的回调函数是否有错误
    + 使用者难以感知到三方库的回调时机和回调次数，这个回调函数执行的权利控制在三方库手中
    + 使用者无法更改三方库提供的回调参数，回调参数可能无法满足使用者的诉求
    + ...
    ```js
    // 假设以下是一个三方库，并发布成了npm 包
    const lib = {
      params: '',
      emit(params) {
        this.params = params;
      },
      on(callback) {
        try {
          // callback 回调执行权在 lib 上
          // lib 库可以决定回调执行多次
          callback(this.params);
          callback(this.params);
          callback(this.params);
          // lib 库甚至可以决定回调延迟执行
          // 异步执行回调函数
          setTimeout(() => {
            callback(this.params);
          }, 3000);
        } catch (err) {
          // 假设 lib 库的捕获没有抛出任何异常信息
        }
      },
    };

    // 开发者引入 lib 库开始使用
    lib.emit('hello');

    lib.on((value) => {
      // 使用者希望 on 里的回调只执行一次
      // 这里的回调函数的执行时机是由三方库 lib 决定
      // 实际上打印四次，并且其中一次是异步执行
      console.log(value);
    });

    lib.on((value) => {
      // 下述是异常代码
      // 但是执行下述代码不会抛出任何异常信息
      // 开发者无法感知自己的代码设计错误
      console.log(value.a.b.c)
    });
    ```

**Promise：**
+ 优点：
  + `Promise`对象的执行状态不受外界影响。`Promise`对象的异步操作有三种状态：`pending`(进行中)、`fulfilled`(已成功)和`rejected`(已失败)，只有`Promise`对象本身的异步操作结果可以决定当前的执行状态，任何其他的操作无法改变状态的结果。
  + `Promise`对象的执行状态不可变。`Promise`的状态只有两种变化可能：从`pending -> fulfilled`或从`pending -> rejected`。
  ```js
  const promise = new Promise((resolve, reject) => {
    // 状态变更为 fulfilled 并返回结果 1 后不会再变更状态
    resolve(1);
    // 不会变更状态
    reject(4);
  });
  promise.then((result) => {
    // 在 ES6 中 Promise 的 then 回调执行是异步执行（微任务）
    // 在当前 then 被调用的那轮事件循环（Event Loop）的末尾执行
    console.log('result: ', result);
  }).catch((error) => {
    // 不执行
    console.error('error: ', error);
  });
  ```
  + `Promise`可以规避回调地狱问题
  ```js
  const firstPromise = (result) => {
    return new Promise((resolve, reject) => {
      // Mock 异步请求
      // 将 resolve 改成 reject 会被 catch 捕获
      setTimeout(() => resolve(result), 1000);
    });
  };

  const nextPromise = (result) => {
    return new Promise((resolve, reject) => {
      // Mock 异步请求
      // 将 resolve 改成 reject 会被 catch 捕获
      setTimeout(() => resolve(result * 2), 1000);
    });
  };

  firstPromise(1000).then((result) => {
    // 返回一个promise
    return nextPromise(result);
  }).then((result) => {
    // 2s 后打印 2000
    console.log('result: ', result);
  }).catch((err) => {
    // 任何一个 Promise 到达 rejected 状态都能被 catch 捕获
    console.error('err: ', err);
  });
  ```
+ 缺点：
  + 无法取消`Promise`的执行
  + 无法在`Promise`外部通过`try...catch...`的形式进行错误捕获（`Promise`内部捕获了错误）
    ```js
    try {
      const p = new Promise((resolve, reject) => {
        // 一个错误
        console.log(a.b)
        resolve(1)
      })
    } catch(err) {
      // 捕获不到
      console.log('try', err)
    }
    ```
  + 状态单一，每次决断只能产生一种状态结果，需要不停的进行链式调用(代码冗余)
:::warning 注意
手写`Promise`是面试官非常喜欢的一道笔试题，本质是希望面试者能够通过底层的设计正确了解 Promise 的使用方式，如果你对`Promise`的设计原理不熟悉，可以深入了解一下或者手动设计一个。
:::
**Generator：**
+ 优点：
  + 丰富了状态类型，`Generator`通过`next`可以产生不同的状态信息，也可以通过`return`结束函数的执行状态，相对于`Promise`的`resolve`不可变状态更加丰富
  + `Generator`函数内部的异步代码执行看起来和同步代码执行一致，非常利于代码的维护
  + `Generator`函数内部的执行逻辑和相应的状态变化逻辑解耦，降低了代码的复杂度
  ```js
  const firstPromise = (result) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(result * 2), 1000);
    });
  };

  const nextPromise = (result) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(result * 3), 1000);
    });
  };
  // 在 Generator 函数里执行的异步代码看起来和同步代码一致
  function* gen(result) {
    // 异步代码
    const firstResult = yield firstPromise(result)
    console.log('firstResult: ', firstResult) // 2
    // 异步代码
    const nextResult = yield nextPromise(firstResult)
    console.log('nextResult: ', nextResult) // 6
    return nextPromise(firstResult)
  }

  const g = gen(1)

  // 手动执行 Generator 函数
  g.next().value.then((res) => {
    // 将 firstPromise 的返回值传递给第一个 yield 表单式对应的 firstResult
    return g.next(res).value
  }).then((res) => {
    // 将 nextPromise 的返回值传递给第二个 yield 表单式对应的 nextResult
    return g.next(res).value
  })
  ```
+ 缺点：`Generator`函数的错误处理相对复杂一些，极端情况下需要对执行和`Generator`函数进行双重错误捕获

**Async：**
+ 优点：
  + 内置执行器：`Generator`函数需要设计手动执行器或者通用执行器进行执行，`Async`语法则内置了自动执行器，设计代码时无须关心执行步骤
  + `yield`命令无约束：在`Generator`中使用`Co`执行器时`yield`后必须是`Promise`对象或者 `Thunk`函数，而`Async`语法中的`await`后可以是`Promise`对象或者原始数据类型对象、数字、字符串、布尔值等（此时会对其进行`Promise.resolve()`包装处理） 
  + 返回`Promise`：`async`函数的返回值是`Promise`对象（返回原始数据类型会被`Promise`进行封装），因此还可以作为`await`的命令参数，相对于`Generator`返回`Iterator`遍历器更加简洁实用
  + `Async`的错误处理相对于`Generator`会更加简单
  ```js
  const firstPromise = (result) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(result * 2), 1000);
    });
  };

  const nextPromise = (result) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(result * 3), 1000);
    });
  };

  async function co() {
    const firstResult = await firstPromise(1);
    // 1s 后打印 2
    console.log('firstResult: ', firstResult); 
    // 等待 firstPromise 的状态发生变化后执行
    const nextResult = await nextPromise(firstResult);
    // 2s 后打印 6
    console.log('nextResult: ', nextResult); 
    return nextResult;
  }

  co();

  co().then((res) => {
    console.log('res: ', res); // 6
  }).catch(err => {
    console.log(err);
  });
  ```
### 10.`Object.defineProperty`和`ES6`的`Proxy`有什么区别？
**MDN解释：**
+ `Object.defineProperty`：在一个对象上**定义一个新属性**，或者**修改一个对象的现有属性**，并返回此对象。
+ `Proxy`：用于创建一个对象的**代理**，从而实现基本操作的**拦截和自定义**（如属性查找、赋值、枚举、函数调用等）

**区别：**
+ 前者重点用于描述对象属性，后者重点在于代理（劫持）用途不同
+ 前者可以只能通过`set`和`get`实现对象属性读取、修改的劫持，后者可以劫持对属性的各种操作
+ 前者只能一个一个定义劫持，后者可以实现对整个对象的劫持，效率更高
> 这也是`Vue2`与`Vue3`数据劫持的不同之处，`Vue2`为了兼容低版本浏览器使用前者对数据的读取、修改进行劫持；`Vue3`则使用`Proxy`实现数据的劫持，补充了删除、添加等操作的劫持，因此`Vue3`废弃了`$set`、`$delete`这些方法。

相关文章：
+ [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
+ [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
### 11.`ES6`中`Symbol`、`Map`、`Decorator`的使用场景有哪些？或者你在哪些库的源码里见过这些`API`的使用？
**Symbol：**
+ 消除魔法字符，可以用于定义一组常量，保证这组常量的值都是不相等的
+ 作为对象的`key`，避免相同的`key`被覆盖情况
+ 模拟类的私有方法
  ```js
  const speak = Symbol();
  class Person {
    // 使用者无法在外部创建出一个相同的 speak，所以就无法调用该方法
    [speak]() {
      ...
    }
  }
  ```
## TypeScript
## Node.js
等语法的了解和使用