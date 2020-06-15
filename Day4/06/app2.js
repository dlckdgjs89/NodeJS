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

// mongo db 모듈 사용
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB(){
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, function(err, client) {
        if(err){
            console.log('데이터베이스 연결 시 에러 발생함.');
            return;
        }
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        database = client.db('local');
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



// 사용자 로그인 시 인증 함수
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    var users = db.collection('users');
    users.find({"id":id, "password":password}).toArray(function(err, docs){
        if(err) {
            callback(err, null);
            return;
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
    var users = db.collection('users');

    //insertMany() : 여러개를 한번에 인서트하는 메소드
    users.insertMany([{"id":id, "password":password, "name":name}], function(err, result) {
        if(err){
            callback(err, null);
            return;
        }
        // insertedCount > 0 : true면, DB에 정상적으로 insert 됐다는 의미
        if ( result.insertedCount > 0) {
            console.log('사용자 추가됨 : '+result.insertedCount);
            callback(null, result);
        } else {
            console.log('추가된 레코드가 없음.');
            callback(null, null);
        }
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
