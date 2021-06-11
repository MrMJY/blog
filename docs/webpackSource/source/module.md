## NormalModule
对应`NormalModuleFactory`创建出来的`Module`

```js
class NormalModule extends Module {
  constructor({
		type,
		request,
		userRequest,
		rawRequest,
		loaders,
		resource,
		matchResource,
		parser,
		generator,
		resolveOptions
	}) {
		super(type, getContext(resource));

		// Info from Factory
		this.request = request;
		this.userRequest = userRequest;
		this.rawRequest = rawRequest;
		this.binary = type.startsWith("webassembly");
		this.parser = parser;
		this.generator = generator;
		this.resource = resource;
		this.matchResource = matchResource;
		this.loaders = loaders;
		if (resolveOptions !== undefined) this.resolveOptions = resolveOptions;

		// Info from Build
		this.error = null;
		this._source = null;
		this._sourceSize = null;
		this._buildHash = "";
		this.buildTimestamp = undefined;
		/** @private @type {Map<string, CachedSourceEntry>} */
		this._cachedSources = new Map();

		// Options for the NormalModule set by plugins
		// TODO refactor this -> options object filled from Factory
		this.useSourceMap = false;
		this.lineToLine = false;

		// Cache
		this._lastSuccessfulBuildMeta = {};
	}
  // 对模块进行build
  build(options, compilation, resolver, fs, callback) {
		this.buildTimestamp = Date.now();
		this.built = true;
		this._source = null;
		this._sourceSize = null;
		this._ast = null;
		this._buildHash = "";
		this.error = null;
		this.errors.length = 0;
		this.warnings.length = 0;
		this.buildMeta = {};
		this.buildInfo = {
			cacheable: false,
			fileDependencies: new Set(),
			contextDependencies: new Set(),
			assets: undefined,
			assetsInfo: undefined
		};
    // doBuild
		return this.doBuild(options, compilation, resolver, fs, err => {
			this._cachedSources.clear();

			// if we have an error mark module as failed and exit
			if (err) {
				this.markModuleAsErrored(err);
				this._initBuildHash(compilation);
				return callback();
			}

			// check if this module should !not! be parsed.
			// if so, exit here;
			const noParseRule = options.module && options.module.noParse;
			if (this.shouldPreventParsing(noParseRule, this.request)) {
				this._initBuildHash(compilation);
				return callback();
			}

			const handleParseError = e => {
				const source = this._source.source();
				const loaders = this.loaders.map(item =>
					contextify(options.context, item.loader)
				);
				const error = new ModuleParseError(this, source, e, loaders);
				this.markModuleAsErrored(error);
				this._initBuildHash(compilation);
				return callback();
			};

			const handleParseResult = result => {
				this._lastSuccessfulBuildMeta = this.buildMeta;
				this._initBuildHash(compilation);
				return callback();
			};

			try {
				const result = this.parser.parse(
					this._ast || this._source.source(),
					{
						current: this,
						module: this,
						compilation: compilation,
						options: options
					},
					(err, result) => {
						if (err) {
							handleParseError(err);
						} else {
							handleParseResult(result);
						}
					}
				);
				if (result !== undefined) {
					// parse is sync
					handleParseResult(result);
				}
			} catch (e) {
				handleParseError(e);
			}
		});
	}
  // 加载loader、通过fs加载module
  doBuild(options, compilation, resolver, fs, callback) {
    // 创建 loaderContext
		const loaderContext = this.createLoaderContext(
			resolver,
			options,
			compilation,
			fs
		);
    // 执行 runLoaders 读取文件
		runLoaders(
			{
				resource: this.resource,
				loaders: this.loaders,
				context: loaderContext,
				readResource: fs.readFile.bind(fs)
			},
			(err, result) => {
        // 获得读取到的文件内容
				if (result) {
					this.buildInfo.cacheable = result.cacheable;
					this.buildInfo.fileDependencies = new Set(result.fileDependencies);
					this.buildInfo.contextDependencies = new Set(
						result.contextDependencies
					);
				}

				if (err) {
					if (!(err instanceof Error)) {
						err = new NonErrorEmittedError(err);
					}
					const currentLoader = this.getCurrentLoader(loaderContext);
					const error = new ModuleBuildError(this, err, {
						from:
							currentLoader &&
							compilation.runtimeTemplate.requestShortener.shorten(
								currentLoader.loader
							)
					});
					return callback(error);
				}
        // 读取的buffer形式文件内容
				const resourceBuffer = result.resourceBuffer;
        // utf-8格式的文件内容
				const source = result.result[0];
				const sourceMap = result.result.length >= 1 ? result.result[1] : null;
				const extraInfo = result.result.length >= 2 ? result.result[2] : null;

				if (!Buffer.isBuffer(source) && typeof source !== "string") {
					const currentLoader = this.getCurrentLoader(loaderContext, 0);
					const err = new Error(
						`Final loader (${
							currentLoader
								? compilation.runtimeTemplate.requestShortener.shorten(
										currentLoader.loader
								  )
								: "unknown"
						}) didn't return a Buffer or String`
					);
					const error = new ModuleBuildError(this, err);
					return callback(error);
				}
        // 把读取到的内容保存到this._source中
				this._source = this.createSource(
					this.binary ? asBuffer(source) : asString(source),
					resourceBuffer,
					sourceMap
				);
				this._sourceSize = null;
				this._ast =
					typeof extraInfo === "object" &&
					extraInfo !== null &&
					extraInfo.webpackAST !== undefined
						? extraInfo.webpackAST
						: null;
				return callback();
			}
		);
	}
}
```