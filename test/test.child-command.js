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

var options = {
    bin: 'bin',
    package: {
        name: 'bin',
        version: '1.2.3'
    }
};

describe('child-command', function () {

    it('default', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .action(function () {
                cli.help();
            })
            .command('abc')
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(3);
        expect(fakeConsole.get()).toMatch(/^\s{2}Command:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}abc\s+$/m);
    });

    it('multiple command', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .action(function () {
                cli.help();
            })
            .command('abc')
            .command('def', 'DEF')
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toBe(4);
        expect(fakeConsole.get()).toMatch(/^\s{2}Commands:\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}abc\s+$/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}def\s+DEF$/m);
    });

});


