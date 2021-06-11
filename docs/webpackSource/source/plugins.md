## EntryOptionPlugin
+ 安装位置 `webpack/lib/WebpackOptionsApply.js:290`
+ 触发位置 `webpack/lib/WebpackOptionsApply.js:291`
+ 是否对外暴露：否

```js
const SingleEntryPlugin = require("./SingleEntryPlugin");   // 单一入口
const MultiEntryPlugin = require("./MultiEntryPlugin");     // 多入口
const DynamicEntryPlugin = require("./DynamicEntryPlugin"); // 动态入口

const itemToPlugin = (context, item, name) => {
	if (Array.isArray(item)) {
		return new MultiEntryPlugin(context, item, name);
	}
	return new SingleEntryPlugin(context, item, name);
};

module.exports = class EntryOptionPlugin {
	/**
	 * 根据不同的 entry 形式，给 compiler 添加不同的 EntryPlugin
	 * 形式①: 字符串(entry: 'src/main.js') -> 单一入口
	 * 形式②：字符串数组(entry: ['src/pages/home/index.js', 'src/pages/login/index.js']) -> 多入口
	 * 形式③：对象(entry: { main: 'src/pages/home/index.js', login: 'src/pages/login/index.js' }) -> 多入口
	 * 形式④：函数(entry: function(context, entry) { return xxx })
	 */
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
};
```
**功能：** 根据 `entry` 的不同形式添加 `EntryPlugin`

### SingleEntryPlugin
+ 安装位置 `webpack/lib/EntryOptionPlugin.js:40`
+ 触发位置 `webpack/lib/Compiler.js:676`
+ 是否对外暴露：否
```js
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");
class SingleEntryPlugin {
  constructor(context, entry, name) {
		this.context = context;
		this.entry = entry;
		this.name = name;
	}
  // 安装插件
  apply(compiler) {
		// 给 compiler 的 compilation 钩子注册事件
		// 在Compiler.js中的newCompilation方法中触发
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
				// 添加依赖构造函数类型
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);
		// 给 compiler 的 make 钩子注册事件
		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;
				// 创建一个依赖收集对象
				const dep = SingleEntryPlugin.createDependency(entry, name);
				// 将创建的入口依赖收集对象添加到compilation中
				compilation.addEntry(context, dep, name, callback);
			}
		);
  }
  static createDependency(entry, name) {
		const dep = new SingleEntryDependency(entry);
		dep.loc = { name };
		return dep;
	}
}
```
**功能：**
+ 为`compiler`注册钩子事件，`compilation`触发添加依赖工厂函数，不同的模块工厂函数不同
  + `SingleEntryDependency`的工厂函数是`normalModuleFactory`
+ 为`compiler`注册钩子事件，`make`触发添加入口