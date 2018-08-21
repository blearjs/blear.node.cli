/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-21 07:56
 * @update 2018-08-21 07:56
 */


'use strict';

var Class = require('blear.classes.class');
var util = require('util');
var console = require('blear.node.console');
var access = require('blear.utils.access');
var object = require('blear.utils.object');

var Console = Class.extend({
    constructor: function () {
        this.output = '';
    },

    print: function () {
        this.output += util.format.apply(util, arguments) + '\n';
    },

    color: function () {
        return util.format.apply(util, arguments);
    },

    colors: {},

    empty: function () {
    },

    pretty: function () {
        var args = access.args(arguments);
        args.pop();
        return util.format.apply(util, args);
    }
});

[
    'log',
    'info',
    'error',
    'warn',
    'logWithTime',
    'infoWithTime',
    'warnWithTime',
    'errorWithTime'
].forEach(function (method) {
    Console.prototype[method] = Console.prototype.print;
});

object.each(console.colors, function (color) {
    Console.prototype.colors[color] = Console.prototype.color;
});

[
    'loading',
    'loadingEnd'
].forEach(function (method) {
    Console.prototype[method] = Console.prototype.empty;
});

module.exports = Console;
