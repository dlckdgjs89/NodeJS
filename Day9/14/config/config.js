
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./post_schema', collection:'post', schemaName:'PostSchema', modelName:'PostModel'}
	],
	route_info: [
        {file:'./post', path:'/process/addpost', method:'addpost', type:'post'}
        ,{file:'./post', path:'/process/showpost/:id', method:'showpost', type:'get'}
        ,{file:'./post', path:'/process/listpost', method:'listpost', type:'post'}
        ,{file:'./post', path:'/process/listpost', method:'listpost', type:'get'}
	],
	facebook: {		// passport facebook
		clientID: '556196865058825',
		clientSecret: 'e987481edb90f546abfc6cd4db7e9a93',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}
