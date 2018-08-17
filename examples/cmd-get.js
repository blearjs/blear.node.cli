/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-17 11:29
 * @update 2018-08-17 11:29
 */


'use strict';

exports.command = 'get';
exports.describe = '根据配置获取远程信息';

exports.helper = true;
exports.version = '1.1.100';

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

exports.usages = [
    {
        example: 'bin get'
    },
    {
        example: 'bin get --domain',
        describe: '根据域名获取远程地址的信息以展示给你看'
    }
];

exports.action = function (options) {
    console.log('action get', options);
};

exports.error = function (key, option) {
    console.log('出错啦，呵呵');
    console.log('字段', key);
    console.log('参数', option);
};


