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

var noop = function () {
    // empty
};
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
     * @param [command] {string|object} 命令，如果为空，则为全局命令，或命令描述
     * @param [describe] {string} 描述
     * @returns {CLI}
     */
    command: function (command, describe) {
        var detail = {};
        var the = this;

        if (typeis.Object(command)) {
            detail = command;
            command = detail.command;
            describe = detail.describe;
        }

        if (command) {
            this[_currentCommander] = {};
            this[_commanderMap][command] = this[_currentCommander];
        } else {
            this[_currentCommander] = this[_globalCommander];
        }

        this[_currentOptions] = {};
        this[_currentCommander].command = command;
        this[_currentCommander].action = noop;
        this[_currentCommander].error = this[_error];
        this[_currentCommander].describe = describe || '';
        this[_currentCommander].usageList = [];
        this[_currentCommander].options = this[_currentOptions];
        this[_commanderList].push(this[_currentCommander]);

        if (detail.action) {
            this.action(detail.action);
        }

        if (detail.error) {
            this.error(detail.error);
        }

        if (detail.versioning) {
            this.versioning(detail.versioning === true ? '' : detail.versioning);
        }

        if (detail.helper) {
            this.helper(detail.helper === true ? '' : detail.helper);
        }

        if (detail.options) {
            object.each(detail.options, function (key, describe) {
                the.option(key, describe);
            });
        }

        if (detail.usages) {
            array.each(detail.usages, function (index, usage) {
                the.usage(usage.example, usage.describe);
            });
        }

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
     * 配置参数
     * @param key
     * @param [option]
     * @param [option.alias]
     * @param [option.default]
     * @param [option.type]
     * @param [option.transform]
     * @param [option.describe]
     * @param [option.action]
     * @returns {CLI}
     */
    option: function (key, option) {
        option = option || {};
        this[_currentOptions][key] = option;
        option.alias = typeis.Array(option.alias)
            ? option.alias
            : (option.alias ? [option.alias] : []);
        option.keys = [key].concat(option.alias);
        option._keys = ['--' + key].concat(option.alias.map(function (key) {
            return '-' + key;
        }));
        option._keyMap = array.reduce(option.keys, function (p, c, i) {
            p[c] = key;
            return p;
        }, {});
        option.transform = typeis.Function(option.transform) ? option.transform : function (val) {
            return val;
        };
        option.type = option.type || 'string';
        option.message = option.message || '`' + key + '` parameter cannot be empty';
        if (typeis.Undefined(option.default)) {
            option.default = option.type === 'boolean' ? false : '';
        }
        return this;
    },

    /**
     * 执行动作
     * @param action
     * @returns {CLI}
     */
    action: function (action) {
        if (typeis.Function(action)) {
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
        if (typeis.Function(error)) {
            this[_currentCommander].error = error;
        }

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
            throw new TypeError('`package` parameter cannot be empty');
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
        this.exec(this[_argv]._[0]);
    },

    /**
     * 执行命令
     * @param command
     * @returns {*}
     */
    exec: function (command) {
        var commander = command ? this[_commanderMap][command] || this[_globalCommander] : this[_globalCommander];
        var options = {};
        var helpOption = commander.options.help;
        var versionOPtion = commander.options.version;
        var the = this;

        if (this[_argv].help && helpOption && typeis.Function(helpOption.action)) {
            return helpOption.action.call(this, command);
        }

        if (this[_argv].version && versionOPtion && typeis.Function(versionOPtion.action)) {
            this[_slogn]();
            return versionOPtion.action.call(this, command);
        }

        delete commander.options.help;
        delete commander.options.version;
        var broken = false;
        object.each(commander.options, function (key, option) {
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
            val = option.transform(val, options);

            if (option.type === 'string' && option.required === true && val.length === 0) {
                broken = true;
                commander.error.call(the, key, option);
                return false;
            }

            options[key] = val;
        });

        if (broken === true) {
            return false;
        }

        this[_slogn]();
        commander.action.call(this, options);
    },

    /**
     * 打印帮助信息
     * @param command
     */
    help: function (command) {
        var commander = this[_commanderMap][command] || this[_globalCommander];
        var commanders = commander === this[_globalCommander] ? this[_commanderList] : [commander];
        var padding = 2;

        this[_slogn]();

        // print usage
        console.log(console.pretty('Usage:', ['grey', 'underline']));
        var usagePrints = [];
        array.each(commanders, function (index, commander) {
            array.each(commander.usageList, function (index, usage) {
                usagePrints.push([usage.example, usage.describe]);
            });
        });
        this[_print](padding, usagePrints);

        // print commands
        console.log();
        console.log(console.pretty('Commands:', ['grey', 'underline']));
        var commandPrints = [];
        array.each(commanders, function (index, commander) {
            if (commander.global) {
                return;
            }

            commandPrints.push([commander.command, commander.describe]);
        });
        this[_print](padding, commandPrints);

        // print options
        console.log();
        console.log(console.pretty('Options:', ['grey', 'underline']));
        var optionsPrints = [];
        object.each(commander.options, function (key, option) {
            optionsPrints.push([option._keys.join(', '), option.describe || '']);
        });
        this[_print](padding, optionsPrints);
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
