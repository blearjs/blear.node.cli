/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-16 10:19
 * @update 2018-08-16 10:19
 */


'use strict';

var Class = require('blear.classes.class');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var console = require('blear.node.console');
var path = require('path');
var minimist = require('minimist');

var noop = function () {
    // empty
};
var defaults = {};
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
     * @returns {CLI}
     */
    parse: function (argv) {
        // console.log(this[_commanders]);
        // console.log(this[_globalCommander]);
        argv = argv || process.argv;
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

        // console.log(commander, this[_argv]);
        // console.log(helpOption);

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
                var v = this[_argv][k];

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

        console.log(console.pretty('Usage:', ['bold', 'underline']));
        console.log('  ', this[_bin], '[options]');
        console.log('  ', this[_bin], '<command> [options]');
        console.log();
        console.log(console.pretty('Commands:', ['bold', 'underline']));

        object.each(commanders, function (index, commander) {
            console.log('  ', commander.command, commander.desc);
        });

        console.log();
        console.log(console.pretty('Options:', ['bold', 'underline']));
        object.each(commander.options, function (key, desc) {
            console.log('  ', desc._keys.join(', '), desc.desc);
        });
    }
});
var sole = CLI.sole;
var _bin = sole();
var _banner = sole();
var _globalCommander = sole();
var _commanders = sole();
var _currentCommander = sole();
var _currentOptions = sole();
var _argv = sole();


CLI.defaults = defaults;
module.exports = CLI;


