process.on('tick', function(count){
    console.log('tick 이벤트 발생함 : %s', count);
});

setTimeout(function(){
    console.log('2초 후에 tick 이벤트 전달 시도함.');

    // emit(): event를 다른쪽으로 전달하고 싶을 때 사용
    // tick 이벤트를 process객체로 전달함
    process.emit('tick', '2');
}, 2000);
