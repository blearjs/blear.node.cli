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

describe('root-command', function () {

    it('default', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.get()).toBe('');
    });

    it('help', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .action(function () {
                cli.help();
            })
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.get()).toBe('');
    });

    it('helper', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .helper()
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.get()).toBe('');
    });

    it('helper + action', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .helper()
            .action(function () {
                cli.help();
            })
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toEqual(3);
        expect(fakeConsole.get()).toMatch(/^\s{2}Option:/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--help/m);
        expect(fakeConsole.get()).toMatch(/print help information/);
    });

    it('helper assgin + action', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .helper('help message')
            .action(function () {
                cli.help();
            })
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toEqual(3);
        expect(fakeConsole.get()).toMatch(/^\s{2}Option:/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--help/m);
        expect(fakeConsole.get()).toMatch(/help message$/m);
    });

    it('option + helper assgin + action', function () {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .helper('help message')
            .option('abc')
            .option('def', 'DEF')
            .option('xyz', {
                describe: 'XYZ'
            })
            .action(function () {
                cli.help();
            })
            .parse(argv(), options);
        console.log(fakeConsole.get());
        expect(fakeConsole.lines()).toEqual(6);
        expect(fakeConsole.get()).toMatch(/^\s{2}Options:/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--help/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--abc/m);
        expect(fakeConsole.get()).toMatch(/^\s{2}--def/m);
        expect(fakeConsole.get()).toMatch(/DEF$/m);
        expect(fakeConsole.get()).toMatch(/XYZ$/m);
    });

});


