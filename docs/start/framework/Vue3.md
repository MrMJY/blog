## 3.x对比2.x的重要变更
### Performance
性能上，主要是优化了虚拟`DOM`，所以也就有了更加优化的编译，同时实现了更加高效的组件初始化。下面是尤大做客“前端会客厅”时给出的几个性能方面的提升。
+ Rewritten virtual dom implementation （重写了虚拟DOM）
+ Compiler-informed fast paths （优化编译）
+ More efficient component initialization （更高效的组件初始化）
+ 1.3-2x better update performance （1.3~2 倍的更新性能）
+ 2-3x faster SSR （2~3 倍的 SSR 速度）
### Tree-shaking
在之前的`vue`版本中，我们没有一个合适的办法用来除去不需要的功能，而`Vue3`中，为了满足体积更小的需求，支持 `Tree-shaking`，也就意味着我们可以按需求引用的内置的指令和方法。
+ Most optional features (e.g. `v-model`, `<transition>`) are now tree-shakable.<br>(大多数可选功能(如`v-model`、`<transition>`)现在都是支持`Tree-shaking`的。)
+ Bare-bone HelloWorld size: 13.5kb. 11.75kb with only Composition API support.<br>(`HelloWorld`大小：13.5kb。支持`Composition API`的仅11.75kb)
+ All runtime features included: 22.5kb. More features but still lighter than Vue 2.<br>(包括所有运行时功能：22.5kb。功能更多，但仍比`Vue2`轻)
### Composition API
Composition API 主要是提高了代码逻辑的可复用性，并且将 Reactivity 模块独立出来，这也使得 vue 3 变得更加灵活地与其他框架组合使用。
+ Usable alongside existing Options API(可与现有选项`API`一起使用)
+ Flexible logic composition and reuse(灵活的逻辑组成和重用)
+ Reactivity module can be used as a standalone library(`Reactivity`模块可以作为独立的库使用)
### Better TypeScript support
+ Codebase written in TS w/ auto-generated type definitions
+ API is the same in JS and TS(`API`在`JS`和`TS`中相同)
+ In fact, code will also be largely the same
+ TSX support(支持`TSX`)
+ Class component is still supported (vue-class-component@next is currently in alpha)(类组件仍然可用)
### Custom Renderer API
自定义`render`会提供一个`API`用来创建自定义的`render`，因此不再需要为了自定义一些功能而`fork Vue`的代码。这个特性给 `Weex`和`NativeScript Vue`这样的项目提供了很多便利。
+ NativeScript Vue integration underway by @rigor789
+ Users already experimenting w/ WebGL custom renderer that can be used alongside a normal Vue application (Vugel)
## Composition API
[Composition API手册](https://vue3js.cn/vue-composition-api/)
### setup()
+ `setup`函数是一个新的组件选项。作为在组件内使用`Composition API`的入口点。
+ `setup`函数可以与其他的组件选项一起使用，并且只执行一次。
+ 如果`setup`函数返回一个对象，则对象的属性、方法将会被合并到组件模板的渲染上下文，即可以在模板中使用。
+ 创建组件实例，然后初始化`props`，紧接着就调用`setup`函数。从生命周期钩子的视角来看，它会在`beforeCreate`钩子之前被调用。
```vue
<template>
  <div>{{ count }} {{ object.foo }}</div>
</template>

<script>
  import { defineComponent, ref, reactive } from 'vue'

  export default defineComponent({
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })

      // 暴露给模板
      return {
        count,
        object,
      }
    }
  })
</script>
```
注意`setup`返回的`ref`在模板中会自动解开，不需要写`.value`。
#### setup()的参数
该函数接收`props`作为其第一个参数，第二个参数提供了一个上下文对象，从原来`2.x`中`this`选择性地暴露了一些`property`。
```vue
<script>
  import { defineComponent, watchEffect } from 'vue'
  export default defineComponent({
    props: {
      name: String,
    },
    setup(props, ctx) {
      console.log(props.name)
      console.log(ctx.attrs)
      console.log(ctx.slots)
      console.log(ctx.emit)
      // 监听props
      watchEffect(() => {
        console.log(`name is: ` + props.name)
      })
    }
  })
</script>
```
+ `props`对象是响应式的，`watchEffect`或`watch`会观察和响应`props`的更新。**不要解构**`props`对象，那样会使其失去响应性。
+ 上下文对象选择性的暴露了`attrs`、`slots`、`emit`。`attrs`和`slots`都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。所以可以解构，无需担心后面访问到过期的值。
+ `this`在`setup()`中**不可用**。
:::tip 提示
为了获得传递给`setup()`参数的类型推断，需要使用`defineComponent`。
:::

#### 个人理解
用于复杂的组件，功能特别多，将某一功能的数据定义、逻辑封装抽离为一个模块，使组件干净，模块化。(解决了以前`data`定义数据，`methos`定义逻辑，数据逻辑相分离，要上下翻页查找，跳来跳去的问题)，其实`mixins`也可以实现类似功能。
### ref
接受一个参数值并返回一个响应式且可改变的`ref`**对象**。`ref`对象拥有一个指向内部值的单一属性`.value`。如果传入`ref`的是一个对象，将调用`reactive`方法进行深层响应转换。
```ts
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
console.log(count) // { value: 1 }

const list = ref([])
console.log(list) // { value: [] }

// ref作为reactive的property
const state = reactive({
  count
})
console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1

// 新ref替换旧的ref
const otherCount = ref(2)
state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```
#### 注意：
+ 当`ref`作为渲染上下文的属性返回(即在`setup()`返回的对象中)并在模板中使用时，它会自动解套，无需在模板内额外书写`.value`。
+ 当`ref`作为`reactive`对象的`property`被访问或修改时，也将自动解套`value`值。
+ 将一个新的`ref`分配给现有的`ref`，将替换旧的`ref`。
### reactive
接收一个普通对象然后返回该普通对象的响应式代理。等同于`2.x`的`Vue.observable()`。响应式转换是“深层的”：会影响对象内部所有嵌套的属性。基于`ES2015`的`Proxy`实现，返回的代理对象**不等于**原始对象。建议**仅使用代理对象**而避免依赖原始对象。
```ts
const obj = reactive({ count: 0 })
console.log(obj.count) // 0
```
:::tip 注意
只有代理对象是响应式的，原始对象不具有响应式功能。
:::
## Vue3与Vue2响应式的区别
### Vue2的响应式
+ 核心：
  + 对象：通过`Object.defineProperty()`对对象的已有属性值的读取和修改进行劫持(监听/拦截)
  + 数组：通过重写`data`中数组的原型链，指向了自己定义的数组原型方法，进行数据劫持
+ 问题：
  + 对象直接新添加的属性或删除已有属性，不会触发页面更新。
  + 通过下标的方式更改数组元素的值或更新`length`，不会触发页面更新。
### Vue3的响应式
+ 核心：
  + 通过[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)(捕获)：捕获对`data`的任意属性的任意操作（13种操作，包括：读写、添加、删除等）
  + 通过[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)(操作)：动态对被代理对象进行特定的操作
+ 优点：
  + 通过`Proxy`可以获得更有性能的代理效果，不必递归调用`Object.defineProperty()`设置`set`、`get`。
  + 对于对象新增新属性或删除已有属性等操作，都可以监听到，从而触发视图的更新。
  + 不必重写数组原型链，就可以解决通过下标修改数组元素值不响应、改变数组长度不响应的问题。
```js
const wife = {
  name: '雏田',
  age: 17,
  gender: '女'
}
const proxyWife = new Proxy(wife, {
   // 获取已有属性的值
  get(target, property) {
    console.log('触发get方法')
    return Reflect.get(target, property)
  },
  // 更新已有属性值、添加新的属性值
  set(target, property, value) {
    console.log('触发set方法')
    return Reflect.set(target, property, value)
  },
  // delete操作
  deleteProperty(target, prop) {
    console.log('触发deleteProperty方法')
    return Reflect.deleteProperty(target, prop)
  }
})
// 目标对象
const user = {
  name: '鸣人',
  age: 18,
  gender: '男',
  wife: proxyWife
}
// 劫持目标对象
const proxyUser = new Proxy(user, {
  // 获取已有属性的值
  get(target, property) {
    console.log('触发get方法')
    return Reflect.get(target, property)
  },
  // 更新已有属性值、添加新的属性值
  set(target, property, value) {
    console.log('触发set方法')
    return Reflect.set(target, property, value)
  },
  // delete操作
  deleteProperty(target, prop) {
    console.log('触发deleteProperty方法')
    return Reflect.deleteProperty(target, prop)
  }
})

console.log(proxyUser, user)
proxyUser.son = "博人" // 新增属性
console.log(proxyUser, user)
proxyUser.wife.name = "小樱" // 深度监听
console.log(proxyUser, user)
delete proxyUser.wife.age // 删除属性
console.log(proxyUser, user)
```