//on(): 이벤트가 전달될 객체에 이벤트 리스너를 설정하는 역할
process.on('exit', function(){
   console.log('exit 이벤트 발생함.')
});

setTimeout(function(){
    console.log('2초 후에 시스템 종료 시도함')

    process.exit();  /* 위에 exit 이벤트를 호출함 */
}, 2000);


