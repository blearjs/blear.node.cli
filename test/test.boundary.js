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

    it('no-package', function () {
        sandbox(require.resolve('./scripts/boundary/no-package.js'), [], function (err, data) {
            console.log(data);
            expect(err.message).toBe('the `package` parameter cannot be empty');
        });
    });

    it('no-command', function () {
        sandbox(require.resolve('./scripts/boundary/no-command.js'), [], function (err, data) {
            console.log(data);
            expect(err.message).toBe('at least one `command` method needs to be executed');
        });
    });

});

