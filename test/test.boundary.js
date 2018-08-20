/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 * @update 2018年08月17日10:59:25
 */


'use strict';

var expect = require('chai-jasmine').expect;
var sandbox = require('./sandbox');

describe('boundary', function () {

    it('no-package', function (done) {
        sandbox(require.resolve('./scripts/boundary/no-package.js'), [], function (err, data) {
            console.log(data);
            expect(err.message).toBe('the `package` parameter cannot be empty');
            done();
        });
    });

    it('no-command', function (done) {
        sandbox(require.resolve('./scripts/boundary/no-command.js'), [], function (err, data) {
            console.log(data);
            expect(err.message).toBe('at least one `command` method needs to be executed');
            done();
        });
    });

    it('duplicate-root-command', function (done) {
        sandbox(require.resolve('./scripts/boundary/duplicate-root-command.js'), [], function (err, data) {
            console.log(data);
            expect(err.message).toBe('the root command can only be executed once');
            done();
        });
    });

    it('duplicate-command', function (done) {
        sandbox(require.resolve('./scripts/boundary/duplicate-command.js'), [], function (err, data) {
            console.log(data);
            expect(err.message).toBe('cannot add the same command repeatedly');
            done();
        });
    });

});

