/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-16 10:19
 * @update 2018-08-16 10:19
 */


'use strict';

var Class = require('blear.classes.class');
var object = require('blear.utils.object');
var access = require('blear.utils.access');
var array = require('blear.utils.array');
var string = require('blear.utils.string');
var typeis = require('blear.utils.typeis');
var version = require('blear.utils.version');
var console = require('blear.node.console');
var request = require('blear.node.request');
var path = require('path');
var minimist = require('minimist');

var METHOD_OPTIONS_SUFFIX = '-options';
var defaults = {
    /**
     * 键显示的长度
     * @type number
     */
    keyLength: 30,

    /**
     * 命令名称
     * @type string
     */
    bin: '',

    /**
     * 命令模块的 package.json 描述
     * @type null | object
     */
    package: null
};
var CLI = Class.extend({
    constructor: function () {
        this[_bin] = null;
        this[_banner] = null;
        this[_globalCommander] = {
            global: true
        };
        this[_commanderMap] = {};
        this[_commanderList] = [];
    },

    /**
     * 配置 banner 信息
     * @param banner {string}
     * @returns {CLI}
     */
    banner: function (banner) {
        this[_banner] = banner;
        return this;
    },

    /**
     * 新增命令
     * @param [command] {string} 命令
     * @param [describe] {string} 描述
     * @returns {CLI}
     */
    command: function (command, describe) {
        if (command) {
            this[_currentCommander] = {};
            this[_commanderMap][command] = this[_currentCommander];
        } else {
            this[_currentCommander] = this[_globalCommander];
        }

        this[_currentCommander].command = command;
        this[_currentCommander].action = null;
        this[_currentCommander].methodActions = {};
        this[_currentCommander].error = this[_error];
        this[_currentCommander].describe = describe || '';
        this[_currentCommander].usageList = [];
        this[_currentCommander].methods = this[_currentMethods] = {};
        this[_currentCommander].options = this[_currentOptions] = {};
        this[_commanderList].push(this[_currentCommander]);

        return this;
    },

    /**
     * 版本配置
     * @param [describe] {string}
     * @returns {CLI}
     */
    versioning: function (describe) {
        return this.option('version', {
            alias: ['v', 'V'],
            describe: describe || 'print version information',
            for: null,
            action: this.version
        });
    },

    /**
     * 帮助配置
     * @param [describe] {string}
     * @returns {CLI}
     */
    helper: function (describe) {
        return this.option('help', {
            alias: ['h', 'H'],
            describe: describe || 'print help information',
            for: null,
            action: this.help
        });
    },

    /**
     * 添加用法
     * @param example {string}
     * @param [describe] {string}
     * @returns {CLI}
     */
    usage: function (example, describe) {
        this[_currentCommander].usageList.push({
            example: example,
            describe: describe || ''
        });
        return this;
    },

    /**
     * 添加方法
     * @param method
     * @param [describe]
     * @returns {CLI}
     */
    method: function (method, describe) {
        if (this[_currentCommander].global) {
            throw new Error('cannot add method to global command');
        }

        this[_currentMethods][method] = this[_currentMethod] = {
            method: method,
            describe: describe || ''
        };
        this[_currentCommander][method + METHOD_OPTIONS_SUFFIX] = {};
        return this;
    },

    /**
     * 配置参数
     * @param key
     * @param [option] {object | string} 配置，或描述
     * @param [option.alias] {string | array} 别名，可以是多个
     * @param [option.default] {string} 默认值
     * @param [option.type] {string} 类型，目前仅支持 string、Boolean
     * @param [option.transform] {function} 转换
     * @param [option.describe] {string} 描述
     * @param [option.action] {function} 执行动作
     * @param [option.required=false] {boolean} 是否必填
     * @param [option.message] {string} 参数不符合要求时显示
     * @param [option.for] {string} 执行具体 method，为 null 指向 command
     * @returns {CLI}
     */
    option: function (key, option) {
        if (typeis.String(option)) {
            option = {
                describe: option
            };
        }

        var commander = this[_currentCommander];
        option = option || {};

        if (typeis.String(option.alias)) {
            option.alias = [option.alias];
        }
        option.alias = option.alias || [];

        key = string.separatorize(key);
        option.keys = [key].concat(option.alias);
        option._keys = ['--' + key].concat(option.alias.map(function (key) {
            return '-' + key;
        }));
        option._keyMap = array.reduce(option.keys, function (p, c, i) {
            p[c] = key;
            return p;
        }, {});

        if (!typeis.Function(option.transform)) {
            option.transform = function (val, option, args, method) {
                return val;
            };
        }

        option.type = option.type || 'string';
        option.required = Boolean(option.required);
        option.message = option.message || '`' + key + '` parameter cannot be empty';

        option.describe = option.describe || '';

        if (!typeis.Null(option.for) && !typeis.String(option.for)) {
            if (this[_currentMethod]) {
                option.for = this[_currentMethod].method;
            } else {
                option.for = null;
            }
        }

        if (typeis.Undefined(option.default)) {
            option.default = option.type === 'boolean' ? false : '';
        }

        if (option.for !== null) {
            var method = this[_currentMethods][option.for];

            if (!method) {
                throw new Error('the `' + option.for + '` method does not exist');
            }

            var k = method.method + METHOD_OPTIONS_SUFFIX;
            commander[k][key] = option;
            return this;
        }

        this[_currentOptions][key] = option;
        return this;
    },

    /**
     * 执行动作
     * @param [method] {string} 指定方法的动作
     * @param action {function} 动作
     * @returns {CLI}
     */
    action: function (method, action) {
        var args = access.args(arguments);

        if (args.length === 1) {
            action = args[0];
            method = null;
        }

        if (!typeis.Function(action)) {
            throw new Error('the `action` parameter must be a function');
        }

        if (method) {
            if (!this[_currentMethods][method]) {
                throw new Error('the `' + method + '` method does not exist');
            }

            this[_currentCommander].methodActions[method] = action;
        } else {
            this[_currentCommander].action = action;
        }

        return this;
    },

    /**
     * 参数有错误
     * @param error
     * @returns {CLI}
     */
    error: function (error) {
        if (!typeis.Function(error)) {
            throw new Error('the `error` parameter must be a function');
        }

        this[_currentCommander].error = error;
        return this;
    },

    /**
     * 解析入参
     * @param [argv]
     * @param [options]
     * @param [options.keyLength]
     * @param [options.package]
     * @returns {CLI}
     */
    parse: function (argv, options) {
        var args = access.args(arguments);

        switch (args.length) {
            case 0:
                argv = process.argv;
                break;

            case 1:
                if (typeis.Array(args[0])) {
                    argv = args[0];
                } else {
                    options = args[0];
                    argv = process.argv;
                }
                break;
        }

        if (!options.package) {
            throw new TypeError('the `package` parameter cannot be empty');
        }

        this[_options] = object.assign({}, defaults, options);
        this[_bin] = this[_options].bin || path.basename(argv[1]);
        this[_argv] = minimist(argv.slice(2), {
            boolean: ['version', 'help'],
            alias: {
                version: ['v', 'V'],
                help: ['h', 'H']
            }
        });
        var command = this[_argv]._.shift();
        var method = this[_argv]._.shift();
        this.exec(command, method);
    },

    /**
     * 执行命令
     * @param command {string}
     * @param [method] {string}
     * @returns {*}
     */
    exec: function (command, method) {
        var commander = command ? this[_commanderMap][command] || this[_globalCommander] : this[_globalCommander];
        var args = {};
        var commanderOptions = commander.options;
        var helpOption = commanderOptions.help;
        var versionOPtion = commanderOptions.version;
        var the = this;
        var methodOptions;

        if (method) {
            methodOptions = commander[method + METHOD_OPTIONS_SUFFIX];
        }

        if (this[_argv].help && helpOption) {
            this[_slogn]();
            return helpOption.action.call(this, command, method);
        }

        if (this[_argv].version && versionOPtion) {
            this[_slogn]();
            return versionOPtion.action.call(this, command, method);
        }

        delete commanderOptions.help;
        delete commanderOptions.version;

        if (methodOptions) {
            delete methodOptions.help;
            delete methodOptions.version;
        }

        var eachOptions = function (options) {
            if (!options) {
                return false;
            }

            var broken = false;
            object.each(options, function (key, option) {
                if (broken === true) {
                    return false;
                }

                var val = null;

                array.each(option.keys, function (index, k) {
                    var v = the[_argv][k];

                    if (v === undefined) {
                        return;
                    }

                    if (option.type === 'boolean') {
                        v = Boolean(v);
                    } else {
                        if (v === true) {
                            v = '';
                        }

                        v = string.ify(v);
                    }

                    if (typeis(v) === option.type) {
                        key = option._keyMap[k];
                        val = v;
                        return false;
                    }
                });

                val = val || option.default;
                val = option.transform(val, args, method);

                if (option.type === 'string' && option.required === true && val.length === 0) {
                    broken = true;
                    commander.error.call(the, key, option, args, method);
                    return false;
                }

                args[key] = val;
            });
            return broken;
        };

        if (eachOptions(commanderOptions)) {
            return false;
        }

        if (eachOptions(methodOptions)) {
            return false;
        }

        this[_slogn]();

        var action = commander.action;

        if (method) {
            action = commander.methodActions[method] || action;
        }

        if (!typeis.Function(action)) {
            throw new Error('`action` of the `' + command + '` command is not specified');
        }

        action.call(this, args, method);
    },

    /**
     * 打印帮助信息
     * @param command
     * @param [method]
     */
    help: function (command, method) {
        var commander = this[_commanderMap][command] || this[_globalCommander];
        var commanders = commander === this[_globalCommander] ? this[_commanderList] : [commander];
        var padding = 2;
        var titleColors = ['inverse'];
        var titleLength = 12;
        var titlePadding = string.repeat(' ', padding);
        var buildTitle = function (list, name) {
            var endding = ':';

            if (list.length > 1) {
                endding = 's:';
            }

            return console.pretty(
                string.padEnd(
                    titlePadding + name + endding,
                    titleLength
                ), titleColors
            );
        };

        // print usage
        var usagePrints = [];
        array.each(commanders, function (index, commander) {
            array.each(commander.usageList, function (index, usage) {
                usagePrints.push([usage.example, usage.describe]);
            });
        });
        if (usagePrints.length) {
            console.log(buildTitle(usagePrints, 'Usage'));
            this[_print](padding, usagePrints);
            console.log();
        }

        // print commands
        var commandPrints = [];
        array.each(commanders, function (index, commander) {
            if (commander.global) {
                return;
            }

            commandPrints.push([commander.command, commander.describe]);
        });
        if (commandPrints.length) {
            console.log(buildTitle(commandPrints, 'Command'));
            this[_print](padding, commandPrints);
            console.log();
        }

        // print methods
        var methodsPrints = [];
        if (method) {
            var methodDetail = commander.methods[method];
            methodsPrints.push([methodDetail.method, methodDetail.describe]);
        } else {
            object.each(commander.methods, function (_, detail) {
                methodsPrints.push([detail.method, detail.describe]);
            });
        }
        if (methodsPrints.length) {
            console.log(buildTitle(methodsPrints, 'Method'));
            this[_print](padding, methodsPrints);
            console.log();
        }

        // print options
        var optionsPrints = [];
        object.each(commander.options, function (key, option) {
            optionsPrints.push([option._keys.join(', '), option.describe]);
        });
        if (method) {
            var methodOptions = commander[method + METHOD_OPTIONS_SUFFIX];
            object.each(methodOptions, function (key, option) {
                optionsPrints.push([option._keys.join(', '), option.describe]);
            });
        }
        if (optionsPrints.length) {
            console.log(buildTitle(optionsPrints, 'Option'));
            this[_print](padding, optionsPrints);
        }
    },

    /**
     * 输出版本并进行版本比较
     */
    version: function () {
        console.log('local version', this[_options].package.version);
        checkVersion(this[_options].package);
    }
});
var sole = CLI.sole;
var prot = CLI.prototype;
var _options = sole();
var _bin = sole();
var _banner = sole();
var _globalCommander = sole();
var _commanderMap = sole();
var _commanderList = sole();
var _currentCommander = sole();
var _currentMethod = sole();
var _currentMethods = sole();
var _currentOptions = sole();
var _argv = sole();
var _slogn = sole();
var _print = sole();
var _error = sole();

prot[_slogn] = function () {
    if (this[_banner]) {
        console.log(this[_banner]);
    }
};

/**
 * 缩进打印
 * @param indentLength
 * @param list
 */
prot[_print] = function (indentLength, list) {
    var lines = [];
    var keyLength = this[_options].keyLength;
    var space = '  ';
    var spaceLen = space.length;
    var indent = string.repeat(' ', indentLength);
    // indent + space + key + space + val;
    var valIndent = string.repeat(' ', indentLength + spaceLen + keyLength);

    array.each(list, function (index, line) {
        var key = line[0];
        var val = line[1];
        var keyLen = key.length;

        // key 过长
        if (keyLen > keyLength) {
            lines.push(
                [
                    indent,
                    console.colors.bold(key)
                ].join('')
            );

            if (val.length) {
                lines.push(indentText(valIndent, val, true));
            }
        } else {
            lines.push(
                [
                    indent,
                    console.colors.bold(string.padEnd(key, keyLength, ' ')),
                    space,
                    indentText(valIndent, val, false)
                ].join('')
            );
        }
    });

    console.log(lines.join('\n'));
};

/**
 * 打印错误信息
 * @param key
 * @param option
 */
prot[_error] = function (key, option) {
    this[_slogn]();
    console.error(option.message);
};


CLI.defaults = defaults;
module.exports = CLI;

// =============================


/**
 * 文本缩进
 * @param indent
 * @param text
 * @param indentFirstLine
 * @returns {string}
 */
function indentText(indent, text, indentFirstLine) {
    var lines = text.split(/[\n\r]/g);
    var list = [];

    array.each(lines, function (index, line) {
        if (index === 0 && !indentFirstLine) {
            list.push(line);
            return;
        }

        list.push(
            indent + line
        );
    });

    return list.join('\n');
}


/**
 * 版本检查
 * @param pkg
 */
function checkVersion(pkg) {
    console.loading();
    request({
        url: 'http://registry.npm.taobao.org/' + pkg.name
    }, function (err, body) {
        if (err) {
            console.loadingEnd();
            return
        }

        try {
            var json = JSON.parse(body);
        } catch (err) {
            console.loadingEnd();
            return;
        }

        var latestVersion = json['dist-tags'] && json['dist-tags'].latest || '';

        if (!latestVersion) {
            console.loadingEnd();
            return;
        }

        console.loadingEnd();
        var currentVersion = pkg.version;
        if (version.lt(currentVersion, latestVersion)) {
            console.log(
                console.pretty(
                    'Update available',
                    currentVersion,
                    '→',
                    latestVersion,
                    [
                        'bold',
                        'red'
                    ]
                )
            );
        }
    });
}
