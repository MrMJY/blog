### (1) 浏览器刷新，Vuex中的数据如何保持
使用web存储的方式：sessionStorage保存

不用localStorage的原因是，网页关闭不会清除Vuex数据，打开页面时需要清除。
```js
export default {
  name: 'App',
  created () {
    // 在页面加载时读取 sessionStorage 里的状态信息
    // 如果 session 内有值则说明是刷新，没有值说明第一次打开页面
    let sessionStore = sessionStorage.getItem("store")
    if (sessionStore) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse.sessionStore)))
        // 清空（如果有敏感信息的话）
        sessionStorage.clear()
    } 
    function saveStore () {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    }
    // 在页面刷新时将 vuex 里的信息保存到sessionStorage里
    // 监听刷新事件
    window.addEventListener("beforeunload", saveStore)
    // 销毁时移除事件监听
    this.$once('hook:destory', () => {
      window.removeEventListen('beforeunload', saveStore)
    })
  }
}
```

::: tip 注意
如果store中存有敏感信息，那么在读取恢复完store之后需要将sessionStorage中的数据清空
:::

### (2) Vuex的数据流向
Componet(组件) => **dispatch** => Action(异步操作) => **commit** => Mutation(修改store) => **mutate** => Store
![](https://vuex.vuejs.org/vuex.png)
