[CSS像素、物理像素、逻辑像素、设备像素比、PPI、Viewport](https://github.com/jawil/blog/issues/21)

## 百分比 + 固定高度布局方案

+ 固定屏幕为理想视口宽度
  + `<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">`
+ 少许的媒体查询设置字体
+ `水平百分比布局`或者`弹性布局`

## Rem解决方案

+ Rem的大小取值：根据页面的dpr动态改变
+ Rem的取值： 1rem = 100px 或者 1rem = 1/10 * 理想视口的宽度
+ Chrome浏览器字体小于12px（会被重置为12px)

::: tip 提示
这种方案麻烦之处在于，需要换算设计稿`px`到`rem`，解决方案是，利用编译器插件，写`px`自动转换为`rem`
例如：`cssrem、px2rem`等
:::

```js
!(function(doc, win) {
    var docEle = doc.documentElement,
        evt = "onorientationchange" in window ? "orientationchange" : "resize",
        fn = function() {
            var width = docEle.clientWidth;
            width = width < 320 ? 320 : width;
            width = width > 640 ? 640 : width;
            width && (docEle.style.fontSize = 100 * (width / 640) + "px");
        };
     
    win.addEventListener(evt, fn, false);
    doc.addEventListener("DOMContentLoaded", fn, false);
 
}(document, window));
```



## 固定设计稿的宽度开发 + 根据设备动态适配缩放

+ 开发直接按照设计稿编写固定尺寸元素
+ 页面加载完成后用js动态根据dpr改变页面的缩放值
+ 推荐使用： [flexible方案](https://github.com/amfe/lib-flexible)通过了充分的实战检验（阿里）
+ 基于 flexible 方案的 [hotcss](https://github.com/imochen/hotcss)

```js
(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
```

#### window.devicePixelRatio

MDN解释为：[`Window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 接口的`devicePixelRatio`返回当前显示设备的`物理像素分辨率与CSS像素分辨率之比`。 此值也可以解释为像素大小的比率：一个CSS像素的大小与一个物理像素的大小。简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个CSS像素。

移动端调试工具`spy-debugger`