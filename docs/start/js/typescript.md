## 安装
+ 使用 `npm install -g typescript`，全局安装
+ 使用 `yarn global add typescript`，全局安装

## 编译ts文件
`tsc ./index.ts`
## 类型注解
### 基础类型
**布尔值**

`let isDone: boolean = false;`

**数字**

```ts
let decLiteral: number = 6;         // 十进制
let hexLiteral: number = 0xf00d;    // 十六进制
let binaryLiteral: number = 0b1010; // 二进制
let octalLiteral: number = 0o744;   // 八进制
```

**字符串**

```ts
let name: string = "bob";
name = "smith";

// 可以使用模版字符串，它可以定义多行文本和内嵌表达式
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

**数组**

```ts
// 有两种方式可以定义数组
// 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组
let list: number[] = [1, 2, 3];

// 第二种方式是使用数组泛型，Array<元素类型>
let list: Array<number> = [1, 2, 3];
```

**元组 Tuple**

元组类型允许表示一个**已知**元素数量和类型的数组，各元素的类型不必相同。
```ts
// 定义一个元组
let x: [string, number];
x = ['hello', 10]; // OK
x = [10, 'hello']; // Error

// 当访问一个已知索引的元素，会得到正确的类型
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'

// 当访问一个越界的元素，会使用联合类型替代
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```

**枚举**

`enum`类型是对`JavaScript`标准数据类型的一个补充。 像`C#`等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。
```ts
enum Color { Red, Green, Blue }
let c: Color = Color.Green;

// 1. 数字枚举
// 默认情况下，从0开始为元素编号，值递增。你也可以手动的指定成员的数值。
enum Color { Red = 1, Green, Blue }
let c: Color = Color.Green;

// 2. 字符串枚举
// 可以手动指定成员的值为字符串
enum Color { Red = "red", Green = "green" }
let red: Color = Color.Red;

// 全部都采用手动赋值
enum Color { Red = 1, Green = 2, Blue = 4 }
let c: Color = Color.Green;

// 根据值获得名称
enum Color { Red = 1, Green, Blue }
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2

// 3. 常量枚举
// 是使⽤ const 关键字修饰的枚举，不会为枚举类型编译⽣成任何JavaScript
const enum Direction {
 NORTH,
 SOUTH,
 EAST,
 WEST,
}
let dir: Direction = Direction.NORTH;
// 以上代码对应的 ES5 代码如下：
"use strict";
var dir = 0 /* NORTH */;
```
**有静态方法的枚举**

可以使用`enum + namespace`的声明的方式向枚举类型添加静态方法。
```ts
enum Weekday {
  Monday,
  Tuseday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

namespace Weekday {
  export function isBusinessDay(day: Weekday) {
    switch (day) {
      case Weekday.Saturday:
      case Weekday.Sunday:
        return false;
      default:
        return true;
    }
  }
}

const mon = Weekday.Monday;
const sun = Weekday.Sunday;

console.log(Weekday.isBusinessDay(mon)); // true
console.log(Weekday.isBusinessDay(sun));
```
::: tip 特性
① 默认情况下，从0开始为元素赋值，或者根据最后一个手动赋值的值，依次递增值<br>
② 根据值获得枚举的名称
:::

**object**

`object`表示非原始类型，也就是除`number`、`string`、`boolean`之外的类型。
```ts
function getObj(obj: object): object {
  console.log(obj);
  return {
    name: '卡卡西',
    age: 18
  }
}
console.log(getObj({}));
// 正确的，只会校验参数是否是object，如果要校验对象中的属性，则需要使用接口
```

**Any**

有时候，我们会想要为那些在**编程阶段还不清楚**类型的变量指定一个类型。这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any类型来标记这些变量。
```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```
::: tip 提示
默认情况下，只有类型相同的两个值，才可以有赋值操作。`any`类型则可以赋值任何类型。
:::

**Void**

表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是`void`，void类型的变量没有什么大用，因为你只能为它赋予`undefined`和`null`。
```ts
function warnUser(): void {
  console.log("This is my warning message");
}
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

**交叉类型**

在`JavaScript`中，`extend`是一种非常常见的模式，在这种模式中，你可以从两个对象中创建一个新对象，新对象会拥有着两个对象所有的功能。交叉类型(`&`)可以让你安全的使用此种模式:
```ts
function extend<T, U>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: 'hello' }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

**类型别名**

`TypeScript`提供使用类型注解的便捷语法，你可以使用`type SomeName = someValidTypeAnnotation`的语法来创建别名，在联合类型和交叉类型中比较实用：
```ts
type StrOrNum = string | number;
// 使用
let sample: StrOrNum;
sample = 123;
sample = '123';
// 会检查类型
sample = true; // Error

// 例子
type Text = string | { text: string };
type Coordinates = [number, number];
type Callback = (data: string) => void;
```
:::tip
+ 如果你需要使用类型注解的层次结构，请使用接口。它能使用`implements`和`extends`。
+ 为一个简单的对象类型（像例子中的`Coordinates`）使用类型别名，仅仅有一个语义化的作用。与此相似，当你想给一个联合类型和交叉类型使用一个语意化的名称时，一个类型别名将会是一个好的选择。
:::

**类型推断**

如果变量变量没有明确指定类型，编译器会自动推断出一个类型。
```ts
let num: number = 123;
// 简写
let num = 123; // ts 自动推断出类型，自动实现上面的写法
```

### 补充
```ts
// 【Symbol】
let sym: symbol = Symbol()
let sym1 = Symbol()
console.log(sym === sym1) // false

// 【underfined 和 null】
let underfin: undefined;  // 声明变量但是未赋值
let empt: null = null;
// 设置了类型为 undefined 或 null 之后无法再赋值为其他类型

// 【any、void、never】
let dom: any = document.getElementById('app'); // DOM类型很多，无法知道返回类型
function sayHello(name: string):void {         // 函数无返回值，使用 void
  console.log(`hi, my name is ${name}`);
}
// never 代表不存在的值的类型，常用作为抛出异常和无限循环的函数返回类型
```

## 接口
TypeScript的核心原则之一是对值所具有的**结构**进行类型检查。我的理解就是对某种数据结构进行定义。
### 属性类型接口
```ts
// 枚举：表示性别
enum Gender { man, women }
// 枚举：表示婚配情况
enum Marry { unmarried, married }
// 定义了一个学生的接口（数据结构）
interface Student {
  name: string;
  gender: Gender;
  school: string;
  profession: string;
  marry: Marry;
}
// 定义一个方法，传入的参数，类型为一种Student结构
function CreateStudent(student: Student) {
  return student
}

let stu = CreateStudent({
  name: 'zs',
  gender: 1,
  school: '野鸡大学',
  profession: '搬砖',
  marry: 0
})

console.log(stu)
```
::: tip 提示
`interface`中定义的属性是必需的，如果没有则会报错。如果有没有定义的字段，并不会报错。可以与`object`类型进行对比比较。
:::
#### 可选属性
接口里的属性不全都是必需的。带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个`?`符号
```ts
interface Student {
  name: string;
  gender: Gender;
  school: string;
  profession: string;
  marry: Marry;
  hasCar?: boolean;
  hasHourse?: boolean;
}
```
可选属性的好处:
+ 可以对可能存在的属性进行预定义
+ 可以捕获引用了不存在的属性时的错误

#### 只读属性
一些对象属性只能在对象刚刚创建的时候修改其值。你可以在属性名前用`readonly`来指定只读属性
```ts
interface Student {
  name: string;
  readonly gender: Gender;
  school: string;
  profession: string;
  marry: Marry;
  hasCar?: boolean;
  hasHourse?: boolean;
}
```
#### 额外的属性
一个类型能够包含索引签名，以明确表明可以使用额外的属性
```ts
interface Student {
  name: string;
  readonly gender: Gender;
  school: string;
  profession: string;
  marry: Marry;
  hasCar?: boolean;
  hasHourse?: boolean;
  [key: string]: any; // 额外的属性
}
```
> `TypeScript`具有`ReadonlyArray<T>`类型，它与`Array<T>`相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改，但是你可以用类型断言重写。
### 函数类型接口
除了描述带有属性的普通对象外，接口也可以描述函数类型。它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。
```ts
interface CreateStudent {
  (student: Student): Student;
}

let CreateStudent: CreateStudent = function(stu: Student) {
  return stu
}
```
> ① 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。<br>
  ② 函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。如果你不想指定类型，`TypeScript`的类型系统会推断出参数类型
### 可索引类型接口
我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。`TypeScript`支持两种索引签名：**字符串**和**数字**。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。
```ts
// 数字索引，描述的是数组
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];
let myStr: string = myArray[0];

// 字符串索引，描述的是对象
interface UserObj {
  [index: string]: string;
}
let user: UserObj = { name: '张三', work: '搬砖的' }
```
### 类类型接口
`TypeScript`也能够用它来明确的强制一个类去符合某种契约(规范、行为)。通过`implements`关键字将接口应用到类上。一个类也可以实现多个接口，多个接口用`,`进行分割。
```ts
// 定义类类型接口
interface Animal {
  name: string;      // 属性成员
  eat(food: string): void;  // 方法成员
}
// 应用类类型接口
// 实现多个接口(同时实现Animal和Dog两个接口)
// class Animal implements Animal, Dog
class Animal implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  eat(food: string) {
    console.log(this.name + food)
  }
}

const dog = new Animal('二哈')
dog.eat('狗粮')
```
### 可实例化接口
可实例化（构造函数接口）仅仅是可调用的一种特殊情况，它使用`new`做为前缀。它意味着你需用使用`new`关键字去调用它：
```ts
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo();  // bar 被推断为 string 类型
```

### 继承接口
和类一样，接口也可以相互继承。这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。可以继承多个接口，用`,`分割。
```ts
interface ProgrammerOpt {
  name: string;
  address: string;
  is996: boolean;
}
// 基类接口
interface Animal {
  name: string;
  eat(food: string): void;
}
// 子类接口
interface Person extends Animal {
  address: string;
  work(work: string): number;
}
// 子类接口
interface Programmer extends Person {
  is996: boolean;
  codding(code: string): void;
}
// 实现
class Animal implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  eat(food: string) {
    console.log(this.name + '喜欢吃' + food);
  }
}
class Person extends Animal implements Person {
  address: string;
  constructor(info: ProgrammerOpt) {
    super(info.name)
    this.address = info.address;
  }
  work(work: string): number {
    console.log(this.name + '在' + work + '工作')
    return 11000
  }
}
class Programmer extends Person implements Programmer {
  is996: boolean;
  constructor(info: ProgrammerOpt) {
    super(info)
    this.is996 = info.is996;
  }
  codding(code: string): void {
    console.log(this.name + '正在写' + code);
  };
}
const p = new Programmer({
  name: '张三',
  address: '北京市',
  is996: true
})
p.eat('苹果');
p.work('圆明园');
p.codding('ts代码');
```
## 函数
和JavaScript一样，TypeScript函数可以创建有名字的函数和匿名函数。
### 函数类型
**参数、返回值注释**
```ts
function add(x: number, y: number): number {
  return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };
```
> 我们可以给每个**参数**添加类型之后再为函数本身添加**返回值**类型。`TypeScript`能够根据返回语句自动推断出返回值类型，因此我们通常省略它。
**完整函数类型**
```ts
let myAdd: (x: number, y: number) => number = function(x: number, y: number): number { return x + y; };
// (x: number, y: number) => number 完整的函数类型（此处的“=>”不是箭头函数）
// “=>”之前的是参数列表类型，之后的是返回值类型
// 后面的“=”才是赋值操作

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number = function(x, y) { return x + y; };
```
函数类型包含两部分：参数类型和返回值类型。当写出完整函数类型的时候，这两部分都是需要的。只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正确。
> 使用完整类型时，后面的赋值函数，可以不写类型，`TypeScript`编译器会自动识别出类型，这叫做“按上下文归类”，是类型推论的一种。
### 可选参数和默认参数
> TypeScript里的每个函数参数都是必须的。这不是指不能传递null或undefined作为参数，而是说编译器检查用户是否为每个参数都传入了值。简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。

> JavaScript里，每个参数都是可选的，可传可不传。没传参的时候，它的值就是undefined。

在`TypeScript`里我们可以在参数名后面使用`?`实现可选参数的功能。**如果可选参数在前，不想传递参数时用`undefined`占位**
```ts
function buildName(firstName: string, lastName?: string) {
  if (lastName)
    return firstName + " " + lastName;
  else
    return firstName;
}
```
在`TypeScript`里，我们也可以为参数提供一个**默认值当用户没有传递这个参数或传递的值是undefined时**。
```ts
function buildName(firstName: string, lastName?: string = "Smith") {
  return firstName + " " + lastName;
}
```
> 与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面。如果带默认值的参数出现在必须参数前面，用户必须明确的传入`undefined`值来获得默认值。
### 剩余参数
有时，你想同时操作多个参数，或者你并不知道会有多少参数传递进来。在`JavaScript`里，你可以使用`arguments`来访问所有传入的参数。在`TypeScript`里，你可以把所有参数收集到一个变量里。剩余参数会被当做个数不限的可选参数。可以一个都没有，同样也可以有任意个。编译器创建参数数组，名字是你在省略号（`...`）后面给定的名字，你可以在函数体内使用这个数组。
```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```
### 重载
JavaScript本身是个动态语言。JavaScript里函数根据传入不同的参数而返回不同类型的数据是很常见的。`TypeScript`为**同一个函数提供多个函数类型定义**来进行函数重载。编译器会根据这个列表去处理函数的调用。
```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```
## 类型断言

类型断言是告诉编译器这个变量的明确类型，“相信我，我知道我在做什么”。可以理解为其它语言的类型转换，但是不进行特殊的数据和结构转换，它没有运行时影响，只在编译阶段起作用。
```ts
interface Foo {
  bar: number;
  bas: string;
}
// 因为 foo 的类型推断为 {} ，即是具有零属性的对象。因此，你不能在它的属性上添加 bar 或 bas ，你可以通过类型断言来避免此问题
const foo = {} as Foo;
// const foo = <Foo>{};
foo.bar = 123;
foo.bas = 'hello';
```
::: warning 注意
当你在TypeScript里使用JSX时，因为`<string>`语法与JSX在语法上有冲突，只有`as`语法断言是被允许的。为了一致性，我们建议你使用`as`的语法
:::
## 操作符
### `typeof`
`typeof`是获取一个**对象/实例**的类型，`typeof`只能用在具体的对象上，这与`js`中的`typeof`是一致的，并且它会根据左侧值自动决定应该执行哪种行为。如下：
```ts
type Person = {
  name: string;
  age: number | undefined;
}
const me: Person = { name: 'gzx', age: 16 }; // 定义变量并指定类型
type P = typeof me;  // 获取变量的类型 { name: string, age: number | undefined }
const you: typeof me = { name: 'mabaoguo', age: 69 };  // 可以通过编译

// 根据左侧判断出是 js 中的执行方式
const typestr = typeof me;   // typestr 的值为 "object"
```

### `keyof`
`keyof`可以获取一个**类型所有键值**，返回一个**联合类型**，如下：
```ts
type Person = {
  name: string;
  age: number;
}
type PersonKey = keyof Person;  // PersonKey 得到的类型为 'name' | 'age'

// 限制访问对象的 key 合法化
function getValue (p: Person, k: keyof Person) {
  return p[k];  // 如果 k 不如此定义，则无法以 p[k] 的代码格式通过编译
}
```
### `in`
`in`只能用在类型的定义中，对**枚举类型**进行遍历，`keyof`返回泛型`T`的所有键枚举类型，`key`是自定义的任何变量名，中间用`in`链接，外围用`[]`包裹起来(这个是固定搭配)，冒号右侧`number`将所有的`key`定义为`number`类型。如下：
```ts
type Person = {
  name: string;
  age: number;
}
// 这个类型可以将任何类型的键值转化成number类型
type TypeToNumber<T> = {
  [key in keyof T]: number;
}

const obj: TypeToNumber<Person> = { name: 10, age: 10 }
```

## 类
### 基本使用
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
注意：我们在引用任何一个类成员的时候都用了`this`，它表示我们访问的是类的成员。
### 使用extends、super()实现继承
在`TypeScript`里，我们可以使用常用的面向对象模式。基于类的程序设计中一种最基本的模式是允许使用**继承**来扩展现有的类。
```ts
class Animal {
  name: string;
  constructor(theName: string) { this.name = theName; }
  move(distanceInMeters: number = 0) {
      console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 5) {
      console.log("Slithering...");
      super.move(distanceInMeters);
  }
}

class Horse extends Animal {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 45) {
      console.log("Galloping...");
      super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```
> 这里，`Dog`是一个*派生类*，它通过`extends`关键字派生自`Animal`*基类*。派生类通常被称作**子类**，基类通常被称作**超类**。

上述例子中子类包含了一个构造函数，它必须在构造函数里访问`this`的属性之前调用`super()`，它会执行基类的构造函数。这个是TypeScript强制执行的一条重要规则。

这个例子演示了如何在子类里可以重写父类的方法。`Snake`类和`Horse`类都创建了`move`方法，它们重写了从`Animal`继承来的 `move`方法，使得`move`方法根据不同的类而具有不同的功能。
### public、private、protected修饰符
**public修饰符**

`public`指定类的成员是可见的，在`TypeScript`里，成员都**默认为`public`**。你也可以明确的将一个成员标记成`public`。

**`public`在类内部、子类内部、类外部都可以访问。**
```ts
class Animal {
  public name: string;
  public constructor(theName: string) { this.name = theName; }
  public move(distanceInMeters: number) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```
**protected修饰符**

`protected`修饰的成员在当前类、子类中仍然可以访问，在类、子类外部无法访问。
```ts
class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Student {
  private department: string;
  constructor(name: string, department: string) {
    super(name)
    this.department = department;
  }
  getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let stu = new Student('张三', '阿里巴巴')
console.log(stu.getElevatorPitch());
console.log(stu.name); // 错误
```
+ 我们可以在`Person`类内部、`Student`子类内部访问`name`，但是无法在外部访问。
+ 构造函数也可以被标记成`protected`，这意味着这个类不能在包含它的类外被实例化，但是能被继承。

**private修饰符**

`private`修饰的成员只能在当前类中可以访问。
```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  call() {
    console.log(`${this.name} is call`);
  }
}

let erha = new Dog('哈士奇');
erha.call(); // 错误
```
### 静态属性static
静态成员，这些属性存在于类本身上面而不是类的实例上。
```ts
class Vue {
  static version: string = 'v3.0'
  static use() {
    if (Vue.version == 'v3.0') {
      // ...
    } else {
      // ...
    }
  }
}
```
### 存取器
支持通过`getters/setters`来拦截对对象的访问，有效的帮助你对对象进行操作。
```ts
class Person {
  firstName: string;
  lastName: string;
  get fullName() {
    return this.firstName + '·' + this.lastName
  }
  set fullName(fullName: string) {
    let strs = fullName.split('·')
    this.firstName = strs[0]
    this.lastName = strs[1]
  }
}
const p = new Person()
p.fullName = '托尼·史塔克'
console.log(p.fullName)
```
### 抽象类abstract
包含抽象方法（一般没有任何的具体内容），也可以有实例方法和属性，但是不能被实例化，是作为子类的一种规范、约束的类。
```ts
abstract class Animal {
  // 定义两个抽象方法，没有具体内容
  abstract eat() {}
  abstract eat() {}
}
// 继承抽象类
class Dog extends Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  // 子类中必须实现抽象类中的抽象方法
  eat(food: string) {
    console.log(`${this.name}爱吃${food}`)
  }
  run(distance: number) {
    console.log(`${this.name}跑了${distance}米`)
  }
}
// new Animal() 报错
const dog = new Dog('二哈')
dog.eat('狗粮')
dog.run(10)
```
## 泛型
软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。
> 在定义函数、接口、类的时候不能预先确定要使用的数据的类型，而是在使用函数、接口、类的时候才能确定数据的类型
### 什么是泛型
> 思考：如果有一个函数，函数会返回任何传入它的值，该怎么办呢？
```ts
function identity(arg: number): number {
  return arg;
}
// 或者
function identity(arg: any): any {
  return arg;
}
```
> 使用`any`类型会导致这个函数可以接收任何类型的`arg`参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。

这时候我们就需要使用**类型变量**`<T>`了，它是一种特殊的变量，只用于表示**类型**而不是值。它代表一种类型，可以在内部应用这种类型。
```ts
function identity<T>(arg: T): T {
  return arg;
}
```
`T`帮助我们捕获用户传入的类型(比如：`number`)，之后我们就可以使用这个类型。之后我们再次使用了`T`当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。这允许我们跟踪函数里使用的类型的信息。

我们把这个版本的`identity`函数叫做**泛型**，因为它可以适用于多个类型。不同于使用`any`，它不会丢失类型信息。

我们定义了泛型函数后，可以用两种方法使用。
```ts
// 第一种是，传入所有的参数，包含类型参数
// 明确的指定了T是string类型，并做为一个参数传给函数，使用了 <> 括起来而不是()
let output = identity<string>("myString");  // type of output will be 'string'
// 现在T就代表了string类型

// 第二种方法更普遍。利用了类型推论(即编译器会根据传入的参数自动地帮助我们确定T的类型)
let output = identity("myString");  // type of output will be 'string'
// 注意我们没必要使用尖括号（<>）来明确地传入类型，编译器可以查看myString的值，然后把T设置为它的类型。
```
::: tip 注意：
① `T`泛型变量，是一个变量，不是固定的都是`T`，你也可以使用别的字母代替，如`I`、`i`、`U`等。<br>
② `<T>`是定义（带尖括号），`T`是使用（不带尖括号）。<br>
③ 可以有多个泛型变量。
:::
### 泛型函数
编译器要求你在函数体必须正确的使用这个通用的类型。换句话说，你必须把这些参数当做是任意或所有类型。
```ts
// 错误的使用泛型变量
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);  // Error: T doesn't have .length
  return arg;
}
loggingIdentity(123);
// 数字是没有.length属性的，所以会报错

// 正确的使用
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
loggingIdentity([1, 2, 3]);
// 这要求我们传入的参数必须是数字类型的数组，这样取.length属性时就不会报错了
// 编译器会利用类型推断，判断出T的类型，如果强制填写类型，则会校验参数类型
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
loggingIdentity<string>([1, 2, 3]); // 会报错，提示你的参数类型错误，数组应该是字符串类型，而你使用了数字类型
```
### 泛型类
```ts
// 使用<T>定义泛型接口
interface AnimalInfo<T> {
  name: T;
}
// 使用<T>定义泛型类
class Animal<T> {
  name: T;
  constructor(info: AnimalInfo<T>) {
    this.name = info.name;
  }
  eat(food: T) {
    console.log(this.name + '爱吃' + food)
  }
  run<T>(meter: T) {
    console.log(this.name + '跑了' + meter + '米')
  }
}
// 指定泛型变量为string类型
let dog = new Animal<string>({ name: '二哈' })
dog.eat('沙发');
dog.run<number>(10);
```
#### 类作为参数类型的泛型类
```ts
interface DBI<T> {
  add(info: T): boolean;
  update(info: T, id: number): boolean;
  get(id: number): any[]
}
// User类
class User {
  username: string | undefined;
  password: string | undefined;
}
// MysqlDB类，泛型类
class MysqlDB<T> implements DBI<T> {
  list: any[] = [];
  add(user: T) {
    console.log(user)
    this.list.push(user)
    return true
  }
  update(info: T, id: number) {
    this.list[id] = info
    return true
  }
  get(id: number) {
    return [this.list[id]]
  }
}
let user = new User()
user.username = 'zs';
user.password = 'admin';
let DB = new MysqlDB<User>();
DB.add(user);
// DB.add({ username: 'ZS', password: '123' }); // 也是不报错的
```
### 泛型约束
有的时候，我们可以不用关注泛型具体的类型，但是有时候，我们需要限定类型，这时候使用`extends`关键字即可:
```ts
// 不约束泛型
function getLength<T> (arg: T) {
  console.log(arg.length); // 会报错，提示 T 上不存在属性 length
  return arg;
}

getLength<string>('22');

// 约束泛型
// 定义一个约束类型
type LengthType = { length: string }
function getLength<T extends LengthType> (arg: T) {
  console.log(arg.length); 
  return arg;
}

getLength('22'); // pass T被约束为必须具备length属性
getLength(true); // error true不具备length属性，所以报错
```
同样的，我们有时候会访问一些自定义的属性，就像下面的代码
```ts
function getProprty<T, K> (obj: T, key: K) {
  return obj[key]; // error 类型K无法用于索引类T
}

const people = { name: 'xiaozhanng', age: 16 };
getProprty(people, 'name');
```
意思是，我们传入的泛型`K`代表的变量`key`，不一定是存在于泛型`T`的`obj`中的属性。这样就会让代码不够严谨，为解决这一问题，我们可以使用`keyof`，他可以拿到一个类型下所有的属性
```ts
function getProprty<T, K extends keyof T> (obj: T, key: K) {
  return obj[key]; // K被约束为T的属性
}
const people = { name: 'xiaozhanng', age: 16 };
getProprty(people, 'name');
```
### 泛型条件
`extends`其实也可以当做一个三元运算符，如下：
```ts
T extends U ? X: Y
```
这里便不限制`T`一定要是`U`的子类型，如果是`U`子类型，则将`T`定义为`X`类型，否则定义为`Y`类型。
### 泛型推断`infer`
`infer`的中文是“推断”的意思，一般是搭配上面的泛型条件语句使用的，所谓推断，就是你**不用预先指定在泛型列表中**，在运行时会自动判断，不过你得先预定义好整体的结构。举个例子
```ts
type Foo<T> = T extends { t: infer Test } ? Test: string
```
首选看`extends`后面的内容，`{ t: infer Test }`可以看成是一个包含`t`属性的类型定义，这个`t`属性的类型会通过`infer`进行推断后会赋值给`Test`类型，如果泛型`T`代表的实际参数符合`{ t: infer Test }`的定义那么返回的就是`Test`类型，否则默认返回缺省的`string`类型。

举个例子加深下理解：
```ts
type One = Foo<number>  // string，number 不在 { t: infer Test } 的约束范围内
type Two = Foo<{t: boolean}>  // boolean
// { t: boolean } extends { t: infer Test } ? Test : string 属性匹配成功，使用 infer 推断出 Test 为 boolean，返回 Test
type Three = Foo<{ a: number, t: () => void }> // () => void
// { a: number, t: () => void } extends { t: infer Test } ? Test : string 属性匹配成功，使用 infer 推断出 Test 为 () => void Test
```
`infer`用来对**满足的(符合约束的)**泛型类型进行**子类型的抽取(`infer`抽取符合约束的子类型)**，有很多高级的泛型工具也巧妙的使用了这个方法。

## 泛型工具
### `Partial<T>`
此工具的作用就是将泛型中全部属性变为可选的，每个属性的类型不变。
```ts
type Partial<T> = {
	[P in keyof T]?: T[P]
}
// 遍历泛型 T，将所有的属性变为可选的， T[P] 获得每个属性的类型

// 例子
type Animal = {
  name: string,
  category: string,
  age: number,
  eat: () => number
}
type PartOfAnimal = Partial<Animal>;
const ww: PartOfAnimal = { name: 'ww' }; // 属性全部可选后，可以只赋值部分属性了
```
### `Record<K, T>`
此工具的作用是将`K`中所有属性值转化为`T`类型，我们常用它来申明一个普通`object`对象。
```ts
// keyof any 对应的类型为 number | string | symbol
// 也就是可以做对象键(专业说法叫索引 index)的类型集合
type Record<K extends keyof any,T> = {
  [key in K]: T;
}

// 例子
const obj: Record<string, string> = { 'name': 'zhangsan', 'tag': '打工人' }
```
### `Pick<T, K>`
此工具的作用是将`T`类型中的`K`键列表提取出来，生成新的子键值对类型（交集）
```ts
// K 被约束为 T 的键的联合枚举，每个键的类型不变，交集
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}

// 例子
type Animal = {
  name: string;
  category: string;
  age: number;
  eat: () => number;
}

const bird: Pick<Animal, "name" | "age"> = { name: 'bird', age: 1 }
```
### `Exclude<T, U>`
此工具是在`T`类型中，去除`T`类型和`U`类型的交集，返回剩余的部分（差集）
```ts
// 类型 T 在 U 中，则返回 never 否则返回 T
type Exclude<T, U> = T extends U ? never : T

// 例子
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;   // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```
### `Omit<T, K>`
此工具可认为是适用于键值对对象的`Exclude`，它会去除类型`T`中包含`K`的键值对。
```ts
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
```
### `ReturnType<T>`
此工具就是获取`T`类型(函数)对应的返回值类型
```ts
// 泛型 T 被约束为函数类型
// 实现部分 T 被约束为函数类型，并且通过 infer 推断出返回值的类型并赋值给泛型 R，返回 R 或者 any
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// 例子
function foo(x: string | number): string | number { return 1 }
type FooType = ReturnType<typeof foo>;  // string | number
```
### `Required<T>`
此工具可以将类型`T`中所有的属性变为必选项
```ts
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```