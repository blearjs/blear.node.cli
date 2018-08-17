/**
 * 文件描述
 * @author ydr.me
 * @create 2018-08-16 10:23
 * @update 2018-08-16 10:23
 */


'use strict';

var cli = require('../src/index');

// console.log('123456789012345678901234567890123456789012345678901234567890' +
//     '1234567890123456789012345678901234567890');

cli
    .command()
    .helper()
    .version('1.0.0')
    .action(function (options) {
        if (options.help) {
            cli.help();
        } else if (options.version) {

        }
    })
    .command('init', '初始化一个配置文件')
    .helper()
    .option('config', {
        alias: ['c', 'C', 'ccccccccvvvvvvvvvvvvv'],
        type: 'string',
        desc: 'The meeting pointed out that since the occurrence of this problem vaccine case.\n' +
            'General Secretary Xi Jinping has attached great importance to it and made many\n' +
            'important instructions. He has called for the immediate investigation of the truth,\n' +
            'serious accountability'
    })
    .option('ssl', {
        alias: 's',
        type: 'boolean',
        desc: 'The overall situation of social stability. Under the strong leadership of the\n' +
            'Party Central Committee, the State Council has held several meetings to study and\n' +
            'sent investigation teams to conduct investigations. At present, the situation of\n' +
            'the case and the performance of duties of relevant departments and cadres have been\n' +
            'basically ascertained.'
    })
    .option('path', {
        alias: 'p',
        type: 'string',
        default: 'abc',
        desc: '会议指出，这起问题疫苗案件发生以来，习近平总书记高度重视，多次作出重要指示，\n' +
            '要求立即查清事实真相，严肃问责，依法从严处理，坚决守住安全底线，全力保障群众切\n' +
            '身利益和社会稳定大局。在党中央坚强领导下，国务院多次召开会议研究，派出调查组进行\n' +
            '调查，目前已基本查清案件情况和有关部门及干部履行职责情况。',
        transform: function (val, options) {
            return val + options.config;
        }
    })
    .action(function (options) {
        console.log('action init', options);
    })
    .command('get')
    .option('ssl', {
        alias: ['s'],
        type: 'boolean'
    })
    .action(function (options) {
        console.log('action get', options);
    })
    .parse();
