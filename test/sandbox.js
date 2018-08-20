/**
 * 沙盒内执行命令
 * @author ydr.me
 * @create 2018-08-20 07:46
 * @update 2018-08-20 07:46
 */


'use strict';

var spawn = require('child_process').spawn;
var Error = require('blear.classes.error');

/**
 * 沙盒内执行命令
 * @param script
 * @param args
 * @param callback
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

        var message = data.match(/Error: (.*)$/m)[1];
        callback(new Error({
            code: code,
            pid: child.pid,
            message: message
        }), data);
    });
};


