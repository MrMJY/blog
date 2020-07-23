## (1) 谈一谈cookie、sessionStorage、localStorage异同
### 浏览器存储
总的来说,现在市面上最常见的数据存储方案是以下三种：

+ Cookie
+ web存储 (locaStorage和seesionStorage)
+ IndexedDB
### Coolie
**优点**

Cookie的兼容性非常的好，兼容现在市面上所有的主流浏览器

**缺点**
+ 存储量小。基本上都是在4kb左右。
+ 影响性能。由于Cookie会由浏览器作为请求头发送，因此当Cookie存储信息过多时，会影响特定域的资源获取的效率，增加文档传输的负载。
+ 只能储存字符串。
+ 安全问题。存储在Cookie的任何数据可以被他人访问，因此不能在Cookie中储存重要的信息。
+ 由于第三方Cookie的滥用，所以很多老司机在浏览网页时会禁用Cookie，所以我们不得不测试用户是否支持Cookie，这也是很麻烦的一件事。
+ 操作麻烦。只能整体读取和覆盖，必须封装好对cookie的操作函数。document.cookie

### web存储
**locaStorage**

**locaStorage**对象作为持久保存客户端数据的方案从功能上来讲，我们可以通过locaStorage在浏览器端存储键值对数据，它相比于cookie而言，提供了更为直观的API，且在安全上相对好一点，而且虽然locaStorage只能存储字符串，但它也可以存储字符串化的JSON数据，因此相比于cookie，locaStorage能存储更复杂的数据。

特点：
+ 存储时间长。持久保存客户端数据，直到用户清除
+ 操作简单。提供了更为直观的API
+ 存储空间大。提供最多5M大小
+ 更加安全。**注意还是要不要在locaStorage中存储敏感信息**
+ 同源的文档间会共享locaStorage的数据，他们可以互相读取对方的数据，甚至有时会覆盖对方的数据。

**API**
```js
// 获取
locaStorage.getItem("name")
// 设置
locaStorage.setItem("name", "张三")
// 移除
locaStorage.removeItem("name")
// 清除所有
locaStorage.clear()
```

**sessionStorage**

它与 localStorage 相似，不同之处在于 localStorage里面存储的数据没有过期时间设置，而Session Storage只存储当前会话页的数据，当用户关闭当前会话页或浏览器时，数据会被清除。

特点：
+ 存储时间长。持久保存客户端数据，直到用户清除或关闭当前页面、浏览器
+ 操作简单。提供了更为直观的API
+ 存储空间大。提供最多5M大小
+ 更加安全。**注意还是要不要在locaStorage中存储敏感信息**

**API**
```js
// 获取
sessionStorage.getItem("name")
// 设置
sessionStorage.setItem("name", "张三")
// 移除
sessionStorage.removeItem("name")
// 清除所有
sessionStorage.clear()
```