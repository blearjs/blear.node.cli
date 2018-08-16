/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-16 10:23
 * @update 2018-08-16 10:23
 */


'use strict';

var cli = require('../src/index');

cli
    .command()
    // .useage('')
    .help()
    .version('1.0.0')
    .action(function (options) {
        if (options.help) {
            cli.help();
        } else if (options.version) {

        }
    })
    // .command('init')
    // .option('config', {
    //     alias: ['c', 'C'],
    //     type: 'string'
    // })
    // .option('ssl', {
    //     alias: 's',
    //     type: 'boolean'
    // })
    // .option('path', {
    //     alias: 'p',
    //     type: 'string',
    //     default: 'abc',
    //     transform: function (val, options) {
    //         return val + options.config;
    //     }
    // })
    // .option('help')
    // .action(function (options) {
    //     console.log('action init', options);
    // })
    // .command('get')
    // .option('ssl', {
    //     alias: ['s'],
    //     type: 'boolean'
    // })
    // .action(function (options) {
    //     console.log('action get', options);
    // })
    .parse();
