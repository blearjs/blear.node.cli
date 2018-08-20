/**
 * 组合成 argv
 * @author ydr.me
 * @create 2018-08-20 15:41
 * @update 2018-08-20 15:41
 */


'use strict';


/**
 * 组合成 argv
 * @param args
 * @returns {*}
 */
module.exports = function (args) {
    args = args || [];
    args.unshift('bin');
    args.unshift(process.execPath);
    return args;
};


