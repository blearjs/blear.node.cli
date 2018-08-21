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

describe('banner', function () {

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

    it('root command helper', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = 'banner' + Date.now();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .helper()
            .parse(argv('-H'), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(4);
        expect(fakeConsole.get()).toMatch(bannerReg(banner));
        expect(fakeConsole.get()).toMatch(/^\s{2}Option:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--help, -h, -H\s+print help information$/m);
    });

    it('child command', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = 'banner' + Date.now();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .command('abc')
            .parse(argv('abc'), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(2);
        expect(fakeConsole.get()).toMatch(bannerReg(banner));
    });

    it('child command helper', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = 'banner' + Date.now();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .command('abc')
            .helper()
            .parse(argv('abc', '-H'), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(7);
        expect(fakeConsole.get()).toMatch(bannerReg(banner));
        expect(fakeConsole.get()).toMatch(/^\s{2}Command:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}abc\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}Option:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--help, -h, -H\s+print help information$/m);
    });

    it('child command method', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = 'banner' + Date.now();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .command('abc')
            .method('def')
            .parse(argv('abc', 'def'), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(2);
        expect(fakeConsole.get()).toMatch(bannerReg(banner));
    });

    it('child command method helper', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = 'banner' + Date.now();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .command('abc')
            .method('def')
            .helper()
            .parse(argv('abc', 'def', '-H'), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(10);
        expect(fakeConsole.get()).toMatch(bannerReg(banner));
        expect(fakeConsole.get()).toMatch(/^\s{2}Command:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}abc\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}Method:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}def\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}Option:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--help, -h, -H\s+print help information$/m);
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

