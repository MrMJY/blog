## 代码出现重大BUG如何快速回滚到上（某）一个版本？
### 方式一：将上一次稳定版本备份(时间最少)
如果出现问题，需要短时间（非常紧急）修复，可以直接回滚到上一个稳定版本。
### 方式二：git命令回滚代码，更新远程仓库
**打标签**

通过对重要节点打标签，对当前提交的引用，可以用来快速回滚代码，例如从`v1.0.1`回滚到`v1.0.0`或者更早的版本
```js
// 创建一个 v1.0.0 标签
git tag v1.0.0
// 查看所有标签
git tag -l
// 将标签推送到远程仓库
// git push origin <tagname>
git push origin v1.0.0
// 删除分支
git tag -d v1.0.0
```
**git命令回滚**
```js
// 回到之前的某次提交
git reset <commitId>
git reset v1.0.0
```
### 方式三：Jenkins一键回滚（备份）


## 以Element-UI组件库为例的项目换肤？
### 方式一：自定义主题，覆盖默认的主题
这种方式其实就是通过官方主题工具导出一个包含变量的scss文件`element-variables.scss`
### 方式二：自定义多套主题，通过切换，改变主题
这种方式跟第一种方式基本相同，只不过支持了多种主题而已。

通过页面操作，获取不同主题的样式文件，替换`header`标签中的`style`
```js
// 根据选择的不同主题加载不同的css样式实现换肤
const link = document.createElement('link')
link.setAttribute('type', 'text/css')
link.setAttribute('rel', 'stylesheet')
link.setAttribute('id', 'summer')
link.setAttribute('href', '/static/custom-themes/green/index.css')
document.head.appendChild(link)
```
### 方式三：使用颜色选择器，实时更换主题颜色
+ 通过请求获取默认的主题
+ 获取css内容字符串
+ 替换css内容字符串的主题颜色
```js
// 发送请求获取默认的CSS样式，并返回样式字符串
function getCSSString(url, styleId) {
  const oldStyle = document.getElementById(styleId)
  if (oldStyle) {
    return oldStyle.innerText
  }
  return axios.get(url).then(res => {
    // 去掉字体
    return Promise.resolve(res.replace(/@font-face{[^}]+}/, ''))
  })
}
// 使用正则表达式将匹配的样式修改(oldTheme、newTheme本质是一个颜色#2BF511)
// 将Element默认的样式中所以使用了相同颜色的地方替换
function updateStyle(cssString, oldTheme, newTheme) {
  cssString = cssString.replace(new RegExp(oldTheme, 'ig'), newTheme)
  return cssString
}
// 删掉旧的样式
function destoryStyle(styleId) {
  const node = document.getElementById(styleId)
  if (node) { node.parentElement.removeChild(node) }
}
// 追加新的样式并设置替换后的样式
function setStyle(id, newStyle) {
  let styleTag = document.getElementById(id)
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.setAttribute('id', id)
    document.head.appendChild(styleTag)
  }
  styleTag.innerText = newStyle
}

// 换肤
async customTheme(newVal, oldVal) {
  console.log(newVal, oldVal)
  if(!newVal) return
  let cssString = await themePick.getCSSString('https://unpkg.com/element-ui/lib/theme-chalk/index.css', oldVal)
  cssString = themePick.updateStyle(cssString, oldVal, newVal)
  themePick.setStyle(newVal, cssString)
  themePick.destoryStyle(oldVal)
}
```

## 前端如何进行权限控制？
本篇文章以Vue为例，思路是一样的。
### 权限管理基础
权限管理一般分以下3个基础概念：
+ 功能点：新增、查看、编辑、删除
+ 角色：老板、HR
+ 用户：张三、李四

它们之间的关系一句话就能说清楚：一个用户可以拥有多个角色，而一个角色可以包含多个功能。比如一个员工可以既有收银员的角色，也有库管员的角色。对于收银员这个角色，可以有开单收银、查看订单、查看会员信息等功能点。

此外还有2个概念：
+ 功能权限
+ 数据权限

它们之间的关系举例来说明：在一个连锁店的场景，某个门店的管理员具有**查看营收的功能权限**和**查看自己门店数据**的数据权限；高级管理员同样拥有**查看营收的功能权限**，并且有更高的数据权限，可以**查看所有门店数据**的权限。
### 前端权限控制
前端本质上只有1种权限类型：组件权限。对应上述的**功能权限**，对于数据权限更多的是后端来控制。为了更好的理解和管理，又将组件权限拆分为以下3类：
+ 菜单权限：能否看到进入页面的入口
+ 页面权限：能否进入页面
+ 组件权限：能否看到功能组件
#### 菜单权限
我目前经手的项目中主要遇到了两种：
+ 角色的菜单权限固定，不变的情况

这种情况下，基本上菜单的数据是由前端同学维护的（这个是后期添加的权限维护，对以前菜单加的功能），没有接口返回数据，功能权限是固定的，那么可以为每个菜单配置上可访问用户集合。在渲染菜单时通过与登录后获取的用户角色进行比较得出是否要渲染这个菜单，达到菜单权限的控制。
```js
meuns: [
  {
    name: '运营',
    icon: 'el-icon-edit',
    authority: [0, 2, 3, 4, 5, 6], // 可以访问的角色的集合
    children: [
      {
        name: '账号管理',
        path: '/content/platform',
        authority: [0]
      }
    ]
  },
  {
    name: '商品',
    icon: 'el-icon-s-tools',
    authority: [0, 1, 2, 3, 4, 5, 6],
    children: [
      {
        name: '创建管理',
        path: '/content/product',
        authority: [0, 1, 2, 3, 4, 5, 6]
      }
    ]
  }
]

// 判断是否显示
menu.authority.includes(userInfo.role)
```
+ 角色的菜单权限可配置的情况

一般是后端直接返回当前登录人可见的菜单，可以直接使用（或者格式化一下）。

> 到目前为止，针对于菜单的控制基本结束了，对进入没有权限的页面的入口进行了限制。

#### 页面权限
针对于页面权限，本质就是路由权限的控制，主要可以分为一下几种情况：
+ 全路由前端维护

> 存在一种情况，可能某一个业务功能菜单，使用多个路由，比如列表页，详情页等，这时对应的一个菜单下可能会有两个路由
`/workOrder/myWorkOrder`、`/workOrder/myWorkOrder/detail`
```js
const routes = [
  {
    path: '/workOrder/myWorkOrder',
    meta: { name: '我的工单' },
    name: 'MyWorkOrder',
    component: my_work_order
  },
  {
    path: '/workOrder/teamWorkOrder',
    meta: { name: '团队工单' },
    name: 'TeamWorkOrder',
    component: team_work_order
  },
  // ...
]
```
这种情况下，一般在登录后后端会返回对应的路由权限列表（或者菜单列表），在路由守卫中进行权限的校验

路由主要分**需要权限校验的路由**和**不需要权限校验的路由**两种，不需要权限校验的，主要包括404页面、登录页面以及一些默认的主页。
```js
// 不需要校验权限的路由
const noRequireAuth = ['/login', '/', '/404']
const requireAuth = [...]

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 没有用户信息，未登录状态
  if (!store.getters.userInfo && to.path !== '/login') {
    return next({ path: '/login', replace: true, query: { from: to.path }})
  // 未登录且去的是登录页，可以继续跳转
  } else if (!store.getters.userInfo && to.path == '/login') {
    return next()
  // 已登录且去的是登录页/404，跳转到首页
  } else if (store.getters.userInfo && (to.path == '/login' || to.path == '/404')) {
    return next('/')
  // 判断是否有权限跳转
  // 先判断是否是不需要校验的路由，然后再判断权限
  } else if (!noRequireAuth.includes(to.path) && !hasAuth(to.path)) {
    return next('/404')
  }
  next()
})
// 判断权限
function hasAuth(path) {
  if (/* 遍历或者递归后端返回的权限路由列表（菜单）进行匹配，如果没有匹配的，说明不具有这个权限 */) {
    return false
  } else {
    return true
  }
}
```
:::tip 注意
这只是一种实现方式，此方式也有一些问题，比如需要单独的进行权限判断，即菜单隐藏了，但是用户还是可以通过手输`url`的方式访问权限外的页面，这一点要注意，在路由守卫中进行判断。

如果没有权限，就没有对应的路由，那么路由跳转的时候匹配不到，自动跳转到404更好。省去了在路由守卫中进行权限的判断。
:::
+ 后端返回，动态生成路由（推荐）

此方式需要后端配合，所有的权限均由后端控制，登录后将菜单、路由返回前端，由前端同学动态生成路由，不需要在路由守卫中进行权限判断，因为后端已经判断了。
```js
import router from 'xxxx'
// 假设登录后，返回的菜单、路由数据结构如下
const menus = [
  {
    title: '工单管理',        // 菜单名称
    path: '/workOrder',      // 菜单路由
    icon: 'icon-workOrder',  // 菜单图标，也可以是链接，根据业务
    child: [
      {
        title: '我的工单',
        path: '/workOrder/myWorkOrder',
        routes: [ // 存放路由
          {
            path: '/workOrder/myWorkOrder',
            meta: { name: '我的工单' },
            name: 'MyWorkOrder',
            dir: '@/views/my-work-order/index.vue'
          }
        ],
        permission: [ // 存放按钮级别的选项
          { permission_id: 15, permission_name: "待接" },
          { permission_id: 17, permission_name: "待办" }
        ]
      },
      {
        title: '团队工单',
        path: '/workOrder/teamWorkOrder',
        routes: [ // 存放路由
          {
            path: '/workOrder/teamWorkOrder',
            meta: { name: '我的工单' },
            name: 'TeamWorkOrder',
            dir: '@/views/team-work-order/index.vue'
          }
        ],
        permission: [
          {permission_id: 16, permission_name: "受理中"},
          {permission_id: 18, permission_name: "已完成"},
          {permission_id: 19, permission_name: "撤回"}
        ]
      }
    ]
  }
]
function creatRoutes(menus, routes) {
  if (!menus.length) return []
  menus.forEach(menu => {
    if (menu.routes) {
      routes.push(...menu.routes.map(route => {
        const dir = route.dir
        route.component = () => import(dir)
        route.meta.permission = route.permission
        delete route.dir
        return route
      }))
    }
    if (menu.child) creatRoutes(menu.child, routes)
  })
  return routes
}

const routes = []
creatRoutes(menus, routes)
routes.forEach(route => router.addRoute('Home', route))
```
```js
// router
const router = new VueRouter({
  routes: [ // 默认的不需要权限的路由
    {
      path: '/',
      component: () => import('../components/framework/index.vue'),
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('../views/Home.vue')
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/framework/Login.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
```
#### 组件权限
组件权限可以通过自定义指令对控制其是否显示。
```js
import router from '@/router'

export function hasAuthority(value) {
  const allPermission = store.getters.permission
  if (!allPermission.length) return
  const { id } = allPermission.find(item => item.name == value)
  const permission = router.currentRoute.meta.permission
  return permission ? !!permission.find(i => i.permission_id == id) : false
}

// 当作用于简单的按钮元素时，可不指定参数，直接读取innerText
// 当作用于复杂嵌套的元素时，请指定指令参数
export default {
  bind(el, binding) {
    !hasAuthority(binding.value || el.innerText) && setTimeout(() => el.remove(), 0)
  }
}
```
## 单点登录？
### URL结构解析
在互联网中，任何一个可访问的文件或文档都具有一个唯一的地址，这种地址称为统一资源定位符(Uniform Resource Locator，URL)，也被称为网址。每个URL都有其对应的文件（文档），例如: `https://www.baidu.com/index.html`对应的则是百度的官网首页。至于为什么我们省略了`/index.html`也能访问，这牵扯到部署相关配置的问题，在此不做深究。
#### URL的构成
`URL`遵守一种标准的语法，它由**协议**、**主机名**、**域名**、**端口**、**路径**、以及**文件名**这六个部分构成，其中端口可以省略。具体语法规则如下：
```js
scheme://host.domain:port/path/filename
```
在上述语法规则中，`scheme`表示协议，`host`表示主机名，`domain`表示域名，`port`表示端口（可以省略），`path`表示文件的路径，`filename`表示文件名称。关于请求的相关`URL`还包括`query`查询参数，`hash`锚点。
+ 协议：用来指明客户端和服务器之间通信的类型。经常用到的协议有四种：`http`、`https`、`ftp`以及`file`。
+ 主机名：向浏览器提供文件站点的名称。`www`是我们常见的主机名，网易云音乐的网址`https://music.163.com`的主机名是`music`。
+ 域名：域名和主机名一起使用，被用来定义服务器的地址。域名即`IP`地址的别名。
  + 顶级域名：最右边的那个词称为顶级域名。常见的顶级域名`.COM`、`.NET`、`.TOP`、`.ORG`。
  + 二级域名：顶级域名的下一级。例如`http://www.mjy-blog.cn`，顶级域名为`.cn`，二级域名为`mjy-blog`，主机名为`www`。
+ 端口：端口用来定义主机上的端口号。如果不写，`http`的默认端口号是`80`，`https`的默认端口号是`443`，`ftp`的默认端口号是`21`。
+ 路径：指定服务器上文件的所在位置。
+ 文件名：用来定义文档或资源的名称。网页文件的后缀有很多种，比如`.html`、`.php`、`.jsp`、`.asp`等。
+ 查询参数：跟在路径后的用`?`分割的部分。以`key=value`形式存在并且使用`&`连接。
### [HTTP cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie 使基于无状态的HTTP协议记录稳定的状态信息成为了可能。

另外，Cookie 的过期时间、域、路径、有效期、适用站点都可以根据需要来指定。
#### Cookie的作用域
+ **Domain**: 指定了哪些主机可以接受`Cookie`。如果不指定，默认为`origin`，不包含子域名。如果指定了`Domain`，则一般包含子域名。当子域需要共享有关用户的信息时，这可能会有所帮助。
+ **Path**:指定了主机下的哪些路径可以接受`Cookie`。

### 参考文章
+ [单点登录的三种实现方式](https://www.cnblogs.com/yonghengzh/p/13712729.html)