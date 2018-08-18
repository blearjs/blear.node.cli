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
exports.versioning = true;

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

exports.methods = {
    op: '呵呵',
    dp: true
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

exports.action = function (args, method, methods) {
    console.log('action get', args, method, methods);
};

exports.error = function (key, option, args, method, methods) {
    console.log('出错啦，呵呵');
    console.log('字段', key);
    console.log('配置', option);
    console.log('参数', args);
    console.log('方法', method);
};


