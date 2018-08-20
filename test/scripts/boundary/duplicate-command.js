/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-20 11:17
 * @update 2018-08-20 11:17
 */


'use strict';

var cli = require('../../../src/index');

cli
    .command('abc')
    .command('abc')
    .parse(process.argv, {
        package: {
            version: '1.0.0'
        }
    });


