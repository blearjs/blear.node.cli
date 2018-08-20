/**
 * 沙盒内执行命令
 * @author ydr.me
 * @create 2018-08-20 07:46
 * @update 2018-08-20 07:46
 */


'use strict';

var spawn = require('child_process').spawn;

/**
 * 沙盒内执行命令
 * @param script
 * @param args
 * @returns {*}
 */
module.exports = function (script, args, callback) {
    args.unshift(script);
    var child = spawn(
        process.execPath,
        args
    );

    var data = '';
    child.stdout.on('data', function (chunk) {
        data += chunk.toString();
    });
    child.stderr.on('data', function (chunk) {
        data += chunk.toString();
    });
    child.on('close', function (code) {
        if (code === 0) {
            return callback(null, data);
        }

        callback(new Error(code), data);
    });
};


