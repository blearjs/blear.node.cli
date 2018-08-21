/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-20 14:51
 * @update 2018-08-20 14:51
 */


'use strict';

var Cli = require('../src/cli.class');
var argv = require('./argv');
var FakeConsole = require('./fake-console.class');
var string = require('blear.utils.string');

var options = {
    bin: 'bin',
    package: {
        name: 'bin',
        version: '1.2.3'
    }
};

describe('helper', function () {

    it('root command', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = 'banner' + Date.now();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(2);
        expect(fakeConsole.get()).toMatch(bannerReg(banner));
    });

});


/**
 * 生成 banner 正则表达式
 * @param banner
 * @returns {RegExp}
 */
function bannerReg(banner) {
    return new RegExp('^' + string.escapeRegExp(banner) + '$', 'm');
}

