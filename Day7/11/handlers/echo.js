
/*
 * echo RPC 함수
 *
 */

// echo 함수

// 첫번째 param : client에서 받은 정보
// 두번째 param : client에게 응답을 보낼 정보
var echo = function(params, callback) {
	console.log('JSON-RPC echo 호출됨.');
	console.dir(params);

    // 두번째 param에 응답할 데이터 넣어서 callback 한다.
	callback(null, params);
};

module.exports = echo;

