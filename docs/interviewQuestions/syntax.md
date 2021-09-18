## JavaScript
### (1) 常用的数组方法有哪些？
**ES5**
+ concat() 连接多个数组，进行一层解构

  `Array.prototype.concat.apply([], [1, [2, 3]]) // [1, 2, 3]`
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
### (2) 常用的对象方法有哪些？
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
### (3) ES6新增了哪些方法和功能？
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

### (4) 谈一谈你对模块化的理解？
## ECMAScript
## CSS
## TypeScript
## HTML
## Node.js
等语法的了解和使用