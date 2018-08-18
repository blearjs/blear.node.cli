/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-17 11:28
 * @update 2018-08-17 11:28
 */


'use strict';

var cli = require('../src/index');
var console = require('blear.node.console');

cli
    .banner(
        console.format(
            console.pretty('TEST BIN', ['red']),
            console.pretty('HAHAHA', ['yellow']),
            '\n'
        )
    )
    .command()
    .helper()
    .versioning('输出版本号，呵呵')
    .usage(
        'bin [options]'
    )
    .usage(
        'bin <comm' + '' + 'and> [options] [looooooooooooooooooooooooooong]'
    )
    .usage(
        'bin news --show-looooooooooooooooooooooooooooooooong',
        'The meeting emphasized that the vaccine is related to the health of\n' +
        'the people and to public health and national security. This problem\n' +
        'vaccine case is a serious violation of the law and the production of\n' +
        'vaccines by a vaccine producer who is profitable, violates national\n' +
        'drug standards and quality control regulations, fabricates false\n' +
        'production inspection records, dereliction of duty of local government\n' +
        'and regulatory authorities, and individual staff misconduct. In major\n' +
        'cases, the circumstances are serious and the nature is bad, causing\n' +
        'serious adverse effects. It not only exposes many loopholes such as\n' +
        'inadequate supervision, but also reflects institutional defects in the\n' +
        'production and use of vaccines.'
    )
    .usage(
        'bin --version',
        '显示版本号会议强调，疫苗关系人民群众健康，关系公共卫生安全和国家安全。\n' +
        '这起问题疫苗案件是一起疫苗生产者逐利枉法、违反国家药品标准和药品生产质量管理规范、\n' +
        '编造虚假生产检验记录、地方政府和监管部门失职失察、个别工作人员渎职的严重\n' +
        '违规违法生产疫苗的重大案件，情节严重，性质恶劣，造成严重不良影响，\n' +
        '既暴露出监管不到位等诸多漏洞，\n' +
        '也反映出疫苗生产流通使用等方面存在的制度缺陷。'
    )
    .option('news', {
        alias: 'n',
        describe: '显示一篇新闻',
        type: 'boolean'
    })
    .action(function (options) {
        console.log('global command', options);
    })
    // .command('init', '初始化一个配置文件')
    // .helper()
    // .usage(
    //     'bin init --config config-file'
    // )
    // .usage(
    //     'bin init --config config-file --ssl',
    //     '使用加密方式初始一个配置文件'
    // )
    // .method('abc')
    // .method('def', '这是一个 def 方法')
    // .option('configFile', {
    //     alias: ['c', 'C', 'cF'],
    //     type: 'string',
    //     required: true,
    //     message: '',
    //     describe: 'The meeting pointed out that since the occurrence of this problem vaccine case.\n' +
    //         'General Secretary Xi Jinping has attached great importance to it and made many\n' +
    //         'important instructions. He has called for the immediate investigation of the truth,\n' +
    //         'serious accountability'
    // })
    // .option('xyz', {
    //     type: 'string'
    // })
    // .option('ssl', {
    //     alias: 's',
    //     type: 'boolean',
    //     describe: 'The overall situation of social stability. Under the strong leadership of the\n' +
    //         'Party Central Committee, the State Council has held several meetings to study and\n' +
    //         'sent investigation teams to conduct investigations. At present, the situation of\n' +
    //         'the case and the performance of duties of relevant departments and cadres have been\n' +
    //         'basically ascertained.'
    // })
    // .option('path', {
    //     alias: 'p',
    //     type: 'string',
    //     default: 'abc',
    //     describe: '会议指出，这起问题疫苗案件发生以来，习近平总书记高度重视，多次作出重要指示，\n' +
    //         '要求立即查清事实真相，严肃问责，依法从严处理，坚决守住安全底线，全力保障群众切\n' +
    //         '身利益和社会稳定大局。在党中央坚强领导下，国务院多次召开会议研究，派出调查组进行\n' +
    //         '调查，目前已基本查清案件情况和有关部门及干部履行职责情况。',
    //     transform: function (val, args, method) {
    //         return val + args.config;
    //     }
    // })
    // .action(function (args, method) {
    //     console.log('action init', args, method);
    // })
    .command('show')
    .option('url', {
        required: true
    })
    .helper()
    .method('ad')
    .option('name', {
        required: true
    })
    .method('tv')
    .option('channel')
    .action(function (args, method) {
        console.log('命令', 'show');
        console.log('参数', args);
        console.log('方法', method);
    })
    .parse({
        package: {
            bin: {
                abc: ''
            },
            name: 'blear.ui',
            version: '1.0.0'
        }
    });


