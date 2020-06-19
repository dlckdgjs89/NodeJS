/**
 * MySQL 데이터베이스 사용하기
 *
 * 웹브라우저에서 아래 주소의 페이지를 열고 웹페이지에서 요청
 * (먼저 사용자 추가 후 로그인해야 함)
 *    http://localhost:3000/public/login2.html
 *    http://localhost:3000/public/adduser2.html
 *
 * @date 2016-11-10
 * @author Mike
 */

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , serveStatic = require('serve-static')
  , errorHandler = require('errorhandler')
  , expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool      =    mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'test',
    debug    :  false
});



// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);
app.use('/public', serveStatic(path.join(__dirname, 'public')));

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();

// 로그인 처리 함수
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출됨.');

	// 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (pool) {
		authUser(paramId, paramPassword, function(err, rows) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 로그인 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();

                return;
            }

            // 조회된 레코드가 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);

                // 조회 결과에서 사용자 이름 확인
				var username = rows[0].name;

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();

			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}

});

//사용자 추가 시 응답 페이지 구현
router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 라우팅 함수 호출됨.');
    //get 방식일 때 : query.XX 로 넘어옴
    //post 방식일 때 : body.XX 로 넘어옴
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramAge = req.body.age || req.query.age;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramAge);

    // pool 객체가 초기화된 경우, addUser 함수를 호출하여 사용자 추가
    if(pool) {
        addUser(paramId, paramName, paramAge, paramPassword, function(err, addedUser){
            // 동일한 id 로 추가할 때 오류 발생 - 클라이언트로 오류 전송
            if(err) {
                console.error('사용자 추가 중 오류 발생 : ' + err.tack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>' +err.stack+'</p>');
                res.end()
                return;
            }

            // 결과 객체 있으면 성공 응답 전송
            if(addedUser){
                console.dir(addedUser);

                console.log('inserted '+ addedUser.affectedRows + 'rows');

                var insertId = addedUser.insertId;
                console.log('추가한 레코드의 아아디 :' + insertId);


                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.end()
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 안됨.</h1>');
                res.end()
            }
        });
    } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end()
    }
});

// 사용자 리스트 함수
router.route('/process/listuser').post(function(req, res){
    console.log('/process/listuser 라우팅 함수 호출됨.');

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
});

app.use('/', router);



// 사용자를 인증하는 함수
var authUser = function(id, password, callback) {
	console.log('authUser 호출됨 : ' + id + ', ' + password);

	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        var columns = ['id', 'name', 'age'];
        var tablename = 'users';

        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release();  // 반드시 해제해야 함
            console.log('실행 대상 SQL : ' + exec.sql);

            if (rows.length > 0) {
    	    	console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
    	    	callback(null, rows);
            } else {
            	console.log("일치하는 사용자를 찾지 못함.");
    	    	callback(null, null);
            }
        });

        conn.on('error', function(err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);

            callback(err, null);
      });
    });

}
// 사용자 추가 함수
var addUser = function(id, name, age, password, callback) {
    console.log('addUser 호출됨');

    //커넥션 풀에서 연결 객체를 가져옵니다.
    pool.getConnection(function(err, conn){
        if(err){
            if(conn){
                conn.release(); // 반드시 해제해야 합니다.
            }
        callback(err, null);
        return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' +conn.threadId);

        // 데이터를 객체로 만듭니다.
        var data = {id:id, name:name, age:age, password:password};

        // sql문을 실행합니다.
        var exec = conn.query('insert into users set ?', data, function(err, result){
            conn.release(); //qksemtl gowpgodi gkqslek.
            console.log('실행 대상 SQL : ' +exec.sql);

            if(err){
                console.log('SQL 실행 시 오류 발생함');
                console.dir(err);

                callback(err, null);

                return;
            }

            callback(null, result);
        });
    });
};


// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
 static: {
   '404': './Day4/06/public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});
