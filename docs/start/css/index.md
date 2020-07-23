## 布局原理

flex 是 flexible box 的缩写，意为“弹性布局”，用来为盒模型提供最大的灵活性，任何一个容器都可以指定为 flex 布局。
采用 Flex 布局的元素，称为 Flex 容器（Flex Container），简称“容器”。它的所有子元素自动成为容器成员，成为 Flex 项目（flex-item），简称“项目”

+ 当我们为父盒子设为 flex 布局后，子元素的 float、clear 和 vertical-align 属性将失效。

+ 子项目（flex-item）可以横向排列也可以纵向排列

总结：通过给父盒子添加 `flex` 属性，来控制子盒子的位置和排列位置。

## 父项常用属性

+ `flex-direction`:设置主轴的方向  ： `row(默认)、row-reverse(反向横轴)、column(纵轴方向)、`

  ​									`column-reverse(反向纵轴)`

+ `justify-content`:设置`主轴`上的子元素排列方式，`不影响子元素排列顺序`

  + `flex-start`:默认，头部对齐
  + `flex-end`:尾部对齐
  + `felx-center`:居中对齐
  + `space-around`:剩余空间平局分配
  + `space-between`:两边贴边，剩余平分

+ `flex-wrap`:设置子元素是否换行

  + `nowrap`:默认，不换行
  + `wrap`:换行

+ `align-items`:设置`侧轴`上的子元素排列方式，`不影响子元素排列顺序`（单行）

  + `flex-start`:默认，头部对齐
  + `flex-end`:尾部对齐
  + `felx-center`:居中对齐
  + `space-around`:剩余空间平局分配
  + `space-between`:两边贴边，剩余平分
  + `stretch`:拉伸至父盒子的高度，`不能设置子盒子的高度，否则不起效果`

+ `align-content`:设置`侧轴`上的子元素排列方式，`不影响子元素排列顺序`（多行）

  + `flex-start`:默认，头部对齐
  + `flex-end`:尾部对齐
  + `felx-center`:居中对齐
  + `space-around`:剩余空间平局分配
  + `space-between`:两边贴边，剩余平分
  + `stretch`:设置子元素平分父盒子高度，`不能设置子盒子的高度，否则不起效果`