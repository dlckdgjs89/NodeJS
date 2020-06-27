/*
 * 사용자 정보 처리 모듈
 * 데이터베이스 관련 객체들을 req.app.get('database')로 참조
 *
 * @date 2016-11-10
 * @author Mike
 */

var login = function(req, res) {
    console.log('user(user2.js) 모듈 안에 있는 login 호출됨.');

    // 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
    if(database.db){
        authUser(database, paramId, paramPassword, function(err, docs) {
            if(err){
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }
            // 조회된 레코드가 있으면 성공 응답 전송
            if(docs) {
                console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
				var username = docs[0].name;

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end()
                return;
            } else {    // 조회된 레코드가 없는 경우 실패 응답 전송
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');
                res.end()
                return;
            }
        });
    } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        console.log('에러 발생.');
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end()
        return;
    }
};


var adduser = function(req, res) {
    console.log('user 모듈 안에 있는 adduser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
    if(database.db) {
        addUser(database, paramId, paramPassword, paramName, function(err, result){

            // 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
            if(err) {
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }
            // 결과 객체 있으면 성공 응답 전송
            if(result){
                console.dir(result);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : ' + paramName + '</p></div>');
                res.end()
                return;
            } else {    // 결과 객체가 없으면 실패 응답 전송
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 안됨.</h1>');
                res.end()
                return;
            }
        })
    } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        console.log('에러 발생.');
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end()
    }
};


var listuser = function(req, res){
    console.log('user 모듈 안에 있는 listuser 호출됨.');

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    // db 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if(database) {
        // 1. 모든 사용자 검색
        UserModel.findAll(function(err, results) {
            // 오류가 발생했을 때 클라이언트로 오류 전송
            if(err) {
                console.log('사용자 리스트 조회 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생' + err.stack + '</h1>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            // 결과 객체 있으면 리스트 전송
            if(results){
                console.dir(results);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write("<h2>사용자 리스트</h2>")
                res.write("<div><ul>");

                for (var i=0; i<results.length; i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write("    <li>#" + i + " -> " + curId + ", " + curName + "</li>");
                }

                res.write("</ul></div>");
                res.end();

            // 결과 객체가 없으면 실패 응답 전송
            } else {
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 리스트 조회 실패</h1>');
                res.end();
            }
        });
    } else { // 데이터베이스 객체가 초기화되지 않았을 때 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
};


//사용자를 인증하는 함수 : 아이디로 먼저 찾고 비밀번호를 그 다음에 비교하도록 함
var authUser = function(database, id, password, callback) {
	console.log('authUser 호출됨.');


    // 1. 아이디를 이용해 검색
	database.UserModel.findById(id, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}

		console.log('아이디 [%s]로 사용자 검색결과', id);
		console.dir(results);

		if (results.length > 0) {
			console.log('아이디와 일치하는 사용자 찾음.');

			// 2. 패스워드 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출
			var user = new database.UserModel({id:id});
			var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
			if (authenticated) {
				console.log('비밀번호 일치함');
				callback(null, results);
			} else {
				console.log('비밀번호 일치하지 않음');
				callback(null, null);
			}

		} else {
	    	console.log("아이디와 일치하는 사용자를 찾지 못함.");
	    	callback(null, null);
	    }

	});

}


//사용자를 등록하는 함수
var addUser = function(database, id, password, name, callback) {
	console.log('addUser 호출됨.');

	// UserModel 인스턴스 생성
	var user = new database.UserModel({"id":id, "password":password, "name":name});

	// save()로 저장
	user.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}

	    console.log("사용자 데이터 추가함.");
	    callback(null, user);

	});
}

var database;
var UserSchema;
var UserModel;

// 데이터베이스 객체, 스키마 객체, 모델 객체를 이 모듈에서 사용할 수 있도록 전달함
var init = function(db, schema, model) {
    console.log('init() 호출됨');

    database = db;
    UserSchema = schema;
    UserModel = model;
}

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
