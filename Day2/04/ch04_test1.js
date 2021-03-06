// url 모듈을 사용하기 위한 require() 메소드 호출
var url = require('url');

// 주소 문자열을 URL 객체로 만들기
var curURL = url.parse('https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=steve+jobs');

// URL 객체를 주소 문자열로 만들기
var curStr = url.format(curURL);

console.log('주소 문자열 : %s', curStr);
console.log(curURL);


//요청 파라미터 구분하기

//querystring 모듈 사용하기 위한 require()메소드 호출
var querystring = require('querystring');
var param = querystring.parse(curURL.query);

console.log('param : %s', param);
console.log('요청 파라미터 중 query의 값 : %s', param.query);
console.log('원본 요청 파라미터 : %s', querystring.stringify(param));
