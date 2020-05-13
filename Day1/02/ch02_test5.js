//require('파일이름명');

//exports 방식
var calc = require('./calc');
console.log('모듈로 분리하기 전 - calc.add 함수 호출 결과 : %d', calc.add(10, 10));

//module.exports 방식
var calc2 = require('./calc2');
console.log('모듈로 분리하기 후 - calc2.add 함수 호출 결과 : %d', calc2.add(10, 10));
