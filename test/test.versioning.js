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

describe('versioning', function () {

    it('notfound', function (done) {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .versioning()
            .parse(argv('-v'), {
                package: {
                    name: randomStr(),
                    version: '1.2.3'
                }
            });

        setTimeout(function () {
            console.log(fakeConsole.get());
            expect(fakeConsole.get()).toEqual('local version 1.2.3\n');
            done();
        }, 2000);
    });

    it('found', function (done) {
        var cli = new Cli();
        var fakeConsole = new FakeConsole();

        cli.$$injectConsole$$(fakeConsole);
        cli
            .command()
            .versioning()
            .parse(argv('-v'), {
                package: {
                    name: 'blear.ui',
                    version: '1.0.0'
                }
            });

        setTimeout(function () {
            console.log(fakeConsole.get());

            if (fakeConsole.lines() === 2) {
                matchHelper(fakeConsole, [
                    /^local version 1\.0\.0$/
                ]);
            } else if (fakeConsole.lines() === 3) {
                matchHelper(fakeConsole, [
                    /^local version 1\.0\.0$/,
                    /^update available 1\.0\.0 → [\d.]+$/
                ]);
            }

            done();
        }, 2000);
    });

});


function randomStr() {
    return Math.random().toString(16).slice(2) + Date.now();
}
