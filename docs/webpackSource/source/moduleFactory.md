## NormalModuleFactory
+ 调用位置`webpack/lib/Compiler.js:642`

```js
const path = require("path");
const asyncLib = require("neo-async");
const {
	Tapable,
	AsyncSeriesWaterfallHook,
	SyncWaterfallHook,
	SyncBailHook,
	SyncHook,
	HookMap
} = require("tapable");
const NormalModule = require("./NormalModule");
const RawModule = require("./RawModule");
const RuleSet = require("./RuleSet");

const { cachedCleverMerge } = require("./util/cleverMerge");

const EMPTY_RESOLVE_OPTIONS = {};

const MATCH_RESOURCE_REGEX = /^([^!]+)!=!/;
// 工具函数：loader配置参数转成查询字符串
const loaderToIdent = data => {
	if (!data.options) {
		return data.loader;
	}
	if (typeof data.options === "string") {
		return data.loader + "?" + data.options;
	}
	if (typeof data.options !== "object") {
		throw new Error("loader options must be string or object");
	}
	if (data.ident) {
		return data.loader + "??" + data.ident;
	}
	return data.loader + "?" + JSON.stringify(data.options);
};
// 工具函数：loader查询字符串转成配置参数
const identToLoaderRequest = resultString => {
	const idx = resultString.indexOf("?");
	if (idx >= 0) {
		const loader = resultString.substr(0, idx);
		const options = resultString.substr(idx + 1);
		return {
			loader,
			options
		};
	} else {
		return {
			loader: resultString,
			options: undefined
		};
	}
};
const dependencyCache = new WeakMap(); // 缓存依赖

class NormalModuleFactory extends Tapable {
  // context: 执行上下文根目录，resolverFactory：一个可以创建resolver实例对象，options：module配置项
  constructor(context, resolverFactory, options) {
		super();
		this.hooks = {
			resolver: new SyncWaterfallHook(["resolver"]),
			factory: new SyncWaterfallHook(["factory"]),
			beforeResolve: new AsyncSeriesWaterfallHook(["data"]),
			afterResolve: new AsyncSeriesWaterfallHook(["data"]),
			createModule: new SyncBailHook(["data"]),
			module: new SyncWaterfallHook(["module", "data"]),
			createParser: new HookMap(() => new SyncBailHook(["parserOptions"])),
			parser: new HookMap(() => new SyncHook(["parser", "parserOptions"])),
			createGenerator: new HookMap(
				() => new SyncBailHook(["generatorOptions"])
			),
			generator: new HookMap(
				() => new SyncHook(["generator", "generatorOptions"])
			)
		};
		/* 省略一部分代码 */
    // this._pluginCompat.tap("NormalModuleFactory", options => {...})
    // resolverFactory：一个可以创建resolver实例对象，它的get(type, options)将创建一个resolver加载器
		this.resolverFactory = resolverFactory;
    // 解析 module.rules
		this.ruleSet = new RuleSet(options.defaultRules.concat(options.rules));
		this.cachePredicate =
			typeof options.unsafeCache === "function"
				? options.unsafeCache
				: Boolean.bind(null, options.unsafeCache);
		this.context = context || "";
		this.parserCache = Object.create(null);
		this.generatorCache = Object.create(null);
    // 给 factory 注册钩子函数，触发时返回一个 factory 函数
    // 返回的 factory 函数就是下面的钩子函数
		this.hooks.factory.tap("NormalModuleFactory", () => (result, callback) => {
			let resolver = this.hooks.resolver.call(null); // 返回一个 resolver 函数

			// Ignored
			if (!resolver) return callback();

			resolver(result, (err, data) => {
				if (err) return callback(err);

				// Ignored
				if (!data) return callback();

				// direct module
				if (typeof data.source === "function") return callback(null, data);

				this.hooks.afterResolve.callAsync(data, (err, result) => {
					if (err) return callback(err);

					// Ignored
					if (!result) return callback();

					let createdModule = this.hooks.createModule.call(result);
					if (!createdModule) {
						if (!result.request) {
							return callback(new Error("Empty dependency (no request)"));
						}

						createdModule = new NormalModule(result);
					}

					createdModule = this.hooks.module.call(createdModule, result);

					return callback(null, createdModule);
				});
			});
		});
    // 给 resolver 注册钩子函数，触发时返回一个 resolver 函数
    // 返回的 resolver 函数就是下面的钩子函数
		this.hooks.resolver.tap("NormalModuleFactory", () => (data, callback) => {
			const contextInfo = data.contextInfo;
			const context = data.context;
			const request = data.request;

      // 调用 this.resolverFactory.get(type, options) 创建一个 resolver 加载器
      // 创建 loader、normal 加载器
      // 例如加载 css 必须先加载 css loader 然后再加载 css 文件
			const loaderResolver = this.getResolver("loader"); // 加载 loader
			const normalResolver = this.getResolver("normal", data.resolveOptions); // 加载真正的模块

			let matchResource = undefined;
			let requestWithoutMatchResource = request;
      // 对加载文件的路径进行一些特殊判断
      // Loader 的内联用法(不推荐) https://webpack.docschina.org/concepts/loaders/#inline
      // import Styles from 'style-loader!css-loader?modules!./styles.css'
      // 等这样的路径进行特殊处理
      // 以!分割
			const matchResourceMatch = MATCH_RESOURCE_REGEX.exec(request);
			if (matchResourceMatch) {
				matchResource = matchResourceMatch[1];
        // 匹配到 './' 或 '../'
				if (/^\.\.?\//.test(matchResource)) {
					matchResource = path.join(context, matchResource);
				}
				requestWithoutMatchResource = request.substr(
					matchResourceMatch[0].length
				);
			}
      // 判断是否以 '-!' 为前缀
      // 使用 -! 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders
			const noPreAutoLoaders = requestWithoutMatchResource.startsWith("-!");
      // 判断是否以 '!' 为前缀
      // 使用 ! 前缀，将禁用所有已配置的 normal loader(普通 loader)
			const noAutoLoaders =
				noPreAutoLoaders || requestWithoutMatchResource.startsWith("!");
      // 判断是否以 '!！' 为前缀
      // 使用 !! 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）
			const noPrePostAutoLoaders = requestWithoutMatchResource.startsWith("!!");
			let elements = requestWithoutMatchResource
				.replace(/^-?!+/, "")
				.replace(/!!+/g, "!")
				.split("!");
      // 加载的文件路径
			let resource = elements.pop();
			elements = elements.map(identToLoaderRequest);
			// 并行执行数组中的任务
			asyncLib.parallel(
				[
          // 加载 loader 路径
					callback =>
						this.resolveRequestArray(
							contextInfo,
							context,
							elements,
							loaderResolver,
							callback
						),
					callback => {
						if (resource === "" || resource[0] === "?") {
							return callback(null, {
								resource
							});
						}
						// 加载普通路径
						normalResolver.resolve(
							contextInfo,
							context,
							resource,
							{},
							(err, resource, resourceResolveData) => {
								if (err) return callback(err);
								callback(null, {
									resourceResolveData,
									resource
								});
							}
						);
					}
				],
				(err, results) => {
					if (err) return callback(err);
					let loaders = results[0];
					const resourceResolveData = results[1].resourceResolveData;
					resource = results[1].resource;

					// translate option idents
					try {
						for (const item of loaders) {
							if (typeof item.options === "string" && item.options[0] === "?") {
								const ident = item.options.substr(1);
								item.options = this.ruleSet.findOptionsByIdent(ident);
								item.ident = ident;
							}
						}
					} catch (e) {
						return callback(e);
					}

					if (resource === false) {
						// ignored
						return callback(
							null,
							new RawModule(
								"/* (ignored) */",
								`ignored ${context} ${request}`,
								`${request} (ignored)`
							)
						);
					}

					const userRequest =
						(matchResource !== undefined ? `${matchResource}!=!` : "") +
						loaders
							.map(loaderToIdent)
							.concat([resource])
							.join("!");

					let resourcePath =
						matchResource !== undefined ? matchResource : resource;
					let resourceQuery = "";
					const queryIndex = resourcePath.indexOf("?");
					if (queryIndex >= 0) {
						resourceQuery = resourcePath.substr(queryIndex);
						resourcePath = resourcePath.substr(0, queryIndex);
					}

					const result = this.ruleSet.exec({
						resource: resourcePath,
						realResource:
							matchResource !== undefined
								? resource.replace(/\?.*/, "")
								: resourcePath,
						resourceQuery,
						issuer: contextInfo.issuer,
						compiler: contextInfo.compiler
					});
					const settings = {};
					const useLoadersPost = [];
					const useLoaders = [];
					const useLoadersPre = [];
					for (const r of result) {
						if (r.type === "use") {
							if (r.enforce === "post" && !noPrePostAutoLoaders) {
								useLoadersPost.push(r.value);
							} else if (
								r.enforce === "pre" &&
								!noPreAutoLoaders &&
								!noPrePostAutoLoaders
							) {
								useLoadersPre.push(r.value);
							} else if (
								!r.enforce &&
								!noAutoLoaders &&
								!noPrePostAutoLoaders
							) {
								useLoaders.push(r.value);
							}
						} else if (
							typeof r.value === "object" &&
							r.value !== null &&
							typeof settings[r.type] === "object" &&
							settings[r.type] !== null
						) {
							settings[r.type] = cachedCleverMerge(settings[r.type], r.value);
						} else {
							settings[r.type] = r.value;
						}
					}
					asyncLib.parallel(
						[
							this.resolveRequestArray.bind(
								this,
								contextInfo,
								this.context,
								useLoadersPost,
								loaderResolver
							),
							this.resolveRequestArray.bind(
								this,
								contextInfo,
								this.context,
								useLoaders,
								loaderResolver
							),
							this.resolveRequestArray.bind(
								this,
								contextInfo,
								this.context,
								useLoadersPre,
								loaderResolver
							)
						],
						(err, results) => {
							if (err) return callback(err);
							if (matchResource === undefined) {
								loaders = results[0].concat(loaders, results[1], results[2]);
							} else {
								loaders = results[0].concat(results[1], loaders, results[2]);
							}
							process.nextTick(() => {
								const type = settings.type;
								const resolveOptions = settings.resolve;
								callback(null, {
									context: context,
									request: loaders
										.map(loaderToIdent)
										.concat([resource])
										.join("!"),
									dependencies: data.dependencies,
									userRequest,
									rawRequest: request,
									loaders,
									resource,
									matchResource,
									resourceResolveData,
									settings,
									type,
									parser: this.getParser(type, settings.parser),
									generator: this.getGenerator(type, settings.generator),
									resolveOptions
								});
							});
						}
					);
				}
			);
		});
	}
}
```