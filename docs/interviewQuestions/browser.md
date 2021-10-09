## 功能

## 默认功能
### 1.如何处理浏览器中表单项的密码自动填充问题？
+ `input`标签`HTML5`新增了一个`autocomplete`属性，这个属性表示这个控件的值是否可被浏览器自动填充（推荐）。
+ 如果项目不支持`HTML5`，那么可以给第一个`type=text`的`input`前面再加一个隐藏的`type=text`的`input`，给第一个`type=password`的`input`前面再加一个隐藏的`type=password`的`input`。

相关文章：
+ [input输入（表单输入）元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#htmlattrdefautocomplete)
+ [浏览器保存密码后自动填充问题](https://segmentfault.com/a/1190000016253795)
### 2.`Hash`和`History`路由的区别和优缺点？
**Hash模式：**
+ 原理：通过`hashChange()`事件监听`hash`值的变化，根据路由表对应的`hash`值来判断加载对应的路由加载对应的组件
+ 优点：
  + 不需要后端的参与
  + 兼容性好，浏览器都能支持
  + `hash`值改变不会向后端发送请求
+ 缺点：
  + `hash`值前面需要加`#`，不符合`url`规范，也不美观

**History模式：**
+ 原理：`history`运用了浏览器的历史记录栈，之前有`back`、`forward`、`go`方法，之后在`HTML5`中新增了`pushState()`和`replaceState()`方法，它们提供了对历史记录进行修改的功能，不过在进行修改时，虽然改变了当前的`URL`，但是浏览器不会马上向后端发送请求。通过监听`popstate`事件监听变化
+ 优点：
  + 符合`url`地址规范，不需要`#`，使用起来比较美观
+ 缺点：
  + 在用户手动输入地址或刷新页面时会发起`url`请求，后端需要配置`index.html`，在页面用户匹配不到静态资源的情况，否则会出现404错误
  + 兼容性比较差，是利用了`HTML5 History`对象中新增的`pushState()`和`replaceState()`方法，需要浏览器支持。

相关文章：
+ [history路由和hash的区别](https://www.jianshu.com/p/92474ea31c06)
+ [单页应用到底该用hash模式还是history模式](https://www.microanswer.cn/blog/61)
+ [单页应用路由实现没那么难--Vue](https://segmentfault.com/a/1190000015373559)
## 兼容问题