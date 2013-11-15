// GLOBAL DEFINITIONS BEIBE
// ******************************
var win = $(this).addClass('menu');

// GAME DEFINITION BEIBE 
// ******************************
var trackpad = $('.trackpad', win );
var up 		 = $('.button-up', win);
var down	 = $('.button-down', win);

// EVENT NAME:
// UP:    1
// DOWN:  2

trackpad
.on( 'touchstart', function(e){
	e.preventDefault();
})
.on( 'tap', function(){
	
	remote.send({
		eventType : 'trackpad',
		time      : Date.now(),
		value     : 'tap'
	});

})
.on( 'swipeUp', function(){
	
	remote.send({
		eventType : 'trackpad',
		time      : Date.now(),
		value     : 'swipeUp'
	});

})
.on( 'swipeDown', function(){
	
	remote.send({
		eventType : 'trackpad',
		time      : Date.now(),
		value     : 'swipeDown'
	});

})
.on( 'swipeLeft', function(){
	
	remote.send({
		eventType : 'trackpad',
		time      : Date.now(),
		value     : 'swipeLeft'
	});

});

up
.on( 'touchstart', function () {

	remote.send({
		eventType : 'keydown',
		time      : Date.now(),
		value     : 'w'
	});

	$(this).addClass('active');

})
.on( 'touchend', function () {
	
	remote.send({
		eventType : 'keyup',
		time      : Date.now(),
		value     : 'w'
	});

	$(this).removeClass('active');

});

down
.on( 'touchstart', function () {
				
	remote.send({
		eventType : 'keydown',
		time      : Date.now(),
		value     : 's'
	});

	$(this).addClass('active');

})
.on( 'touchend', function () {

	remote.send({
		eventType : 'keyup',
		time      : Date.now(),
		value     : 's'
	});

	$(this).removeClass('active');

});

win
.on( 'tvMessage', function( e, info, data ){

	if( data[ 0 ][ 0 ] === 'menu' ){
		win.addClass('menu');
	}else if( data[ 0 ][ 0 ] === 'game' ){
		win.removeClass('menu');
	}

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
