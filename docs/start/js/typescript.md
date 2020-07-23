## 安装
+ 使用 `npm install -g typescript`,全局安装
+ 使用 `yarn global add typescript`,全局安装

## 编译ts文件
`tsc ./index.ts`

## 基本类型
**为变量声明类型**

```ts
// 【字符串】
let str: string = 'this is string';

// 【数字】
let num: number = 123;

// 【布尔值】
let truely: boolean = true;
// ts 中的 0、''、undefined、null 不能向 boolean 类型赋值

// 【Symbol】
let sym: symbol = Symbol()
let sym1 = Symbol()
console.log(sym === sym1) // false

// 【underfined 和 null】
let underfin: undefined;  // 声明变量但是未赋值
let empt: null = null;
// 设置了类型为 undefined 或 null 之后无法再赋值为其他类型

// 【数组】
// 方法一：
let arr1: number[] = [1, 2, 3];
// 方法二：
let arr2: Array<string> = ['李白', '杜甫'];
let arr2: Array<number | string> = [1, '李白', '杜甫'];

// ts 中对数组进行了严格的限制
// 方法三：
// 当需要数组存储不同类型值时，使用元组方式定义数组
// 特点：声明时指定长度、对应位置的类型必须相同
// 【元组类型】
let arr3: [string, number, boolean] = ['string', 123, true];

// 方法四：不推荐
let arr4: Array<any> = [];

// 【对象】
// 不指定成员以及类型，后续无法赋值
let obj: { x: number, y: number } = { x: 1, y: 2 }
obj.x = 4

// 【枚举类型】
// 方法一：设置枚举值
enum Gender {
  Boy = 1,
  Girl = 2,
  Unknown = 3
}

// 方法二：使用默认的枚举值 （0，1，2...）
enum Gender2 {
  Boy,
  Girl,
  Unknown
}

let userSex: Gender2 = Gender2.Boy;
console.log(userSex === Gender2.Boy) // true

// 【any、void、never】
let dom: any = document.getElementById('app'); // DOM类型很多，无法知道返回类型
function sayHello(name: string):void {         // 函数无返回值，使用 void
  console.log(`hi, my name is ${name}`);
}
// never 代表不存在的值的类型，常用作为抛出异常和无限循环的函数返回类型

```
**类型推断**

概念：如果变量的声明和初始化是在同一行，可以省略掉变量类型声明。
```ts
let num: number = 123;
// 简写
let num = 123; // ts 自动推断出类型，自动实现上面的写法
```
**联合类型**

给一个变量设置多个类型，类型之间是或的关系，只要满足其中一种类型，即可编译通过。
```ts
// 数字
let num: number | undefined;
// do somethings ...
num = 123;
// 当一个变量初始时没有值时，后续需要赋值时非常常用
```
## 函数类型
```ts
// 【函数返回值】string, number, boolean, Array<type>, void
// 方法一：
function fun(): string {
  return 'hello';
}

// 方法二：
let computed: (x: number, y: number) => number
computed = (add1, add2) => add1 + add2

// 【函数参数】参数也支持联合类型
function fun1(arg1: string | number, arg2: number): void {}

// 【函数默认值】设置默认值后这个参数就不能设置为可选参数（可选无效，有一个默认值，相当于一直有值）
function fun2(arg1: string = 'string', arg2: number = 2): void {}

// 【函数可选参数】
// 表示 arg2 参数可选
function fun3(arg1?: string, arg2?: number): void {}

// 【多个带默认值函数的调用】，前面使用默认值，后面传入实参
// 使用 undefined 占位
fun3(undefined, 2)

// 【剩余参数】
// 剩余参数只能是数组、剩余参数只能放在最后，剩余参数只能有一个
function fun4(arg1: number, arg2: number, ...args: Array<number>): void {}
```
## 类
```ts
class Person {
  // 成员变量
  name: string;
  gender: string;

  // 构造函数
  constructor(name: string, gender: string = '男') {
    this.name = name;
    this.gender = gender;
  }

  // 方法
  sayHello(): void {
    console.log(`hello everyone, my name is ${this.name}`)
  }
}

let p = new Person('张三')
p.sayHello()
```
## interface接口
**对象接口**

```ts
// 定义一个对象类型
interface List {
  readonly id: string; // 只读类型，不可重新赋值
  name: string;
  age?: number; // 可选属性
  [propName: string]: any; // 一个字符串索引签名
  [index: number]: any; // 一个数字索引签名
}
interface Result {
  data: List[]
}
```
**函数接口**
```ts
interface Add {
  (x: number, y: number): number
}

type Computed = (x: number, y: number) => number

let add: Add = (a, b) => a + b
let computed: Computed = (a, b) => a + b
```
**混合接口**
