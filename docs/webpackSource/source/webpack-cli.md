## 入口
`webpack-cli`入口文件在`bin/cli.js`
```js
#!/usr/bin/env node

'use strict';
require('v8-compile-cache');
const importLocal = require('import-local');
const runCLI = require('../lib/bootstrap');
const { yellow } = require('colorette');
const { error, success } = require('../lib/utils/logger');
const { packageExists } = require('../lib/utils/package-exists');
const { promptInstallation } = require('../lib/utils/prompt-installation');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

// 检查webpack这个包是否安装，未安装报错提示
if (packageExists('webpack')) {
    const [, , ...rawArgs] = process.argv; // 获取命令行中的启动参数
    runCLI(rawArgs); // 通过启动cli
} else {
    promptInstallation('webpack', () => {
        error(`It looks like ${yellow('webpack')} is not installed.`);
    })
        .then(() => success(`${yellow('webpack')} was installed sucessfully.`))
        .catch(() => {
            process.exitCode = 2;
            error(`Action Interrupted, Please try once again or install ${yellow('webpack')} manually.`);
        });
    return;
}
```
检查webpack这个包是否安装，未安装的情况下，提示未安装的错误信息，如果已安装则获取命令行的参数并启动`webpack-cli`。关键的函数是`/lib/bootstrap`导出的`runCLI`方法。

## runCLI
```js
const { options } = require('colorette'); // options 控制console输出是否带颜色的信息
const WebpackCLI = require('./webpack-cli'); // 导出WebpackCLI构造器
const { core } = require('./utils/cli-flags'); // webpack所有配置项的描述，使用信息
const versionRunner = require('./groups/runVersion'); // 输出version
const helpRunner = require('./groups/runHelp'); // 输出帮助信息
const logger = require('./utils/logger'); // 封装了console对象，使用不同的颜色输出信息
const { isCommandUsed } = require('./utils/arg-utils'); // isCommandUsed找出配置参数的完整信息
const cliExecuter = require('./utils/cli-executer');
const argParser = require('./utils/arg-parser');
require('./utils/process-log');
process.title = 'webpack-cli';

// Create a new instance of the CLI object 创建cli实例
const cli = new WebpackCLI();
// 辅助函数，功能是将命令行参数解析成对象形式的配置对象{ opts: { xxx: yyy }, unknownArgs: [] }
const parseArgs = (args) => argParser(core, args, true, process.title);

const runCLI = async (cliArgs) => {
    let args;
    // 判断命令中是否有一些cli特殊的命令(init、migrate、loader、plugin、info、serve)
    // https://webpack.js.org/api/cli/#commands
    const commandIsUsed = isCommandUsed(cliArgs); 
    const parsedArgs = parseArgs(cliArgs);
    // 如果命令里有help那么输出帮助，并退出进程
    if (parsedArgs.unknownArgs.includes('help') || parsedArgs.opts.help) {
        // 命令中如果有--no-color则输出不使用颜色突出显示
        options.enabled = !cliArgs.includes('--no-color');
        helpRunner(cliArgs);
        process.exit(0);
    }
    // 如果命令里有version那么输出帮助，并退出进程
    if (parsedArgs.unknownArgs.includes('version') || parsedArgs.opts.version) {
        options.enabled = !cliArgs.includes('--no-color');
        versionRunner(cliArgs, commandIsUsed);
        process.exit(0);
    }

    if (commandIsUsed) {
        return;
    }

    try {
        // handle the default webpack entry CLI argument, where instead
        // of doing 'webpack-cli --entry ./index.js' you can simply do
        // 'webpack-cli ./index.js'
        // if the unknown arg starts with a '-', it will be considered
        // an unknown flag rather than an entry
        // 如果出现不认识的参数，尝试进行判断是否是编译入口文件(entry)
        let entry;
        if (parsedArgs.unknownArgs.length > 0 && !parsedArgs.unknownArgs[0].startsWith('-')) {
            if (parsedArgs.unknownArgs.length === 1) {
                entry = parsedArgs.unknownArgs[0];
            } else {
                entry = [];
                parsedArgs.unknownArgs.forEach((unknown) => {
                    if (!unknown.startsWith('-')) {
                        entry.push(unknown);
                    }
                });
            }
        } else if (parsedArgs.unknownArgs.length > 0) {
            parsedArgs.unknownArgs.forEach((unknown) => {
                logger.warn(`Unknown argument: ${unknown}`);
            });
            const args = await cliExecuter();
            const { opts } = parseArgs(args);
            await cli.run(opts, core);
            return;
        }
        const parsedArgsOpts = parsedArgs.opts;
        // Enable/Disable color on console
        options.enabled = parsedArgsOpts.color ? true : false;

        if (entry) {
            // 将解析出来的entry合并到配置对象中
            parsedArgsOpts.entry = entry;
        }
        // 重点是 cli.run() 将编译后的参数传入，运行cli
        const result = await cli.run(parsedArgsOpts, core);
        if (!result) {
            return;
        }
    } catch (err) {
        // 报错的提示信息
        ...
    }
};
```
`runCLI`主要是解析命令行中是否包含`cli`的简化命令，检查`help`、`version`命令，如果包含输出提前写好的命令使用提示信息，并退出进程。尝试对未匹配的的命令进行解析，最后调用`cli.run()`。
## WebpackCLI类
定义在`lib/webpack-cli.js`中
```js
class WebpackCLI extends GroupHelper {
  constructor() {
    super();      
    this.groupMap = new Map();
    this.compilation = new Compiler(); // 在新建的过程中创建了webpack实例对象
    this.compilerConfiguration = {}; // 最后传给webpack的配置对象
    this.outputConfiguration = {};
  }
  // ... 很多辅助函数
  // 处理命令行中的配置项
  async runOptionGroups(parsedArgs) {
    await Promise.resolve()
      // config 加载配置文件、合并配置对象
      .then(() => this._baseResolver(handleConfigResolution, parsedArgs))
      // 设置mode
      .then(() => this._baseResolver(resolveMode, parsedArgs))
      // 设置outputPath
      .then(() => this._baseResolver(resolveOutput, parsedArgs, outputStrategy))
      // webpack4开始提供的通过命令行的方式配置 webpack --performance-hints warning
      // 详细使用请看https://webpack.js.org/api/cli/#core-flags
      .then(() => this._handleCoreFlags(parsedArgs))
      // 处理basic分组的命令（entry、progress、watch、devtool、name）
      .then(() => this._baseResolver(basicResolver, parsedArgs))
      // 处理resolve相关命令（target、prefetch、 hot、 analyze）
      .then(() => this._baseResolver(resolveAdvanced, parsedArgs))
      // 处理Stats相关命令（stats、json）
      .then(() => this._baseResolver(resolveStats, parsedArgs))
      // 处理help分组的命令（version、help）
      .then(() => this._handleGroupHelper(this.helpGroup));
  }
  // 将命令行传入的参数转换成合并到this.compilerConfiguration
  async processArgs(args, cliOptions) {
    // 对这些参数进行了map分组
    this.setMappedGroups(args, cliOptions);
    // 将help分组的命令详细描述进行打印输出，创建this.groupHelper
    this.resolveGroups(args);
    // 处理命令行中涉及的配置项
    const groupResult = await this.runOptionGroups(args);
    return groupResult;
  }
  async run(args, cliOptions) {
    // 将命令行传入的参数转换成合并到this.compilerConfiguration
    await this.processArgs(args, cliOptions);
    // 调用webpack()创建compiler实例对象
    await this.compilation.createCompiler(this.compilerConfiguration);
    const webpack = await this.compilation.webpackInstance({
        options: this.compilerConfiguration,
        outputOptions: this.outputConfiguration,
    });
    return webpack;
  }
}
```
`WebpackCLI`这个类最重要的是`run`、`processArgs`、`runOptionGroups`这三个函数。
+ `processArgs`函数主要是对解析后的命令行参数进行了分组，如果有`help`的命令创建了一个`groupHelper`实例。
+ `runOptionGroups`函数是加载命令行中的各个配置项并合并到`compilerConfiguration`中
  + `config`: 加载`config`指定的配置文件，获取文件的配置内容（单个对象、对象数组、函数等）进行合并处理，如果未设置`config`则会从默认的文件中加载（例如：`webpack.config.js`等）
  + `mode`: 设置`mode`配置项
  + `outputPath`:设置`outputPath`配置项
  + [命令行配置](https://webpack.js.org/api/cli/#core-flags)
  + 处理`basic`分组的命令：包括（entry、progress、watch、devtool、name）
  + 处理`resolve`相关命令（target、prefetch、 hot、 analyze）
  + 处理`Stats`相关命令（stats、json）
  + 处理`help`分组的命令（version、help）
+ `run`函数调用了上面两个函数，并且创建了`webpack`

到此，在运行`webpack`前获取命令行命令，获取配置文件的配置，合并配置等操作都完成了。更多的关于`webpack-cli`使用请查看[官方文档](https://webpack.js.org/api/cli/)。