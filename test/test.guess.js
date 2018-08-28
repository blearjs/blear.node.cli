/**
 * test guess
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

describe('guess', function () {

    it('command', function (done) {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();
        var banner = Date.now() + '.' + Math.random();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .banner(banner)
            .command()
            .guess(function (command) {
                expect(this).toBe(cli);
                expect(command).toBe('abc');
                expect(fakeConsole.get()).toEqual(banner + '\n');
                done();
            })
            .parse(argv('abc'), options);
    });

});

