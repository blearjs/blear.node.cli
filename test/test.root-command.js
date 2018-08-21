/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-20 14:51
 * @update 2018-08-20 14:51
 */


'use strict';

var Cli = require('../src/cli.class');
var argv = require('./argv');

var options = {
    bin: 'bin',
    package: {
        name: 'bin',
        version: '1.2.3'
    }
};

describe('root-command', function () {

    it('default', function () {
        var cli = new Cli();

        cli.command().parse(argv(), options);
    });

});


