/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-20 08:13
 * @update 2018-08-20 08:13
 */


'use strict';

var cli = require('../../../src/index');

cli
    .command()
    .command('abc')
    .method('def')
    .option('xyz')
    .option('xyz')
    .parse(process.argv, {
        package: {
            version: '1.0.0'
        }
    });


