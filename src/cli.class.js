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
var console = require('blear.node.console');
var path = require('path');
var minimist = require('minimist');

var noop = function () {
    // empty
};
var defaults = {
    keyLength: 30
};
var CLI = Class.extend({
    constructor: function () {
        this[_bin] = null;
        this[_banner] = null;
        this[_globalCommander] = {};
        this[_commanders] = {};
    },

    /**
     * 配置 banner 信息
     * @param banner
     * @returns {CLI}
     */
    banner: function (banner) {
        this[_banner] = banner;
        return this;
    },

    /**
     * 新增命令
     * @param [command] {string} 命令，如果为空，则为全局命令
     * @param [desc] {string} 描述
     * @returns {CLI}
     */
    command: function (command, desc) {
        if (command) {
            this[_currentCommander] = {};
            this[_commanders][command] = this[_currentCommander];
        } else {
            this[_currentCommander] = this[_globalCommander];
        }

        this[_currentOptions] = {};
        this[_currentCommander].command = command;
        this[_currentCommander].action = noop;
        this[_currentCommander].desc = desc || '';
        this[_currentCommander].options = this[_currentOptions];
        return this;
    },

    /**
     * 版本配置
     * @param version
     * @returns {CLI}
     */
    version: function (version) {
        var ver = version;
        if (typeis.String(version)) {
            ver = function () {
                console.log(version);
            }
        }

        return this.option('version', {
            alias: ['v', 'V'],
            desc: 'output the version number',
            action: ver
        });
    },

    /**
     * 帮助配置
     * @returns {CLI}
     */
    helper: function () {
        return this.option('help', {
            alias: ['h', 'H'],
            desc: 'output usage information',
            action: this.help
        });
    },

    /**
     * 配置参数
     * @param key
     * @param [desc]
     * @param [desc.alias]
     * @param [desc.default]
     * @param [desc.type]
     * @param [desc.transform]
     * @param [desc.desc]
     * @param [desc.action]
     * @returns {CLI}
     */
    option: function (key, desc) {
        desc = desc || {};
        this[_currentOptions][key] = desc;
        desc.alias = typeis.Array(desc.alias) ? desc.alias : [desc.alias];
        desc.keys = [key].concat(desc.alias);
        desc._keys = ['--' + key].concat(desc.alias.map(function (key) {
            return '-' + key;
        }));
        desc.transform = typeis.Function(desc.transform) ? desc.transform : function (val) {
            return val;
        };
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
     * 解析入参
     * @param [argv]
     * @param [options]
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

        this[_options] = object.assign({}, defaults, options);
        this[_bin] = path.basename(argv[1]);
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
        var commander = this[_commanders][command] || this[_globalCommander];
        var options = {};
        var helpOption = commander.options.help;
        var versionOPtion = commander.options.version;
        var the = this;

        if (this[_argv].help && helpOption && typeis.Function(helpOption.action)) {
            return helpOption.action.call(this, command);
        }

        if (this[_argv].version && versionOPtion && typeis.Function(versionOPtion.action)) {
            return versionOPtion.action.call(this, command);
        }

        delete commander.options.help;
        delete commander.options.version;
        object.each(commander.options, function (key, desc) {
            var val = null;

            array.each(desc.keys, function (index, k) {
                var v = the[_argv][k];

                if (!typeis.Boolean(v) && !typeis.Undefined(v)) {
                    v = String(v);
                }

                if (desc.type === 'boolean' && !typeis.Undefined(v)) {
                    v = Boolean(v);
                }

                if (typeis(v) === desc.type) {
                    val = v;
                    return false;
                }
            });

            val = val || desc.default;
            options[key] = desc.transform(val, options);
        });

        commander.action.call(this, options);
    },

    /**
     * 打印帮助信息
     * @param command
     */
    help: function (command) {
        var commander = this[_commanders][command] || this[_globalCommander];
        var commanders = commander === this[_globalCommander] ? this[_commanders] : [commander];

        if (this[_banner]) {
            console.log(this[_banner]);
        }

        // print usage
        console.log(console.pretty('Usage:', ['bold', 'underline']));
        console.log('  ', this[_bin], '[options]');
        console.log('  ', this[_bin], '<command> [options]');

        // print commands
        console.log();
        console.log(console.pretty('Commands:', ['bold', 'underline']));
        var commandPrints = [];
        object.each(commanders, function (index, commander) {
            commandPrints.push([commander.command, commander.desc || '']);
        });
        this[_print](2, commandPrints);

        // print options
        console.log();
        console.log(console.pretty('Options:', ['bold', 'underline']));
        var optionsPrints = [];
        object.each(commander.options, function (key, desc) {
            optionsPrints.push([desc._keys.join(', '), desc.desc || '']);
        });
        this[_print](2, optionsPrints);
    }
});
var sole = CLI.sole;
var prot = CLI.prototype;
var _options = sole();
var _bin = sole();
var _banner = sole();
var _globalCommander = sole();
var _commanders = sole();
var _currentCommander = sole();
var _currentOptions = sole();
var _argv = sole();
var _print = sole();

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
                    key
                ].join('')
            );
            lines.push(indentText(valIndent, val, true));
        } else {
            lines.push(
                [
                    indent,
                    string.padEnd(key, keyLength, ' '),
                    space,
                    indentText(valIndent, val, false)
                ].join('')
            );
        }
    });

    console.log(lines.join('\n'));
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
