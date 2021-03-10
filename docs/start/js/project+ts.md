## Vue3 + TypeScript
### 通过Vue CLI创建一个项目
`vue create <project-name>`创建一个名为**vue-ts**的项目
> 务必保证`cli`的版本高于`4.5.x`，否则不会提示选择`vue3`，不使用模板项目，选择`typescript`。

::: tip 提示
Vue3提供了一个新的开发工具Vite，使用此工具初始化项目也是不错的。
:::

安装过程中会询问相关配置
```sh
// 是否使用类的形式编写组件？
? Use class-style component syntax? No
// 是否使用 Babel 编译 TypeScript?
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
// 是否将目前项目中全部的 .js 文件转换成 .ts 文件？
? Convert all .js files to .ts? Yes
// 是否编译构建时将 .ts 编译为 .js 文件？
? Allow .js files to be compiled? Yes
```
### 项目中使用
**入口文件**
```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
```
**声明文件**
```ts
// src/shims-vue.d.ts
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```
**路由文件**
```ts
// /src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```
**组件中**
```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
});
</script>
```