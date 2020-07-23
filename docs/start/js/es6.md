## Set和Map结构
### Set
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

**特点**
+ Set本身是一个构造函数，用来生成 Set **数据结构(成员的值唯一的结构)**。
+ Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
+ 向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。
+ `Array.from`方法可以将 Set 结构转为数组

**实例属性和方法**
+ `Set.prototype.size`：返回Set实例的成员总数。
+ `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
+ `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
+ `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为Set的成员。
+ `Set.prototype.clear()`：清除所有成员，没有返回值。

**实例的遍历方法**
+ `Set.prototype.keys()`：返回键名的遍历器
+ `Set.prototype.values()`：返回键值的遍历器
+ `Set.prototype.entries()`：返回键值对的遍历器
+ `Set.prototype.forEach()`：使用回调函数遍历每个成员

**数组去重**
```js
const array = [1, 3, 5, 1, 3]
// 去除数组的重复成员
[...new Set(array)]
Array.from(new Set(array))
```
```js
// 赋值数据类型，对象数组的去重
const allData = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '周周' }
]
let selectedData = [allData[0]]
// 一些点击操作获取从allData中获取到了一些数据（引用）
const curSeleData = [allData[0], allData[3]]
selectedData = [...new Set(selectedData.concat(curSeleData))]; // 创建一个 set 数据结构，去重
```
**并集（Union）、交集（Intersect）和差集（Difference）**
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

### Map
ES6 提供了 Map 数据结构，它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键，提供了“值—值”的对应。
```js
const m = new Map();
const o = {p: 'Hello World'};
// 以对象为键
m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```
作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。
```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

**实例属性和方法**
+ `Map.prototype.size`：返回Map实例的成员总数。
+ `Map.prototype.add(value)`：添加某个值，返回 Map 结构本身。
+ `Map.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
+ `Map.prototype.has(value)`：返回一个布尔值，表示该值是否为Map的成员。
+ `Map.prototype.clear()`：清除所有成员，没有返回值。

**实例的遍历方法**
+ `Map.prototype.keys()`：返回键名的遍历器
+ `Map.prototype.values()`：返回键值的遍历器
+ `Map.prototype.entries()`：返回键值对的遍历器
+ `Map.prototype.forEach()`：使用回调函数遍历每个成员