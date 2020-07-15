/*
 * 설정 파일
 *
 * @date 2016-11-10
 * @author Mike
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
	],
    facebook : {
        clientId : '556196865058825',
        clientSecret : 'e987481edb90f546abfc6cd4db7e9a93',
        callbackURL : '/auth/facebook/callback'
    }
}
