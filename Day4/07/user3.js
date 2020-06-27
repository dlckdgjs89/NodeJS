// module.exports 를 사용하면 객체 그 자체를 할당할 수 있다.

var user = {
    getUser : function(){
        return {id:'test01', name:'소녀시대'};
    },
    group: {id:'group01', name:'친구'}
}

module.exports = user;
