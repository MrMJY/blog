### (1) 代码出现重大BUG如何快速回滚到上（某）一个版本？
#### 方式一：将上一次稳定版本备份(时间最少)
如果出现问题，需要短时间（非常紧急）修复，可以直接回滚到上一个稳定版本。
#### 方式二：git命令回滚代码，更新远程仓库
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
#### 方式三：Jenkins一键回滚（备份）


### (2) 以Element-UI组件库为例的项目换肤？
#### 方式一：自定义主题，覆盖默认的主题
这种方式其实就是通过官方主题工具导出一个包含变量的scss文件`element-variables.scss`
#### 方式二：自定义多套主题，通过切换，改变主题
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
#### 方式三：使用颜色选择器，实时更换主题颜色
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

### (3) 如何鉴权？
### (4) 单点登录？