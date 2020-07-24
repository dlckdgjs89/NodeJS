
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./coffeeshop_schema', collection:'coffeeshop',
         schemaName:'CoffeeShopSchema', modelName:'CoffeeShopModel'}
	],
	route_info: [
        //===== CoffeeShop =====//
	    {file:'./coffeeshop', path:'/process/addcoffeeshop', method:'add', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/listcoffeeshop', method:'list', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/nearcoffeeshop', method:'findNear', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/withincoffeeshop', method:'findWithin', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/circlecoffeeshop', method:'findCircle', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/nearcoffeeshop2', method:'findNear2', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/withincoffeeshop2', method:'findWithin2', type:'post'}
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
	},
    jsonrpc_api_path: '/api'
}
