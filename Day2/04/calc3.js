/*
 * calc3 모듈
 */

// util 모듈 불러오기
var util = require('util');
// events 모듈 안에 정의되어 있는 EventEmitter 속성 불러오기
var EventEmitter = require('events').EventEmitter;

//Calc 객체 생성
var Calc = function(){
    // var self = this; 무슨의미?? 왜 쓴거지??
    var self = this;

    //on(): 이벤트가 전달될 객체에 이벤트 리스너를 설정하는 역할, 이벤트를 받기위함
    this.on('stop', function() {
        console.log('Calc에 stop event 전달됨');
    });
};

// 상속을 하기 위해 util 모듈에 있는 inherits() 메소드 사용함.
// Calc 객체가 이벤트 처리를 할 수 있도록 EventEmitter를 상속하도록 만드는 코드
util.inherits(Calc, EventEmitter);

Calc.prototype.add = function(a, b){
    return a + b;
}

// cal3.js에서 정의한 모듈을 불러들이는 쪽에서 Calc 객체를 참조할 수 있도록
// module.exports에 Calc 객체를 지정함
module.exports = Calc;
//title 속성의 값으로 calculator라는 이름을 설정
module.exports.title = 'calculator';
