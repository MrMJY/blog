## webpack函数
定义在`webpack/lib/webpack.js`中，下面粘贴的代码不是源码，是`node_modules`中的，源码代码与下面的代码有部分不同。下面的代码更符合实际构建
```js
const webpack = (options, callback) => {
  // 校验配置参数是否合法
	const webpackOptionsValidationErrors = validateSchema(
		webpackOptionsSchema,
		options
	);
	// 配置错误输出相应的提示信息
	if (webpackOptionsValidationErrors.length) {
		throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
	}
	let compiler;
	// 如果配置是一个数组，则创建一个MultiCompiler
	if (Array.isArray(options)) {
		compiler = new MultiCompiler(
			Array.from(options).map(options => webpack(options))
		);
	} else if (typeof options === "object") {
		// 给未设置的配置项设置默认参数，最后options是一个完整的配置项
		options = new WebpackOptionsDefaulter().process(options);
		// 创建 compiler 实例
		compiler = new Compiler(options.context);
		compiler.options = options;
		// apply 方法：为compiler注册内容
		// ① 实现一个基础的打印器(按照配置输出各种信息，info,warning...)
		// ② 为compiler创建文件输入系统，文件输出系统，文件监听系统，并且给 beforeRun 添加一个钩子函数
		new NodeEnvironmentPlugin({
			infrastructureLogging: options.infrastructureLogging
		}).apply(compiler);
		// 注册options中的插件，如果是函数就调用，传入的this和参数都是compiler
		// apply方法应该是每个插件都应该有的一个方法，参考文档写一个自己的插件
		// 插件通过给不同的事件注册钩子函数，来处理资源
		if (options.plugins && Array.isArray(options.plugins)) {
			for (const plugin of options.plugins) {
				if (typeof plugin === "function") {
					plugin.call(compiler, compiler);
				} else {
					plugin.apply(compiler);
				}
			}
		}
		// 触发 environment 事件
		compiler.hooks.environment.call();
		// 触发 afterEnvironment 事件
		compiler.hooks.afterEnvironment.call();
		// 注册 webpack 自带的插件
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}
	if (callback) {
		if (typeof callback !== "function") {
			throw new Error("Invalid argument: callback");
		}
		if (
			options.watch === true ||
			(Array.isArray(options) && options.some(o => o.watch))
		) {
			const watchOptions = Array.isArray(options)
				? options.map(o => o.watchOptions || {})
				: options.watchOptions || {};
			return compiler.watch(watchOptions, callback);
		}
		// 运行compiler
		compiler.run(callback);
	}
	return compiler;
};
```
`webpack`函数最主要做了以下几件事：
+ 设置默认参数、用户设置的，使用用户设置的，未设置的使用默认参数
+ 创建 `compiler` 实例
+ 注册用户配置的插件 `plugins`
+ 根据项目运行的环境（`web`、`node`等），注册 `webpack` 自带的默认插件

## Compiler类
定义在`webpack/lib/Compiler.js:42`中
```js
class Compiler extends Tapable {
	constructor(context) {
		super();
		this.hooks = {
			/** @type {SyncBailHook<Compilation>} */
			shouldEmit: new SyncBailHook(["compilation"]),
			// ...定义了很多事件队列
		}
		// 定义了很多属性，此处省略部分
		this.outputPath = "";
		/** @type {ResolverFactory} */
		this.resolverFactory = new ResolverFactory();
		this.requestShortener = new RequestShortener(context);
	}
	// 启动compiler
	run(callback) {
		// 如果重复编译报错
		if (this.running) return callback(new ConcurrentCompilationError());
		// 一个辅助函数，作用是停止编译，执行callback,如果有错误，触发failed钩子
		const finalCallback = (err, stats) => {
			this.running = false;

			if (err) {
				this.hooks.failed.call(err);
			}

			if (callback !== undefined) return callback(err, stats);
		};
		const startTime = Date.now(); // 记录开始时间戳
		this.running = true; // 改变状态
		// 编译完成的回调函数
		const onCompiled = (err, compilation) => {
			if (err) return finalCallback(err);
			// 创建 stats 对象，让你更精确地控制 bundle 信息该怎么显示
			// 更多查看 https://webpack.docschina.org/configuration/stats/#root
			if (this.hooks.shouldEmit.call(compilation) === false) {
				const stats = new Stats(compilation);
				stats.startTime = startTime;
				stats.endTime = Date.now();
				this.hooks.done.callAsync(stats, err => {
					if (err) return finalCallback(err);
					return finalCallback(null, stats);
				});
				return;
			}
			// 产出资源
			this.emitAssets(compilation, err => {
				if (err) return finalCallback(err);

				if (compilation.hooks.needAdditionalPass.call()) {
					compilation.needAdditionalPass = true;
					// 输出本次编译 bundle 信息
					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);

						this.hooks.additionalPass.callAsync(err => {
							if (err) return finalCallback(err);
							this.compile(onCompiled);
						});
					});
					return;
				}
				// 产出本次编译的模块信息文件
				this.emitRecords(err => {
					if (err) return finalCallback(err);
					// 输出本次编译 bundle 信息
					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);
						return finalCallback(null, stats);
					});
				});
			});
		};
		// 触发beforeRun事件
		this.hooks.beforeRun.callAsync(this, err => {
			if (err) return finalCallback(err);
			// 触发run事件
			this.hooks.run.callAsync(this, err => {
				if (err) return finalCallback(err);
				// Records是用于每次构建产出记录文件的配置项
				// 更多参考 https://webpack.docschina.org/configuration/other-options/#recordspath
				this.readRecords(err => {
					if (err) return finalCallback(err);
					// 重点：调用compile方法编译
					this.compile(onCompiled);
				});
			});
		});
	}
	// 编译
	compile(callback) {
		// 获取Compilation实例的参数，主要是构建模块的工厂函数
		const params = this.newCompilationParams();
		// 触发beforeCompile事件
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);
			// 触发compile事件
			this.hooks.compile.call(params);
			// 重点：创建compilation实例
			const compilation = this.newCompilation(params);
			// make事件触发(获取编译入口，开始编译)
			// make中会根据是否是多入口，注册一个SingleEntryPlugin/MultiEntryPlugin
			// 注册的地方在webpack/lib/WebpackOptionsApply.js:290
			// 会执行注册的回调函数webpack/lib/SingleEntryPlugin.js:42
			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}
	// 产出资源
	emitAssets(compilation, callback) {
		let outputPath;
		const emitFiles = err => {
			if (err) return callback(err);
			// asyncLib.forEachLimit是一个辅助函数，循环第一个参数
			// 第二个参数是同时运行最大个数，大于15则等待，第三个是回调
			// 回调的参数，第一个是循环项，也就是要产出的单个资源
			asyncLib.forEachLimit(
				compilation.getAssets(), // 获取所有资源
				15,											// 同时写入磁盘个数
				({ name: file, source }, callback) => { // 实际写入的方法
					let targetFile = file;
					const queryStringIdx = targetFile.indexOf("?");
					if (queryStringIdx >= 0) {
						targetFile = targetFile.substr(0, queryStringIdx);
					}

					const writeOut = err => {
						if (err) return callback(err);
						// 获得文件最终的目标路径
						const targetPath = this.outputFileSystem.join(
							outputPath,
							targetFile
						);
						// TODO webpack 5 remove futureEmitAssets option and make it on by default
						if (this.options.output.futureEmitAssets) {
							// check if the target file has already been written by this Compiler
							const targetFileGeneration = this._assetEmittingWrittenFiles.get(
								targetPath
							);

							// create an cache entry for this Source if not already existing
							let cacheEntry = this._assetEmittingSourceCache.get(source);
							if (cacheEntry === undefined) {
								cacheEntry = {
									sizeOnlySource: undefined,
									writtenTo: new Map()
								};
								this._assetEmittingSourceCache.set(source, cacheEntry);
							}

							// if the target file has already been written
							if (targetFileGeneration !== undefined) {
								// check if the Source has been written to this target file
								const writtenGeneration = cacheEntry.writtenTo.get(targetPath);
								if (writtenGeneration === targetFileGeneration) {
									// if yes, we skip writing the file
									// as it's already there
									// (we assume one doesn't remove files while the Compiler is running)

									compilation.updateAsset(file, cacheEntry.sizeOnlySource, {
										size: cacheEntry.sizeOnlySource.size()
									});

									return callback();
								}
							}

							// TODO webpack 5: if info.immutable check if file already exists in output
							// skip emitting if it's already there

							// get the binary (Buffer) content from the Source
							/** @type {Buffer} */
							let content;
							if (typeof source.buffer === "function") {
								content = source.buffer();
							} else {
								const bufferOrString = source.source();
								if (Buffer.isBuffer(bufferOrString)) {
									content = bufferOrString;
								} else {
									content = Buffer.from(bufferOrString, "utf8");
								}
							}

							// Create a replacement resource which only allows to ask for size
							// This allows to GC all memory allocated by the Source
							// (expect when the Source is stored in any other cache)
							cacheEntry.sizeOnlySource = new SizeOnlySource(content.length);
							compilation.updateAsset(file, cacheEntry.sizeOnlySource, {
								size: content.length
							});

							// Write the file to output file system
							this.outputFileSystem.writeFile(targetPath, content, err => {
								if (err) return callback(err);

								// information marker that the asset has been emitted
								compilation.emittedAssets.add(file);

								// cache the information that the Source has been written to that location
								const newGeneration =
									targetFileGeneration === undefined
										? 1
										: targetFileGeneration + 1;
								cacheEntry.writtenTo.set(targetPath, newGeneration);
								this._assetEmittingWrittenFiles.set(targetPath, newGeneration);
								this.hooks.assetEmitted.callAsync(file, content, callback);
							});
						} else {
							if (source.existsAt === targetPath) {
								source.emitted = false;
								return callback();
							}
							// 调用source方法得到最终的文本
							let content = source.source();
							// 转码为utf-8
							if (!Buffer.isBuffer(content)) {
								content = Buffer.from(content, "utf8");
							}
							// 标记已产出状态和路径
							source.existsAt = targetPath;
							source.emitted = true;
							// 调用文件系统写入磁盘
							this.outputFileSystem.writeFile(targetPath, content, err => {
								if (err) return callback(err);
								// 写入成功一个触发一次assetEmitted
								this.hooks.assetEmitted.callAsync(file, content, callback);
							});
						}
					};
					// 如果输出的文件路径包含了“/”或“\”则，递归创建目录
					// /dist/js、/dist/css等
					if (targetFile.match(/\/|\\/)) {
						const dir = path.dirname(targetFile);
						this.outputFileSystem.mkdirp(
							this.outputFileSystem.join(outputPath, dir),
							writeOut
						);
					} else {
						writeOut();
					}
				},
				err => {
					if (err) return callback(err);
					// 写入无错误后，触发afterEmit钩子
					this.hooks.afterEmit.callAsync(compilation, err => {
						if (err) return callback(err);

						return callback();
					});
				}
			);
		};
		// 触发 emit 事件，产出资源
		this.hooks.emit.callAsync(compilation, err => {
			if (err) return callback(err);
			// 获取输出目录
			outputPath = compilation.getPath(this.outputPath);
			// 创建目录，执行传入的 emitFiles 回调函数
			this.outputFileSystem.mkdirp(outputPath, emitFiles);
		});
	}
}
```
`compiler`负责整个编译的宏观流程（通过`hooks`可以看出来），但是不具体的去处理资源。
## Compilation类
定义在`webpack/lib/Compilation.js:243`

`compilation`是真实的负责构建编译资源的
+ 第一步：添加编译的入口，通过`make`事件，调用`SingleEntryPlugin/MultiEntryPlugin`插件，调用`addEntry()`。
	+ `addEntry()`内部实际调用的是`_addModuleChain()`
+ 第二步：根据模块类型获得模块的`Factory`函数，通过`Factory`函数创建`Module`(`moduleFactory.create()`)
+ 第三步：构建这个模块。`module.build()`
+ 第四步：构建完成后，执行`afterBuild()`
	+ 调用`processModuleDependencies(module)`
	+ `processModuleDependencies`则链式(递归)添加模块依赖`addModuleDependencies`
	+ 添加完成后，重复第四、五步
+ 第五步：`seal()`进行封装
```js
class Compilation extends Tapable {
	constructor(compiler) {
		super();
		this.hooks = {
			/** @type {SyncHook<Module>} */
			buildModule: new SyncHook(["module"]),
			// ...省略很多事件队列
		}
		// 定义了很多属性，这里省略了很多
		// 定义了很多模块模板(mainTemplate、chunkTemplate、hotUpdateChunkTemplate、runtimeTemplate、moduleTemplates)
		this.mainTemplate = new MainTemplate(this.outputOptions);
		this.chunkTemplate = new ChunkTemplate(this.outputOptions);
		this.hotUpdateChunkTemplate = new HotUpdateChunkTemplate(
			this.outputOptions
		);
		this.runtimeTemplate = new RuntimeTemplate(
			this.outputOptions,
			this.requestShortener
		);
		this.moduleTemplates = {
			javascript: new ModuleTemplate(this.runtimeTemplate, "javascript"),
			webassembly: new ModuleTemplate(this.runtimeTemplate, "webassembly")
		};
		// 这里列举了一些熟悉的属性，还有很多其他属性
		this.entries = []; // 入口
		this.chunks = [];	// chunks
		this.modules = []; // 模块
		this.assets = {}; // 最终输出的资源
	}
	// 处理Module的依赖
	processModuleDependencies(module, callback) {
		// 当前模块的依赖
		const dependencies = new Map();
		// 获取依赖放入dependencies中
		const addDependency = dep => {
			const resourceIdent = dep.getResourceIdentifier();
			if (resourceIdent) {
				const factory = this.dependencyFactories.get(dep.constructor);
				if (factory === undefined) {
					throw new Error(
						`No module factory available for dependency type: ${dep.constructor.name}`
					);
				}
				let innerMap = dependencies.get(factory);
				if (innerMap === undefined) {
					dependencies.set(factory, (innerMap = new Map()));
				}
				let list = innerMap.get(resourceIdent);
				if (list === undefined) innerMap.set(resourceIdent, (list = []));
				list.push(dep);
			}
		};
		// iterationOfArrayCallback(arr, fn)辅助工具函数:循环arr执行fn(arr[index])
		// build之后可以获得Module的AST，因此可以获得几种引入其他模块的方式
		// 例如：ESModule、commonjs等引入的模块都属于dependencies
		const addDependenciesBlock = block => {
			if (block.dependencies) {
				iterationOfArrayCallback(block.dependencies, addDependency);
			}
			if (block.blocks) {
				iterationOfArrayCallback(block.blocks, addDependenciesBlock);
			}
			if (block.variables) {
				iterationBlockVariable(block.variables, addDependency);
			}
		};

		try {
			addDependenciesBlock(module);
		} catch (e) {
			callback(e);
		}

		const sortedDependencies = [];
		// 对依赖排序，结构就是{ 工厂函数， 依赖 }
		for (const pair1 of dependencies) {
			for (const pair2 of pair1[1]) {
				sortedDependencies.push({
					factory: pair1[0],
					dependencies: pair2[1]
				});
			}
		}
		// 为这个模块添加它自己的依赖
		this.addModuleDependencies(
			module,
			sortedDependencies,
			this.bail,
			null,
			true,
			callback
		);
	}
	// 添加入口
	addEntry(context, entry, name, callback) {
		// 每次添加入口都触发addEntry事件
		this.hooks.addEntry.call(entry, name);

		const slot = {
			name: name,
			// TODO webpack 5 remove `request`
			request: null,
			module: null
		};

		if (entry instanceof ModuleDependency) {
			slot.request = entry.request;
		}

		// TODO webpack 5: merge modules instead when multiple entry modules are supported
		const idx = this._preparedEntrypoints.findIndex(slot => slot.name === name);
		if (idx >= 0) {
			// Overwrite existing entrypoint覆盖已经存在的入口
			this._preparedEntrypoints[idx] = slot;
		} else {
			this._preparedEntrypoints.push(slot);
		}
		// 链式添加 Module
		this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {
				if (err) {
					this.hooks.failedEntry.call(entry, name, err);
					return callback(err);
				}

				if (module) {
					slot.module = module;
				} else {
					const idx = this._preparedEntrypoints.indexOf(slot);
					if (idx >= 0) {
						this._preparedEntrypoints.splice(idx, 1);
					}
				}
				this.hooks.succeedEntry.call(entry, name, module);
				return callback(null, module);
			}
		);
	}
	// 链式添加模块
	_addModuleChain(context, dependency, onModule, callback) {
		const start = this.profile && Date.now();
		const currentProfile = this.profile && {};

		const errorAndCallback = this.bail
			? err => {
					callback(err);
			  }
			: err => {
					err.dependencies = [dependency];
					this.errors.push(err);
					callback();
			  };

		if (
			typeof dependency !== "object" ||
			dependency === null ||
			!dependency.constructor
		) {
			throw new Error("Parameter 'dependency' must be a Dependency");
		}
		// 不同的 dependency 其 constructor 肯定不同
		const Dep = /** @type {DepConstructor} */ (dependency.constructor);
		// 不同的依赖获得不同的工厂函数，用来创建模块
		const moduleFactory = this.dependencyFactories.get(Dep);
		if (!moduleFactory) {
			throw new Error(
				`No dependency factory available for this dependency type: ${dependency.constructor.name}`
			);
		}
		// semaphore模拟一个队列，队列长度默认100
		this.semaphore.acquire(() => {
			// 通过模块工厂的create方法创建模块
			// create方法内部创建时会使用process.nextTick()，是一个异步操作
			moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},
				(err, module) => {
					if (err) {
						this.semaphore.release();
						return errorAndCallback(new EntryModuleNotFoundError(err));
					}

					let afterFactory;

					if (currentProfile) {
						afterFactory = Date.now();
						currentProfile.factory = afterFactory - start;
					}
					// addModule：
					// 1. 判断这个module是否被缓存了，如果缓存了，则直接读取缓存结果，没有的话缓存（this._modules、this.modules）
					// 2. 如果是缓存过的则将进行判断是否要rebuild
					const addModuleResult = this.addModule(module);
					module = addModuleResult.module;
					// 将这个 Module 放入 this.entries 中
					onModule(module);
					dependency.module = module;
					module.addReason(null, dependency);
					// build后的回调函数
					const afterBuild = () => {
						// 这个module是否有自己的依赖，有的话递归添加、build
						if (addModuleResult.dependencies) {
							// 处理模块的依赖
							this.processModuleDependencies(module, err => {
								if (err) return callback(err);
								callback(null, module);
							});
						} else {
							return callback(null, module);
						}
					};

					if (addModuleResult.issuer) {
						if (currentProfile) {
							module.profile = currentProfile;
						}
					}
					// 判断这个module是否需要build
					if (addModuleResult.build) {
						// build这个module
						this.buildModule(module, false, null, null, err => {
							if (err) {
								this.semaphore.release();
								return errorAndCallback(err);
							}

							if (currentProfile) {
								const afterBuilding = Date.now();
								currentProfile.building = afterBuilding - afterFactory;
							}
							// build后释放一个队列位置
							this.semaphore.release();
							// 调用build后的回调
							afterBuild();
						});
					} else {
						this.semaphore.release();
						this.waitForBuildingFinished(module, afterBuild);
					}
				}
			);
		});
	}
	// 打包模块
	buildModule(module, optional, origin, dependencies, thisCallback) {
		let callbackList = this._buildingModules.get(module);
		if (callbackList) {
			callbackList.push(thisCallback);
			return;
		}
		this._buildingModules.set(module, (callbackList = [thisCallback]));
		// 执行module的callbackList
		const callback = err => {
			this._buildingModules.delete(module);
			for (const cb of callbackList) {
				cb(err);
			}
		};

		this.hooks.buildModule.call(module);
		// 读取源码AST转换
		module.build(
			this.options,
			this,
			this.resolverFactory.get("normal", module.resolveOptions),
			this.inputFileSystem,
			error => {
				// 处理errors
				const errors = module.errors;
				for (let indexError = 0; indexError < errors.length; indexError++) {
					const err = errors[indexError];
					err.origin = origin;
					err.dependencies = dependencies;
					if (optional) {
						this.warnings.push(err);
					} else {
						this.errors.push(err);
					}
				}
				// 处理warnings
				const warnings = module.warnings;
				for (
					let indexWarning = 0;
					indexWarning < warnings.length;
					indexWarning++
				) {
					const war = warnings[indexWarning];
					war.origin = origin;
					war.dependencies = dependencies;
					this.warnings.push(war);
				}
				const originalMap = module.dependencies.reduce((map, v, i) => {
					map.set(v, i);
					return map;
				}, new Map());
				module.dependencies.sort((a, b) => {
					const cmp = compareLocations(a.loc, b.loc);
					if (cmp) return cmp;
					return originalMap.get(a) - originalMap.get(b);
				});
				if (error) {
					this.hooks.failedModule.call(module, error);
					return callback(error);
				}
				this.hooks.succeedModule.call(module);
				return callback();
			}
		);
	}
	// 处理模块的依赖
	processModuleDependencies(module, callback) {
		const dependencies = new Map();

		const addDependency = dep => {
			const resourceIdent = dep.getResourceIdentifier();
			if (resourceIdent) {
				// 获取模块的工厂函数
				const factory = this.dependencyFactories.get(dep.constructor);
				if (factory === undefined) {
					throw new Error(
						`No module factory available for dependency type: ${dep.constructor.name}`
					);
				}
				let innerMap = dependencies.get(factory);
				if (innerMap === undefined) {
					dependencies.set(factory, (innerMap = new Map()));
				}
				let list = innerMap.get(resourceIdent);
				if (list === undefined) innerMap.set(resourceIdent, (list = []));
				list.push(dep);
			}
		};
		// 通过分析AST，收集依赖
		const addDependenciesBlock = block => {
			// 依赖项
			if (block.dependencies) {
				iterationOfArrayCallback(block.dependencies, addDependency);
			}
			// 代码块
			if (block.blocks) {
				iterationOfArrayCallback(block.blocks, addDependenciesBlock);
			}
			// 变量
			if (block.variables) {
				iterationBlockVariable(block.variables, addDependency);
			}
		};

		try {
			addDependenciesBlock(module);
		} catch (e) {
			callback(e);
		}

		const sortedDependencies = [];
		// 将双层的Map结构转换成一层的平铺列表结构
		for (const pair1 of dependencies) {
			for (const pair2 of pair1[1]) {
				sortedDependencies.push({
					factory: pair1[0],
					dependencies: pair2[1]
				});
			}
		}
		// 给模块添加依赖
		this.addModuleDependencies(
			module,
			sortedDependencies,
			this.bail,
			null,
			true,
			callback
		);
	}

	addModuleDependencies(
		module,
		dependencies,
		bail,
		cacheGroup,
		recursive,
		callback
	) {
		const start = this.profile && Date.now();
		const currentProfile = this.profile && {};
		// 循环处理依赖
		asyncLib.forEach(
			dependencies,
			(item, callback) => {
				const dependencies = item.dependencies;
				// 错误回调
				const errorAndCallback = err => {
					err.origin = module;
					err.dependencies = dependencies;
					this.errors.push(err);
					if (bail) {
						callback(err);
					} else {
						callback();
					}
				};
				// 警告回调
				const warningAndCallback = err => {
					err.origin = module;
					this.warnings.push(err);
					callback();
				};

				const semaphore = this.semaphore;
				// 同步循环执行 factory.create 异步调用 factory.create 的回调函数
				semaphore.acquire(() => {
					// 获得依赖的模块工厂函数
					const factory = item.factory;
					// 创建模块
					factory.create(
						{
							contextInfo: {
								issuer: module.nameForCondition && module.nameForCondition(),
								compiler: this.compiler.name
							},
							resolveOptions: module.resolveOptions,
							context: module.context,
							dependencies: dependencies
						},
						(err, dependentModule) => {
							let afterFactory;
							// log输出级别，error才输出、warning输出
							const isOptional = () => {
								return dependencies.every(d => d.optional);
							};
							// 错误警告回调
							const errorOrWarningAndCallback = err => {
								if (isOptional()) {
									return warningAndCallback(err);
								} else {
									return errorAndCallback(err);
								}
							};

							if (err) {
								semaphore.release();
								return errorOrWarningAndCallback(
									new ModuleNotFoundError(module, err)
								);
							}
							if (!dependentModule) {
								semaphore.release();
								return process.nextTick(callback);
							}
							if (currentProfile) {
								afterFactory = Date.now();
								currentProfile.factory = afterFactory - start;
							}

							const iterationDependencies = depend => {
								for (let index = 0; index < depend.length; index++) {
									const dep = depend[index];
									dep.module = dependentModule;
									dependentModule.addReason(module, dep);
								}
							};
							// 缓存module, this._modules this.modules
							const addModuleResult = this.addModule(
								dependentModule,
								cacheGroup
							);
							dependentModule = addModuleResult.module;
							iterationDependencies(dependencies);

							const afterBuild = () => {
								if (recursive && addModuleResult.dependencies) {
									this.processModuleDependencies(dependentModule, callback);
								} else {
									return callback();
								}
							};

							if (addModuleResult.issuer) {
								if (currentProfile) {
									dependentModule.profile = currentProfile;
								}

								dependentModule.issuer = module;
							} else {
								if (this.profile) {
									if (module.profile) {
										const time = Date.now() - start;
										if (
											!module.profile.dependencies ||
											time > module.profile.dependencies
										) {
											module.profile.dependencies = time;
										}
									}
								}
							}

							if (addModuleResult.build) {
								this.buildModule(
									dependentModule,
									isOptional(),
									module,
									dependencies,
									err => {
										if (err) {
											semaphore.release();
											return errorOrWarningAndCallback(err);
										}

										if (currentProfile) {
											const afterBuilding = Date.now();
											currentProfile.building = afterBuilding - afterFactory;
										}

										semaphore.release();
										afterBuild();
									}
								);
							} else {
								semaphore.release();
								this.waitForBuildingFinished(dependentModule, afterBuild);
							}
						}
					);
				});
			},
			err => {
				// In V8, the Error objects keep a reference to the functions on the stack. These warnings &
				// errors are created inside closures that keep a reference to the Compilation, so errors are
				// leaking the Compilation object.
				// 在 V8 中，Error 对象保持对堆栈中函数的引用。
				// 这些警告和错误是在保留对 Compilation 的引用的闭包中创建的，因此错误透传到 Compilation 对象。

				if (err) {
					// eslint-disable-next-line no-self-assign
					err.stack = err.stack;
					return callback(err);
				}

				return process.nextTick(callback);
			}
		);
	}
}
```