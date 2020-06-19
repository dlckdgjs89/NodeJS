// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , serveStatic = require('serve-static')
  , path = require('path')

var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// mongoose 모듈 사용
var mongoose = require('mongoose');

//===== 데이터베이스 연결 =====//

// 데이터베이스 객체를 위한 변수 선언
var database;

// 데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;

// 데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

//데이터베이스에 연결
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017/local';

	// 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
	mongoose.connect(databaseUrl);
	database = mongoose.connection;

	database.on('error', console.error.bind(console, 'mongoose connection error.'));
	database.on('open', function () {
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);


		// 스키마 정의
		UserSchema = mongoose.Schema({
		    id: {type: String, required: true, unique: true},
		    password: {type: String, required: true},
		    name: {type: String, index: 'hashed'},
		    age: {type: Number, 'default': -1},
		    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
		    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
		});

		// 스키마에 static으로 findById 메소드 추가
		UserSchema.static('findById', function(id, callback) {
			return this.find({id:id}, callback);
		});

        // 스키마에 static으로 findAll 메소드 추가
		UserSchema.static('findAll', function(callback) {
			return this.find({}, callback);
		});

		console.log('UserSchema 정의함.');

		// UserModel 모델 정의
		UserModel = mongoose.model("users2", UserSchema);
		console.log('UserModel 정의함.');


	});

    // 연결 끊어졌을 때 5초 후 재연결
	database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    });
}



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




// 사용자 로그인 시 응답 페이지 구현
var router = express.Router();

router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    if(database){
        authUser(database, paramId, paramPassword, function(err, docs) {
            if(err){
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }
            if(docs) {
                console.dir(docs);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end()
                return;
            } else {
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');
                res.end()
                return;
            }
        });
    } else {
        console.log('에러 발생.');
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end()
        return;
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

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);

    if(database) {
        addUser(database, paramId, paramPassword, paramName, function(err, result){
            if(err) {
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }

            if(result){
                console.dir(result);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : ' + paramName + '</p></div>');
                res.end()
                return;
            } else {
                console.log('에러 발생.');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 안됨.</h1>');
                res.end()
                return;
            }
        })
    } else {
        console.log('에러 발생.');
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



// 사용자 로그인 시 인증하는 함수 : 아이디 먼저 찾고 비밀번호를 그다음에 비교
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    // 1. ID를 사용해 검색
    UserModel.findById(id, function(err, results){
       if(err){
           callback(err, null);
           return;
       }

       console.log('아이디 %s로 사용자 검색 결과', id);
        console.dir(results);

        if(results.length > 0){
            console.log('아이디와 일치하는 사용자 찾음');

            // 2. 비밀번호 확인
            if(results[0]._doc.password === password){
                console.log('비밀번호 일치함');
                callback(null, result);
            } else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        } else {
            console.log('아이디와 일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
};

// 사용자 추가 함수
var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
    // users : 테이블명

    var user = new UserModel({"id":id, "password":password, "name":name});

    //save() : 위 구문 실행(저장)
    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null, user);
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
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database) {
		database.close();
	}
});

// Express 서버 시작
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    connectDB();
});
