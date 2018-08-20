/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 * @update 2018年08月17日10:59:25
 */


'use strict';

var expect = require('chai-jasmine').expect;
var sandbox = require('./sandbox');

describe('base', function () {

    it('no-package', function () {
        sandbox(require.resolve('./scripts/base/no-package.js'), [], function (err, data) {
            expect(err.message).toBe('the `package` parameter cannot be empty');
        });
    });

});

