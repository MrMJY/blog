## 搭建调试环境

+ 克隆源码`git clone https://github.com/facebook/react.git`
+ 安装依赖`yarn`
+ 构建`yarn build react/index,react/jsx,react-dom/index,scheduler type=NODE`
+ 为构建后的代码创建软连接
  + `cd build/node_modules/react`
  + `npm link`
  + `cd build/node_modules/react-dom`
  + `npm link`
+ 在项目根目录下使用`create-react-app`创建一个项目
  + `npx create-react-app example`
  + `npm link react react-dom`
+ 启动创建的项目
  + `cd example`
  + `npm start`