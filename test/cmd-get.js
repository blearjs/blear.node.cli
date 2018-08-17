/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-17 10:31
 * @update 2018-08-17 10:31
 */


'use strict';

exports.command = 'get';
exports.describe = '根据配置获取远程信息';

exports.helper = true;
exports.version = true;

exports.options = {
    domain: {
        alias: 'd',
        describe: '请求域名',
        required: true
    },
    ssl: {
        alias: ['s'],
        type: 'boolean'
    }
};

exports.action = function (options) {
    console.log('action get', options);
};


