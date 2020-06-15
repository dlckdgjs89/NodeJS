/**
 * 데이터베이스 사용하기
 *
 * mongoose로 데이터베이스 다루기
 * 사용자 조회, 사용자 추가
 *
 * 웹브라우저에서 아래 주소의 페이지를 열고 웹페이지에서 요청
 *    http://localhost:3000/public/login.html
 *    http://localhost:3000/public/adduser.html
 *
 * @date 2016-11-10
 * @author Mike
 */

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , serveStatic = require('serve-static')
  , expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// mongoose 모듈 사용
var mongoose = require('mongoose');

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

//===== 데이터베이스 연결 =====//

// 데이터베이스 객체를 위한 변수 선언
var database;

// 데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;

// 데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

//데이터베이스에 연결
function connectDB(){
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/local';

    // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    // event발생했을 때 처리하는 함수
    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);


        // 스키마 정의
        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        console.log('UserSchema 정의함.');

        // UserModel 모델 정의
        // model() : 기존 collection인 users 테이블과 방금 만든 Schema를 연결해주는 역할
        UserModel = mongoose.model('users', UserSchema);
        console.log('UserModel 정의함.');
    });

    database.on('disconnected', function(){
        console.log('데이터베이스 연결 끊어짐.');
    });

    database.on('error', console.error.bind(console, 'mongoose 연결 애러.'));

}




//===== 라우팅 함수 등록 =====//

// 사용자 로그인 시 응답 페이지 구현

// 라우터 객체 참조
var router = express.Router();

// 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');

    // 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
    if(database){
        authUser(database, paramId, paramPassword, function(err, docs) {
            if(err){
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }


            if(docs) {
                console.dir(docs);
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end()
                return;
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');
                res.end()
                return;
            }
        });
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
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
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }

            if(result){
                console.dir(result);

                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : ' + paramName + '</p></div>');
                res.end()
                return;
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안됨.</h1>');
                res.end()
                return;
            }
        })
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end()
    }
});



app.use('/', router);



// 사용자 로그인 시 인증 함수 (mongodb -> mongoose 사용 방식으로 변경함)
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    UserModel.find({"id":id, "password":password}, function(err, docs){
        if(err){
            callback(err, null);
            retrun;
        }
        if(docs.length > 0){
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs);
        } else {
            console.log('일치하는 사용자를 찾지 못함.');
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

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    connectDB();
});
