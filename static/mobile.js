// GLOBAL DEFINITIONS BEIBE
// ******************************
var win = $(this);

// GAME DEFINITION BEIBE 
// ******************************
var up 		 = $('.button-up', win);
var down	 = $('.button-down', win);

var events  = [];

// EVENT NAME:
// UP:    1
// DOWN:  2

up.on('touchstart', function () {
		
		events.unshift('up');

		remote.send({
			eventType: 'move',
			time: new Date(),
			value: events[0]
		});

});

up.on('touchend', function () {
		
	events.splice( events.indexOf('up'), 1 );

	remote.send({
		eventType: 'move',
		time: new Date(),
		value: events[0]
	});

});

down.on('touchstart', function () {
		
		events.unshift('down');
		
		remote.send({
			eventType: 'move',
			time: new Date(),
			value: events[0]
		});

});

down.on('touchend', function () {

		events.splice( events.indexOf('down'), 1 );

		remote.send({
			eventType: 'move',
			time: new Date(),
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