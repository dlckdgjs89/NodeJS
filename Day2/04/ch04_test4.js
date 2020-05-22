/*
 * 4장 Test 4
 * 프로토타입 객체를 만들고 EventEmitter를 상속하도록 하기
 */

// 모듈 불러오기
var Calc = require('./calc3');

var calc = new Calc();

// emit(): event를 다른쪽으로 전달하고 싶을 때 사용
// stop 이벤트를 calc 객체로 전달함
calc.emit('stop');

console.log(Calc.title + "에 stop 이벤트 전달함.");
