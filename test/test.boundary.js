/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 * @update 2018年08月17日10:59:25
 */


'use strict';

var expect = require('chai-jasmine').expect;
var Cli = require('../src/cli.class');
var argv = require('./argv');

describe('boundary', function () {

    it('no-package', function () {
        var cli = new Cli();

        expect(function () {
            cli.parse(argv());
        }).toThrowError('the `package` parameter cannot be empty');
    });

    it('duplicate-root-command', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .command()
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the root command can only be executed once');
    });

    it('duplicate-command', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command('abc')
                .command('abc')
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('cannot add the `abc` method with the same name');
    });

    it('method-root-command', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .method('abc')
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('cannot add method to root command');
    });

    it('root-command-method-action', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .action('abc', function () {

                })
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('cannot add method action to root command');
    });

    it('unfunction-action', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .action(null)
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the `action` parameter must be a function');
    });

    it('undefined-method-action', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command('abc')
                .action('def', function () {

                })
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the `def` method of the `abc` command does not exist');
    });

    it('unfunction-error', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .error(null)
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the `error` parameter must be a function');
    });

    it('option-for-unconfigure-method', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .command('abc')
                .option('def', {
                    for: 'xyz'
                })
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the `xyz` method of the `abc` command pointed to by `option` does not exist');
    });

    it('option-for-duplicate-method', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .command('abc')
                .method('def')
                .option('xyz')
                .option('xyz')
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the `option` of the `def` method of the `abc` command already exists');
    });

    it('duplicate-command-option', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .command('abc')
                .option('def')
                .option('def')
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });
        }).toThrowError('the `def` option of the `abc` command already exists');
    });

    it('duplicate-option-alias', function () {
        var cli = new Cli();

        expect(function () {
            cli
                .command()
                .command('abc')
                .option('def', {
                    alias: 'd'
                })
                .option('dfg', {
                    alias: 'd'
                })
                .parse(argv(), {
                    package: {
                        version: '1.0.0'
                    }
                });

        }).toThrowError('the `d` alias of the `dfg` option of the `abc` command already exists');
    });

});

