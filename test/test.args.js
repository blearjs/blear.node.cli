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
var matchHelper = require('./match-helper');

var options = {
    bin: 'bin',
    package: {
        name: 'bin',
        version: '1.2.3'
    }
};

describe('args', function () {

    it('字符串 可填', function (done) {
        var cli = new Cli();

        cli
            .command()
            .option('opt1', {
                type: 'string'
            })
            .option('opt2', {
                type: 'string'
            })
            .option('opt3', {
                type: 'string'
            })
            .action(function (args) {
                expect(args.opt1).toBe('1');
                expect(args.opt2).toBe('');
                expect(args.opt3).toBe('');
                done();
            })
            .parse(argv('--opt1', '1', '--opt2'), options);
    });

    it('字符串 必填', function (done) {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var called = false;

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .option('opt1', {
                type: 'string'
            })
            .option('opt2', {
                type: 'string',
                required: true
            })
            .option('opt3', {
                type: 'string',
                required: true,
                message: 'opt3 字段必填'
            })
            .action(function (args) {
                called = true;
            });

        setTimeout(function () {
            cli.parse(argv('--opt1', '1', '--opt2'), options);
            console.log(fakeConsole.get());
            expect(called).toBe(false);
            expect(fakeConsole.get()).toBe('`opt2` parameter cannot be empty\n');

            fakeConsole.clear();
            cli.parse(argv('--opt1', '1', '--opt2', '2'), options);
            console.log(fakeConsole.get());
            expect(fakeConsole.get()).toBe('opt3 字段必填\n');
            done();
        }, 10);
    });

});

