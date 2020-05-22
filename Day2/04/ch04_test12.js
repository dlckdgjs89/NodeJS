/**
 * 4장 Test 12
 * FS 사용하기 : 파이프 사용하기
 */

var fs = require('fs');

var inname = './Day2/04/output.txt';
var outname = './Day2/04/output2.txt';

fs.exists(outname, function (exists) {
    if (exists) {
    	fs.unlink(outname, function (err) {
    		if (err) throw err;
    		console.log('기존 파일 [' + outname +'] 삭제함.');
    	});
    }

    var infile = fs.createReadStream(inname, {flags: 'r'} );
	var outfile = fs.createWriteStream(outname, {flags: 'w'});

	infile.pipe(outfile);
	console.log('파일 복사 [' + inname + '] -> [' + outname + ']');
});

