`Mock.js`是一款前端开发中拦截`Ajax`请求生成随机数据并响应的工具，可以用来模拟服务器响应。
## 特点
+ 前后端分离：让前端攻城师独立于后端进行开发
+ 增加单元测试的真实性：通过随机数据，模拟各种场景
+ 开发无侵入：不需要修改既有代码，就可以拦截 Ajax 请求，返回模拟的响应数据
+ 用法简单：符合直觉的接口
+ 数据类型丰富：支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等
+ 方便扩展：支持支持扩展更多数据类型，支持自定义函数和正则
## 在Vue中使用
### 安装
```sh
npm install mockjs -D
```
### 新建`mock`目录
```sh
|- mock
  |- index.js      需要mock的接口
  |- common.js     自定义扩展的数据类型文件     
```
目录完全根据个人喜好创建，此处仅仅举例示意。
```js
// common.js
import { Random } from 'mockjs'

// 扩展一个随机产生一个星座的模板
Random.extend({
  constellation: function() {
    const constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
    return this.pick(constellations)
  }
})

```
```js
// index.js
import Mock, { Random } from 'mockjs'
import './common.js' // 自定义的数据结构

// 商品列表
Mock.mock('/goodsList', 'get', {
  message: '获取成功',
  data: {
    page: 1,
    pageSize: 10,
    total: 23,
    'list|10': [
      {
        id: '@integer(1)',
        goodName: '@cword(5, 10)',
        oprice: '@float(60, 100, 2, 2)',
        creatTime: '@datetime()',
        constellation: '@constellation()', // 使用扩展的模板
        avatar: Random.image('60x60', '#50B347', '#FFF', 'Mock.js')
      }
    ]
  }
})

// 商品详情
Mock.mock(/\/goodsInfo\/\d+/, 'get', {
  message: '获取成功',
  data: {
    id: '@integer(1)',
    goodName: '@cword(5, 10)',
    oprice: '@float(60, 100, 2, 2)',
    creatTime: '@datetime()',
    avatar: Random.image('60x60', '#50B347', '#FFF', 'Mock.js')
  }
})
```
### 配置环境变量
+ 在根目录下新建`.env.development`文件，添加环境变量`VUE_APP_MOCK=true`
+ 在`src/main.js`中使用环境变量，有选择性的开启`MOCK`功能。
  ```js
  import App from './App.vue'
  import router from './router'
  import store from './store'
  // Mock数据
  process.env.VUE_APP_MOCK == 'true' && require('../mock/index.js')
  ```
如此一来，只需要修改环境变量文件即可开启/关闭`Mock`功能。`Mock`的接口完全独立于项目，单独维护。
