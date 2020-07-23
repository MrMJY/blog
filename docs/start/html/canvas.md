Canvas API 提供了一个通过JavaScript 和 HTML的`<canvas>`元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

Canvas API主要聚焦于2D图形。而同样使用`<canvas>`元素的 WebGL API 则用于绘制硬件加速的2D和3D图形。

### Canvas标签
使用`<canvas>`元素不是非常难，Canvas 的默认大小为300像素×150像素（宽×高，像素的单位是px）。可以使用HTML的高度和宽度属性来自定义Canvas 的尺寸。也可以通过JavaScript修改它的宽高。但是不要使用CSS样式修改它的宽高（会扭曲）。
```html
<!-- 使用标签的width和height属性修改宽高 -->
<canvas id="canvas" width="600" height="300">
  <!-- 兼容提示 -->
  您的浏览器版本太低，请升级浏览器
  <!-- 替代方案，使用flash -->
</canvas>
<script>
  // 通过 js 修改
  let canvas = document.getElementById('canvas')
  canvas.width = 900
  canvas.height = 600
</script>
```

### 渲染上下文(The rendering context)
渲染上下文，可以用来绘制和处理要展示的内容。说白了就是提供了一个**操作画布的接口**。如同画图上面的工具栏，通过不同的API做不同的处理。
```js
let canvas = document.getElementById('canvas')
// 使用 canvas 的 getContext 方法可以获得渲染上下文
let ctx = canvas.getContext('2d') // 得到 CanvasRenderingContext2D 对象
```

### 检查支持性
可以通过检查`canvas`对象是否存在`getContext`方法来判断浏览器是否支持
```js
let canvas = document.getElementById('canvas')
if (canvas.getContext) {
  let ctx = canvas.getContext('2d')
  // drawing code here
} else {
  // canvas-unsupported code here
}
```

### 移动画笔到指定位置
+ `moveTo(x, y)`:指定你的起始位置。

### 绘制线
+ `lineTo(x, y)`:绘制一条从当前位置到指定x以及y位置的直线。

### 绘制矩形
+ `fillRect(x, y, width, height)`:绘制一个填充的矩形
+ `strokeRect(x, y, width, height)`:绘制一个矩形的边框
+ `clearRect(x, y, width, height)`:清除指定矩形区域

以上方法执行后会**即时生效**。

### 路径绘制
使用路径绘制图形需要一些额外的步骤。
+ 首先，你需要创建路径起始点。
+ 然后你使用画图命令去画出路径。
+ 一旦路径生成，你就能通过描边或填充路径区域(填充需要路径闭合)来渲染图形。

以下是所要用到的函数：
+ `beginPath()`:新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
+ `closePath()`:闭合路径之后图形绘制命令又重新指向到上下文中。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。
+ `stroke()`:通过路径来绘制图形轮廓(不会自动闭合路径)。
+ `fill()`:通过填充路径的内容区域生成实心的图形(会自动闭合路径)。

### 绘制圆弧
+ `arc(x, y, radius, startAngle, endAngle, anticlockwise)`:画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle(开始弧度)开始到endAngle(结束弧度)结束，按照anticlockwise给定的方向（默认为`false`顺时针）来生成。
::: tip 注意
arc()函数中表示角的单位是弧度，不是角度。角度与弧度的js表达式:<b>弧度=(Math.PI/180)*角度</b>。
:::
