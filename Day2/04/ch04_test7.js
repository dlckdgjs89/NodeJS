var fs = require('fs');

//파일에 데이터를 씁니다.
fs.writeFile('./Day2/04/output.txt', 'Hello World1234567489!', function(err) {
    if(err) {
        console.log('Error : ' +err);
    }
    console.log('output.txt 파일에 데이터 쓰기 완료');
});