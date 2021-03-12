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
  + 通过`Proxy`可以获得更有性能的代理效果，不必循环调用`Object.defineProperty()`设置`set`、`get`。
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
:::warning 注意
`Proxy`的捕获器不会作用于深层次。
:::
## Composition API
[Composition API手册](https://vue3js.cn/vue-composition-api/)
### setup()
+ `setup`函数是一个新的组件选项。作为在组件内使用`Composition API`的入口点。
+ `setup`函数可以与其他的组件选项一起使用，并且只执行一次。
+ 如果`setup`函数返回一个对象，则对象的属性、方法将会被合并到组件模板的渲染上下文，即可以在模板中使用。
+ 创建组件实例，然后初始化`props`，紧接着就调用`setup`函数。从生命周期钩子的视角来看，它会在`beforeCreate`钩子之前被调用。
+ 由于`setup`在`beforeCreate`之前调用，此时组件实例还没创建所有，`setup`中的`this`为`undefined`，因此也无法访问`data`、`computed`、`methods`。
+ 所有的`Composition API`都无法访问到正确的`this`。
+ `setup`不能是一个`async`函数，因为返回的`promise`对象，模板无法获得其中的数据。
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
+ `props`对象是响应式的，`watchEffect`或`watch`会观察和响应`props`的更新。**不要解构**`props`对象，那样会使其失去响应性。`props`接收的是父组件传入的并且子组件定义接收的。
+ 上下文对象选择性的暴露了`attrs`、`slots`、`emit`。`attrs`和`slots`都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。所以可以解构，无需担心后面访问到过期的值。
  + `attrs`包含所有父组件传入的`props`属性，包括子组件未定义接收的，相当于`$attrs`
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
### computed计算属性
关于计算属性的用法与`Vue2`基本相同，有两种使用方法。
#### 用法一：传入一个回调函数
当传入的是一个函数时，此函数会作为`getter`函数，返回一个默认**不可手动修改**的`ref`对象。不可修改意味着不能对这个计算属性赋值。
```ts
import { ref, computed } from 'vue'
export default () => {
  const firstName = ref(''), lastName = ref('')
  const fullName = computed(() => firstName.value + '·' + lastName.value)
  return {
    firstName,
    lastName,
    fullName
  }
}
```
#### 用法二：传入一个对象
传入一个拥有`get`和`set`函数的对象，创建一个可手动修改的计算状态。
```ts
import { ref, computed } from 'vue'
export default () => {
  const firstName = ref(''), lastName = ref('')
  const fullName = computed({
    get() {
      return firstName.value + '·' + lastName.value
    },
    set(fullName: string) {
      const names = fullName.split('·')
      firstName.value = names[0] || ''
      lastName.value = names[1] || ''
    }
  })
  return {
    firstName,
    lastName,
    fullName
  }
}
```
### readonly
传入一个对象（响应式或普通）或`ref`，返回一个原始对象的**只读**代理。一个只读的代理是“深层的”，对象内部任何嵌套的属性也都是只读的。
```ts
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 依赖追踪
  console.log(copy.count)
})

// original 上的修改会触发 copy 上的侦听
original.count++

// 无法修改 copy 并会被警告
copy.count++ // warning!
```
### watch
完全等效于`2.x`的`this.$watch`（以及`watch`选项）。`watch`需要侦听特定的数据源，并在回调函数中执行操作。返回一个停止侦听的函数`StopHandle`。默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调。
#### 侦听单个数据源
```ts
import { ref, watch } from 'vue'

export default () => {
  const personAge = ref(0)
  const options = {
    deep: true,     // 深度监听
    immediate: true // 立即监听，初始化之后立即执行一次回调
  }
  const stop = watch(personAge, (n, o, onInvalidate) => {
    // onInvalidate是一个函数用于清除回调中的副作用功能
    console.log(n, o)
  }, options)
  setTimeout(() => stop(), 5000) // 5s后停止侦听
  return {
    person,
    result
  }
}
```
:::tip 注意：
+ `watch`**默认**会在监听的数据源发生变化时，才会触发监听回调函数，即不会立刻触发一次。<br>
+ `watch`的回调函数支持三个参数，变化后的新值`value`，变化前的旧值`oldValue`，以及清除副作用的函数`onInvalidate`。
+ `watch`支持第三个参数，它是一个对象，可以有`deep`、`immediate`属性。<br>
+ `watch`监听的数据源是一个复杂数据（`reactive`），会触发监听回调，但是回调中新旧值是相同的。
+ 停止侦听的函数`StopHandle`会被链接到该组件的生命周期，并在组件卸载时自动停止。在一些情况下，也可以显式调用返回值以停止侦听。
+ 侦听的数据源如果不是响应式的数据，可以包装为一个拥有返回值的`getter`函数。
:::
#### 侦听多个数据源
`watch`的数据源也可以是使用数组包裹的多个源
```ts
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```
### watchEffect
`watch`与`watchEffect`的功能大部分一致，有几个特殊的区别：
+ 监听对象不同，`watch`监听数据源的变化，`watchEffect`监听的是回调中响应式数据的变化。
+ 参数不同，`watchEffect`有两个参数，第一个是`effect`函数参数，第二个是`options`配置对象，**没有**监听的数据源参数。
  + `options`具有三个可选项，`flush`、`onTrack`、`onTrigger`，细节查看[文档](https://vue3js.cn/vue-composition-api/#%E5%89%AF%E4%BD%9C%E7%94%A8%E5%88%B7%E6%96%B0%E6%97%B6%E6%9C%BA)
+ `watchEffect`**默认**会立即执行一次回调函数，相当于`watch`的配置对象`{ immediate: true }`。
+ `watchEffect`的回调函数的参数只有一个`onInvalidate`函数，没有新旧值。
```ts
import { reactive, ref, watchEffect } from 'vue'

export default () => {
  const fullName = reactive({
    firstName: '',
    lastName: ''
  })
  const result = ref('')
  // 收集回调函数中的响应式的数据，fullName、result
  watchEffect((clear) => {
    console.log('watchEffect', clear)
    const vs = result.value.split('·')
    fullName.firstName = vs[0] || ''
    fullName.lastName = vs[1] || ''
  })
  return {
    fullName,
    result
  }
}
```
### 生命周期钩子函数
可以使用直接导入的`onX`函数注册生命周期钩子，这些生命周期钩子注册函数只能在`setup()`期间同步使用，因为它们依赖于内部全局状态来定位当前活动实例(此时正在调用其`setup()`的组件实例)。在没有当前活动实例的情况下调用它们将导致错误。
```ts
import { onMounted, onUpdated, onUnmounted } from 'vue'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```
组件实例上下文也是在生命周期钩子的同步执行期间设置的，因此在生命周期钩子内同步创建的侦听器和计算属性也会在组件卸载时**自动删除**。
#### 与`2.x`版本生命周期相对应的组合式`API`
+ `beforeCreate` -> 推荐使用`setup()`
+ `created` -> 推荐使用`setup()`
+ `beforeMount` -> `onBeforeMount`
+ `mounted` -> `onMounted`
+ `beforeUpdate` -> `onBeforeUpdate`
+ `updated` -> `onUpdated`
+ ~~`beforeDestroy`~~ -> `onBeforeUnmount`
+ ~~`destroyed`~~ -> `onUnmounted`
+ `errorCaptured` -> `onErrorCaptured`
+ `onRenderTracked` <Badge text="New"/>调试
+ `onRenderTriggered` <Badge text="New"/>调试
:::tip 注意：
`Vue2`的`beforeDestroy`、`destroyed`两个选项生命周期钩子函数在`Vue3`中已经没有了，需使用`onBeforeUnmount`、`onUnmounted`组合`API`代替。其他的选项生命周期在`Vue3`中仍然可用，但是推荐使用组合`API`代替。
:::
### toRefs
把一个**响应式对象**转换成普通对象，该普通对象的每个`property`都是一个`ref`对象，并且和响应式对象的`property`一一对应。当想要从一个组合逻辑函数返回的响应式对象中使用解构/扩展（使用 ... 操作符）时，用`toRefs`是很有效的，使解构/扩展操作不丢失响应性。
```ts
// useFeatureX.ts 对 state 的逻辑操作
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  })
  // 返回时将属性都转为 ref
  return toRefs(state)
}
// page.vue
export default {
  setup() {
    // 可以解构，不会丢失响应性
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar,
      // ...useFeatureX() // 可以扩展，不会丢失响应性
    }
  },
}
```
### 模板Refs
当使用组合式`API`时，*reactive refs*和*template refs*的概念已经是统一的。为了获得对模板内元素或组件实例的引用，我们可以像往常一样在`setup()`中声明一个`ref`并返回它，它会暴露在渲染上下文中，并通过`ref="root"`绑定到`div`作为其`ref`。
```vue
<template>
  <div ref="root"></div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // 在渲染完成后, 这个 div DOM 会被赋值给 root ref 对象
        console.log(root.value) // <div/>
      })

      return {
        root
      }
    }
  }
</script>
```
### shallowRef
创建一个`ref`对象，将会追踪它的`.value`更改操作，但是并不会对变更后的`.value`做响应式代理转换（即变更不会调用 `reactive`）。
```ts
const foo = shallowRef({})
// 更改对操作会触发响应
foo.value = {}
// 但上面新赋的这个对象并不会变为响应式对象
isReactive(foo.value) // false
```
### shallowReactive
只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对“属性的属性”做深层次、递归地响应式代理，而只是保留原样。
```ts
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2,
  },
})

// 变更 state 的自有属性是响应式的
state.foo++
// ...但不会深层代理
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```
### shallowReadonly
只为某个对象的自有（第一层）属性创建浅层的**只读**响应式代理，同样也不会做深层次、递归地代理，深层次的属性并不是只读的。
```ts
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2,
  },
})

// 变更 state 的自有属性会失败
state.foo++
// ...但是嵌套的对象是可以变更的
isReadonly(state.nested) // false
state.nested.bar++ // 嵌套属性依然可修改
```
### markRaw
显式标记一个对象为“永远不会转为响应式代理”，函数返回这个对象本身。
```ts
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 如果被 markRaw 标记了，即使在响应式对象中作属性，也依然不是响应式的
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```
:::tip 注意：
+ 一些值的实际上的用法非常简单，并没有必要转为响应式，比如某个复杂的第三方类库的实例，或者`Vue`组件对象。
+ 当渲染一个元素数量庞大，但是数据是不可变的，跳过`Proxy`的转换可以带来性能提升。
:::
### toRaw
返回由`reactive`或`readonly`方法转换成响应式代理的普通对象。这是一个**还原方法**，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发更改。不建议一直持有原始对象的引用，请谨慎使用。
```ts
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```
### toRef
可以用来为源响应式对象上的某个`property`新创建一个`ref`。然后，`ref`可以被传递，它会保持对其源`property`的响应式连接。
```ts
const state = reactive({
  name: '佐助',
  wife: '小樱',
  child: '佐良娜'
})

const refValue = ref(state.wife)
const toRefValue = toRef(state, 'child')
const update = () => {
  state.name = '鸣人'
  refValue.value = '雏田'
  toRefValue.value = '博人'
}
```
:::tip 注意：
`ref`与`toRef`的区别就是，`toRef`会保留与原始响应对象的连接，二者中其一改变另一个也会改变，而`ref`不会。
:::