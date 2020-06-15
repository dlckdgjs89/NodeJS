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

var database;
var UserSchema;
var UserModel;

function connectDB(){
    var databaseUrl = 'mongodb://localhost:27017/local';

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    // event발생했을 때 처리하는 함수
    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);

        UserSchema = mongoose.Schema({
            id: {type:String, required:true, unique:true},
            password: {type:String, require:true},
            name: {type:String, index:'hashed'},
            age:{type:Number, 'default':-1},
            created_at:{type:Date, index:{unique:false}, 'default':Date.now()},
            update_at:{type:Date, index:{unique:false}, 'default':Date.now()}
        });
        console.log('UserSchema 정의함.');

        // UserSchema의 함수(메소드) 정의 -> 모델에서 사용 가능
        UserSchema.static('findById'), function(id, callback){
            return this.find({id:id, callback});
        });

        /* 위와 동일, this = 모델 객체
        UserSchema.statics.findById = function(id, callback){
            return this.find({id:id, callback});
        }
        */


        UserSchema.static('findAll', function(id, callback){
            return this.find({}, callback);
        });

        // model() : 기존 collection인 users 테이블과 방금 만든 Schema를 연결해주는 역할
        UserModel = mongoose.model('users2', UserSchema);
        console.log('UserModel 정의함.');
    });

    database.on('disconnected', function(){
        console.log('데이터베이스 연결 끊어짐.');
    });

    database.on('error', console.error.bind(console, 'mongoose 연결 애러.'));

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

router.route('/process/listuser').post(function(req, res){
    console.log('/process/listuser 라우팅 함수 호출됨.');

    if(database) {
        UserModel.findAll(function(err, results) {
            if(err) {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end()
                return;
            }

            if(results){
                console.dir(results);

                res.writeHead(200, {"Content-Type:":"text/html;charset=utf8"});
                res.write("<h3>사용자 리스트</h3>")
                res.write("<div><ul>");

                for (var i=0; i<results.length; i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write("    <li>#" + i + " -> " + curId + ", " + curName + "</li>");
                }
                res.write<"</ul></div>");
                res.end();
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
                res.end();
            }
        });
    }
});

app.use('/', router);



// 사용자 로그인 시 인증 함수 (mongodb -> mongoose 사용 방식으로 변경함)
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    // 추가 소스
    UserModel.findById(id, function(err, results){
       if(err){
           callback(err, null);
           return;
       }
        console.log('아이디 %s로 검색됨.');
        if(results.length > 0){
            if(results[0]._doc.password === password) {
                console.log('비밀번호 일치함.');
                callback(null. results);
            } else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        } else {
            console.log('아이디 일치하는 사용자 없음.');
            callback(null, null);
        }
    });

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
