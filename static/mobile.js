// GLOBAL DEFINITIONS BEIBE
// ******************************
var win = $(this);

// GAME DEFINITION BEIBE 
// ******************************
var trackpad = $('.trackpad', win );
var up 		 = $('.button-up', win);
var down	 = $('.button-down', win);

var events  = [];

// EVENT NAME:
// UP:    1
// DOWN:  2

trackpad
.on( 'touchstart', function(e){
	e.preventDefault();
})
.on( 'tap', function(){
	
	remote.send({
		eventType: 'trackpad',
		time: Date.now(),
		value: 'tap'
	});

})
.on( 'swipeUp', function(){
	
	remote.send({
		eventType: 'trackpad',
		time: Date.now(),
		value: 'swipeUp'
	});

})
.on( 'swipeDown', function(){
	
	remote.send({
		eventType: 'trackpad',
		time: Date.now(),
		value: 'swipeDown'
	});

})
.on( 'swipeLeft', function(){
	
	remote.send({
		eventType: 'trackpad',
		time: Date.now(),
		value: 'swipeLeft'
	});

});

up
.on( 'touchstart', function () {
		
		events.unshift('up');

		remote.send({
			eventType: 'move',
			time: Date.now(),
			value: events[0]
		});

})
.on( 'touchend', function () {
		
	events.splice( events.indexOf('up'), 1 );

	remote.send({
		eventType: 'move',
		time: Date.now(),
		value: events[0]
	});

});

down
.on( 'touchstart', function () {
		
		events.unshift('down');
		
		remote.send({
			eventType: 'move',
			time: Date.now(),
			value: events[0]
		});

})
.on( 'touchend', function () {

		events.splice( events.indexOf('down'), 1 );

		remote.send({
			eventType: 'move',
			time: Date.now(),
			value: events[0]
		});

});

/*

RECIVIR MENSAJE EN LA APP DE TELEVISIÓN
win.on( 'remoteMessage', function( e, info, data ){
	// body...
});

RECIVIR MENSAJE EN LA APP DE MÓVIL
win.on( 'tvMessage', function( e, info, data ){
	// body...
});

*/
