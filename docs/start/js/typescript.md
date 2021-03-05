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

// 默认情况下，从0开始为元素编号，值递增。你也可以手动的指定成员的数值。
enum Color { Red = 1, Green, Blue }
let c: Color = Color.Green;

// 全部都采用手动赋值
enum Color { Red = 1, Green = 2, Blue = 4 }
let c: Color = Color.Green;

// 根据值获得名称
enum Color { Red = 1, Green, Blue }
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
```
::: tip 特性
① 默认情况下，从0开始为元素赋值，或者根据最后一个手动赋值的值，依次递增值<br>
② 根据值获得枚举的名称
:::

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

// 【对象】
// 不指定成员以及类型，后续无法赋值
let obj: { x: number, y: number } = { x: 1, y: 2 }
obj.x = 4

// 【函数】
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

// 【any、void、never】
let dom: any = document.getElementById('app'); // DOM类型很多，无法知道返回类型
function sayHello(name: string):void {         // 函数无返回值，使用 void
  console.log(`hi, my name is ${name}`);
}
// never 代表不存在的值的类型，常用作为抛出异常和无限循环的函数返回类型
```

**类型断言**

类型断言好比强制的类型转换，但是不进行特殊的数据检查和解构。
```ts
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length; // 将someValue类型强制转换为string

// as语法
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```
::: warning 注意
当你在TypeScript里使用JSX时，只有 as语法断言是被允许的。
:::

**联合类型**

给一个变量设置多个类型，类型之间是或的关系，只要满足其中一种类型，即可编译通过。
```ts
// 数字
let num: number | undefined;
// do somethings ...
num = 123;
// 当一个变量初始时没有值时，后续需要赋值时非常常用
```

**类型推断**

概念：如果变量的声明和初始化是在同一行，可以省略掉变量类型声明。
```ts
let num: number = 123;
// 简写
let num = 123; // ts 自动推断出类型，自动实现上面的写法
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
  name: string,
  gender: Gender,
  school: string,
  profession: string,
  marry: Marry
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
`interface`中定义的属性是必需的，如果没有则会报错。如果有没有定义的字段，并不会报错。
:::
#### 可选属性
接口里的属性不全都是必需的。带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个`?`符号
```ts
interface Student {
  name: string,
  gender: Gender,
  school: string,
  profession: string,
  marry: Marry,
  hasCar?: boolean,
  hasHourse?: boolean
}
```
可选属性的好处:
+ 可以对可能存在的属性进行预定义
+ 可以捕获引用了不存在的属性时的错误

#### 只读属性
一些对象属性只能在对象刚刚创建的时候修改其值。你可以在属性名前用`readonly`来指定只读属性
```ts
interface Student {
  name: string,
  readonly gender: Gender,
  school: string,
  profession: string,
  marry: Marry,
  hasCar?: boolean,
  hasHourse?: boolean
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
`TypeScript`也能够用它来明确的强制一个类去符合某种契约(规范、行为)。通过`implements`关键字将接口应用到类上。
```ts
// 定义类类型接口
interface Animal {
  name: string;      // 属性成员
  eat(food: string): void;  // 方法成员
}
// 应用类类型接口
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
### 继承接口
和类一样，接口也可以相互继承。这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。
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
**基本函数类型**
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

在`TypeScript`里我们可以在参数名后面使用`?`实现可选参数的功能。**可选参数必须跟在必须参数后面。**
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
function buildName(firstName: string, lastName = "Smith") {
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
## 泛型
软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。
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
② `<T>`是定义（带尖括号），`T`是使用（不带尖括号）。
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