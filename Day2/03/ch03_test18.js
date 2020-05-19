//생성자 함수 : 첫글자 대문자로 시작함.
function Person(name, age) {
    this.name = name;
    this.age = age;
}

//공통적으로 사용할 메소드를 정의할 때 prototype 사용
Person.prototype.walk = function(speed) {
    console.log(speed + 'km 속도로 걸어갑니다.');
}

var person01 = new Person('소녀시대', 20);
var person02 = new Person('걸스데이', 22);

console.log(person01.name + '객체의 walk(10)을 호출합니다.');
person01.walk(10);
