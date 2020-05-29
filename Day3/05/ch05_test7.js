var http = require('http');

var options = {
    host : 'www.google.com',
    port : 80,
    path : '/'
};

// 다른 사이트에 요청을 보내고 응답을 받아 처리 가능
var req = http.get(options, function(res) {
    // 응답 처리
    // data : 응답을 받고 있는 상태
    // resData : 응답을 다 받은 데이터
    // end : 응답 데이터를 모두 받은 후 콘솔 창에 출력하는 역할
    var resData = '';
    res.on('data', function(chunk){
       resData += chunk;
    });

    res.on('end', function(){
        console.log(resData);
    });

    req.on('error', function(err){
       console.log("오류 발생 : " + err.message);
    });
});
