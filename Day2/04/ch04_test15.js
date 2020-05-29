/*
 * 4장 Test 15
 * 로그 남기기 : winston 모듈을 이용해 로그 남기기
 */

// 로그 처리 모듈
var winston = require('winston');
// 로그 일별 처리 모듈
var winstonDaily = require('winston-daily-rotate-file');
// 시간 처리 모듈
var moment = require('moment');

// logger : winston 모듈의 로그를 출력하는 객체
var logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winstonDaily)({
            filename: './Day2/04/log/server_%DATE%.log',
            maxSize: '10m',
            datePattern: 'YYYY-MM-DD'
        })
    ]
});

var fs = require('fs');

var inname = './Day2/04/output.txt';
var outname = './Day2/04/output2.txt';

fs.exists(outname, function (exists) {
    if (exists) {
        fs.unlink(outname, function (err) {
            if (err) throw err;
            logger.info('기존 파일 [' + outname +'] 삭제함.');
        });
    }
    var infile = fs.createReadStream(inname, {flags: 'r'} );
    var outfile = fs.createWriteStream(outname, {flags: 'w'});

    infile.pipe(outfile);
    logger.info('파일 복사 [' + inname + '] -> [' + outname + ']');
});
