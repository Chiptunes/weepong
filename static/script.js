wz.app.addScript(36, 'main', function(win, app, lang, params) {

    var pong;
    var scoreFirst      = $('.score-first', win);
    var scoreSecond     = $('.score-second', win);
    var pauseText       = $('.weepong-pause', win);
    var canvasZone      = $('.weepong-canvas',win)[0];

    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function(callback){
                    window.setTimeout(callback, 100/6);
                };
    })();

    window.cancelRequestAnimFrame = (function() {
        return window.cancelAnimationFrame                 ||
               window.webkitCancelRequestAnimationFrame    ||
               window.mozCancelRequestAnimationFrame       ||
               window.oCancelRequestAnimationFrame         ||
               window.msCancelRequestAnimationFrame        ||
        clearTimeout
    })();
    
    // METEMOS EL TEXTO EN LAS OPCIONES
    canvasZone.width    = $('.weepong-canvas', win).width();
    canvasZone.height   = $('.weepong-canvas', win).height();

    canvasZone.width    = win.innerWidth();
    canvasZone.height   = win.innerHeight() - 29;


    $('.weepong-selection-oneplayer', win).text(lang.onePlayer);
    $('.weepong-selection-twoplayers', win).text(lang.twoPlayers);
    $('.weepong-selection-practice', win).text(lang.practice);
    $('.weepong-selection-instructions', win).text(lang.instructions);
    $('.weepong-type-normal', win).text(lang.classic);
    $('.weepong-type-awesome', win).text(lang.awesome);
    $('.weepong-difficult-easy', win).text(lang.easy);
    $('.weepong-difficult-medium', win).text(lang.medium);
    $('.weepong-difficult-hard', win).text(lang.hard);
    $('.weepong-difficult-impossible', win).text(lang.impossible);
    
    $('.weepong-win', win).text(lang.win);
    $('.weepong-lose', win).text(lang.lose);

    $('.weepong-instructions img', win).attr('src', lang.instructionsImage);

    scoreFirst.css('left', win.width() / 3);
    scoreSecond.css('right', win.width() / 3 );
    pauseText.text(lang.pause);
    pauseText.css({ x : ( ( canvasZone.width / 2 ) - ( pauseText.width() / 2 ) ), y : ( ( canvasZone.height / 2 ) - ( pauseText.height() / 2 ) ) });
    
    $('.weepong-win', win).css({ x : ( ( canvasZone.width / 2 ) - ( $('.weepong-win', win).width() / 2 ) ), y : ( ( canvasZone.height / 2 ) - ( $('.weepong-win', win).height() / 2 ) ) })
    $('.weepong-lose', win).css({ x : ( ( canvasZone.width / 2 ) - ( $('.weepong-lose', win).width() / 2 ) ), y : ( ( canvasZone.height / 2 ) - ( $('.weepong-lose', win).height() / 2 ) ) })
    
    $('.weepong-title', win).css('margin-left', (($('.weepong-canvas').width()/2) - $('.weepong-title').width()/4) + 'px');

    /*#####################################################################################################
    ##################################       CLASE PROPIEDADES       ######################################
    #######################################################################################################*/


    function Direction() {
        this.player1;
        this.player2;
    }

    var Direccion       = { QUIETO: 0, ARRIBA: 1, ABAJO: 2 };
    var keys1           = [];
    var keys2           = [];

    var directions      = new Direction();
    
    var deltaLoop       = 0;
    var quantumLoop     = 0;
    var selfLoop        = null;

    var Tipos           = { NORMAL: 1, AWESOME: 2 };
    var Modes           = { MATCH : 1, PRACTICE: 2 };

    // Guardamos las diferentes pantallas

    // Extras    

    function Propiedades () {
        
        this.paused           = false;
        this.menu             = true;
        this.init             = false;
        this.players          = 0;
        this.sound            = true;
        this.select           = 0;
        this.colorDefault     = '#FFF';

        this.pelotaVel;
        
        this.eventStarts;
        this.eventTime;
        this.powerStarts;
        this.powerTime;

        this.killidInterval;
        this.killidTimeout;

        this.activePower;
        
        this.rafid;
        this.difficult;

        this.menus = {
                        "main":   [$('.weepong-selection-oneplayer', win), $('.weepong-selection-twoplayers', win), $('.weepong-selection-practice', win), $('.weepong-selection-instructions', win)],
                        "single": [$('.weepong-difficult-easy', win), $('.weepong-difficult-medium', win), $('.weepong-difficult-hard', win), $('.weepong-difficult-impossible', win)],
                        "doble":  [$('.weepong-type-normal', win), $('.weepong-type-awesome', win)]
                    }
    
    }

    var properties = new Propiedades();

    function Pantallas () {
        
        this.weepongSelection    =  $('.weepong-selection', win);
        this.weepongDifficult    =  $('.weepong-difficult', win);
        this.weepongType         =  $('.weepong-type', win);
        this.weepongInstructions =  $('.weepong-instructions', win);
        this.weepongCanvas       =  $('.weepong-canvas', win);

    }

    var pantallas = new Pantallas();

    function Transiciones () {}

    Transiciones.prototype.toSinglePlayer = function() {

        pantallas.weepongSelection.css('display', 'none');
        pantallas.weepongDifficult.css('display', 'block');
        properties.players = 1;

    }

    Transiciones.prototype.toMultiPlayer = function() {

        properties.players = 2;
        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongSelection.css('display', 'none');
        pantallas.weepongType.css('display', 'block');

    }

    Transiciones.prototype.easyMode = function() {

        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongCanvas.css('display', 'block');
        scoreFirst.css('display', 'block');
        scoreSecond.css('display', 'block');
        $('.weepong-title').css('display', 'none');
        $('#sound').css('display', 'none');
        properties.difficult = 'easy';
        pong = new Pong(4, 4, 500, 400, 15, Tipos.NORMAL);
        properties.init = true;
        properties.menu = false;
        pong.mode = Modes.MATCH;
        pong.loop();

    }

    Transiciones.prototype.mediumMode = function() {
        
        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongCanvas.css('display', 'block');
        scoreFirst.css('display', 'block');
        scoreSecond.css('display', 'block');
        $('.weepong-title').css('display', 'none');
        $('#sound').css('display', 'none');
        properties.difficult = 'medium'
        pong = new Pong(4, 3, 500, 500, 25, Tipos.NORMAL);
        properties.init = true;
        properties.menu = false;
        pong.mode = Modes.MATCH;
        pong.loop();

    }

    Transiciones.prototype.hardMode = function() {

            pantallas.weepongDifficult.css('display', 'none');
            pantallas.weepongCanvas.css('display', 'block');
            scoreFirst.css('display', 'block');
            scoreSecond.css('display', 'block');
            $('.weepong-title').css('display', 'none');
            $('#sound').css('display', 'none');
            properties.difficult = 'difficult';
            pong = new Pong(5, 4, 500, 500, 35, Tipos.NORMAL);
            properties.init = true;
            properties.menu = false;
            pong.mode = Modes.MATCH;
            pong.loop();

    }

    Transiciones.prototype.impossibleMode = function() {

        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongCanvas.css('display', 'block');
        scoreFirst.css('display', 'block');
        scoreSecond.css('display', 'block');
        $('.weepong-title').css('display', 'none');
        $('#sound').css('display', 'none');
        pong = new Pong(4, 4, 550, 600, 40, Tipos.NORMAL);
        properties.init = true;
        properties.menu = false;
        pong.mode = Modes.MATCH;
        pong.loop();

    }

    Transiciones.prototype.normalMode = function() {

        properties.players = 2;
        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongSelection.css('display', 'none');
        pantallas.weepongType.css('display', 'none');
        $('.weepong-title').css('display', 'none');
        $('#sound').css('display', 'none');
        pantallas.weepongCanvas.css('display', 'block');
        scoreFirst.css('display', 'block');
        scoreSecond.css('display', 'block');
        pong = new Pong(5, 5, 600, 600, 25, Tipos.NORMAL);
        properties.init = true;
        properties.menu = false;
        pong.mode = Modes.MATCH;
        pong.loop();

    }

    Transiciones.prototype.awesomeMode = function() {

        properties.players = 2;
        pantallas.weepongInstructions.css('display', 'none');
        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongSelection.css('display', 'none');
        pantallas.weepongType.css('display', 'none');
        $('.weepong-title').css('display', 'none');
        $('#sound').css('display', 'none');
        pantallas.weepongCanvas.css('display', 'block');
        scoreFirst.css('display', 'block');
        scoreSecond.css('display', 'block');
        pong = new Pong(5, 5, 600, 600, 25, Tipos.AWESOME);
        properties.init = true;
        properties.menu = false;
        pong.mode = Modes.MATCH;
        pong.loop();

    }

    Transiciones.prototype.practiceMode = function() {

        properties.players = 2;
        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongSelection.css('display', 'none');
        pantallas.weepongType.css('display', 'none');
        $('.weepong-title').css('display', 'none');
        $('#sound').css('display', 'none');
        pantallas.weepongCanvas.css('display', 'block');
        scoreFirst.css('display', 'block');
        pong = new Pong(5, 5, 600, 600, 25);
        properties.init = true;
        properties.menu = false;
        pong.mode = Modes.PRACTICE;
        pong.practicar();

    }

    Transiciones.prototype.toInstructions = function() {

        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongType.css('display', 'none');
        pantallas.weepongSelection.css('display', 'none');
        $('.weepong-title').css('display', 'none');
        pantallas.weepongInstructions.css('display', 'block');

    }

    var transiciones = new Transiciones();

    /*#####################################################################################################
    ##################################          CLASE PONG           ######################################
    #######################################################################################################*/
    
    function Pong (lp1, lp2, v1, v2, iv, t) {
        
        scoreFirst.css('left', win.width()/3);
        scoreSecond.css( 'right', win.width()/3);
        this.contexto = canvasZone.getContext('2d');
        this.palas  = [new Pala(30, lp1, v1), new Pala(canvasZone.width - 30, lp2, v2)];
        this.pelota = new Pelota(this, iv);
        this.ia = new Ia(this.pelota, this.palas[1], canvasZone.height, 2);
        this.puntuaciones = [0, 0];
        this.colisiones = 0;
        this.tiempoTranscurrido = Date.now();
        this.lineaColor = properties.colorDefault;
        this.mode;
        this.tipo = t;
        
        if (this.tipo === Tipos.AWESOME) {
            this.events = new EventTrigger(this);
            this.events.init();
        }

        this.barreras = [];
        this.pelotas  = []; 

    }

    Pong.prototype.dibujarMundo = function(){
        
        var trozos = 31;
        var trozo  = Math.round(canvasZone.height / trozos);
        var mitad  = Math.round(canvasZone.width / 2);

        this.contexto.lineWidth = 10;
        this.contexto.strokeStyle = this.lineaColor;

        for(var i = 0; i < trozos; i++) {
            
            if( i % 2 === 1 ) continue;
                this.contexto.beginPath();
                this.contexto.moveTo(mitad, trozo * i);
                this.contexto.lineTo(mitad, trozo * (i + 1));
                this.contexto.stroke();
        
        } 

    }

    Pong.prototype.back = function(){
        
        this.contexto.clearRect(0, 0, canvasZone.width, canvasZone.height);
        
        if(this.tipo === Tipos.AWESOME) {
            clearInterval(this.events.killInit);
            clearInterval(this.events.killBill);
        }

        scoreFirst.html(0);
        scoreSecond.html(0);

        cancelRequestAnimFrame(properties.rafid);

        pauseText.css('display', 'none');
        pantallas.weepongDifficult.css('display', 'none');
        pantallas.weepongType.css('display', 'none');
        pantallas.weepongInstructions.css('display', 'none');
        scoreFirst.css('display', 'none');
        scoreSecond.css('display', 'none');
        $('.weepong-lose').css('display', 'none');
        $('.weepong-win').css('display', 'none');
        pantallas.weepongSelection.css('display', 'block');
        $('#sound').css('display', 'block');
        $('.weepong-title').css('display', 'block');
        properties.menu = true;

    }

    Pong.prototype.finish = function() {
        
        if (properties.players === 1) {
            
            if (this.puntuaciones[0] === 10) {
      
                cancelRequestAnimFrame(properties.rafid);
                properties.init = false;
                pantallas.weepongCanvas.css('display', 'none');
              
                $('.weepong-win').css('display', 'block');

                var self = this;
                setTimeout(function() {

                    properties.init = false;
                    self.back();
                    self = null;

                }, 3500);         

            } else if (this.puntuaciones[1] === 10) {

                cancelRequestAnimFrame(properties.rafid);
                properties.init = false;
                pantallas.weepongCanvas.css('display', 'none');
              
                $('.weepong-lose').css('display', 'block');

                var self = this;
                setTimeout(function() {

                    properties.init = false;
                    self.back();
                    self = null;

                }, 3500);

            }

        } else if (properties.players === 2) {

            if (this.puntuaciones[0] === 10) {
      
                cancelRequestAnimFrame(properties.rafid);
                properties.init = false;
                pantallas.weepongCanvas.css('display', 'none');

                $('.weepong-win', win).css('font-size', canvasZone.height/ 16 + 'px');
                $('.weepong-lose', win).css('font-size', canvasZone.height/ 16 + 'px');

                var winWdth  = $('.weepong-win', win).width();
                var loseWdth = $('.weepong-lose', win).width();

                $('.weepong-win', win).css({ x :  ( ( canvasZone.width / 2 ) - ( winWdth + winWdth / 5 ) ) });
                $('.weepong-lose', win).css({ x : ( ( canvasZone.width / 2 ) + ( loseWdth / 2 ) ) });
                
                $('.weepong-lose').css('display', 'block');
                $('.weepong-win').css('display', 'block');

                var self = this;
                setTimeout(function() {
                    
                    properties.init = false;
                    self.back();
                    self = null;

                }, 3500);         

            } else if (this.puntuaciones[1] === 10) {

                cancelRequestAnimFrame(properties.rafid);
                properties.init = false;
                pantallas.weepongCanvas.css('display', 'none');

                $('.weepong-win', win).css('font-size', canvasZone.height/ 16 + 'px');
                $('.weepong-lose', win).css('font-size', canvasZone.height/ 16 + 'px');

                var winWdth  = $('.weepong-win', win).width();
                var loseWdth = $('.weepong-lose', win).width();
                
                $('.weepong-win', win).css({ x :  ( ( canvasZone.width / 2 ) + ( winWdth / 4 ) ) });
                $('.weepong-lose', win).css({ x : ( ( canvasZone.width / 2 ) - ( loseWdth + loseWdth / 2 ) ) });
                
                $('.weepong-lose').css('display', 'block');
                $('.weepong-win').css('display', 'block');

                var self = this;
                setTimeout(function() {
                    
                    properties.init = false;
                    self.back();
                    self = null;
                
                }, 3500);

            }

        }
        
    }

    Pong.prototype.loop = function() {

        if (properties.init === true) {
            this.contexto.clearRect(0, 0, canvasZone.width, canvasZone.height);
            this.finish();
            deltaLoop = (Date.now() - this.tiempoTranscurrido)/1000;
            this.tiempoTranscurrido = Date.now();
                
                if (keys1.length <= 0) {
                    
                    directions.player1 = Direccion.QUIETO;

                } else if (keys1[0] === 'up') {

                    directions.player1 = Direccion.ARRIBA;

                } else if (keys1[0] === 'down') {

                    directions.player1 = Direccion.ABAJO;

                } 

                if(properties.players === 2) {
        
                    if (keys2.length <= 0) {

                        directions.player2 = Direccion.QUIETO;

                    } else if (keys2[0] === 'up') {

                        directions.player2 = Direccion.ARRIBA;

                    } else if (keys2[0] === 'down') {

                        directions.player2 = Direccion.ABAJO;

                    } 

                } else if(properties.players === 1) {

                    directions.player2 = this.ia.direccion();

                }

            if(!properties.paused) {

                this.palas[0].mover(deltaLoop, directions.player1);
                this.palas[1].mover(deltaLoop, directions.player2);

                quantumLoop = parseInt( deltaLoop / 0.005, 10 );
            
                for(var i = 0; i < quantumLoop; i++) {

                    this.pelota.mover(0.005);

                    if (this.pelotas.length > 0) {

                        this.pelotas[0].mover(0.005);
                        
                    }

                }

                quantumLoop = deltaLoop - quantumLoop * 0.005;
                this.pelota.mover(quantumLoop);

                if (this.pelotas.length > 0) {

                    this.pelotas[0].mover(0.005);

                }

            }

            this.dibujarMundo();

            if (this.events && this.events.draw && !properties.paused) {
                
                this.events.dibujar(this.contexto);
                this.events.givePower(this.pelota, this.palas, this.contexto, this);
            
            }

            this.palas[0].dibujar(this.contexto);
            this.palas[1].dibujar(this.contexto);
            
            if (this.pelotas.length > 0) {
                
                this.pelotas[0].dibujar(this.contexto);
            
            }

            if (this.barreras.length > 0) {
                
                this.barreras[0].dibujar(this.contexto);
                this.barreras[1].dibujar(this.contexto);

            };


            this.pelota.dibujar(this.contexto);
            selfLoop = this;

            properties.rafid = requestAnimationFrame( function(){

                selfLoop.loop();
                selftLoop = null;

            });

        }

    }

    Pong.prototype.practicar = function() {
        
        if (properties.init === true) {
            
            deltaLoop = (Date.now() - this.tiempoTranscurrido)/1000;
            this.tiempoTranscurrido = Date.now();
            this.palas[1].alto = 0;
                
                if (keys1.length <= 0) {
                    directions.player1 = Direccion.QUIETO;
                } else if (keys1[0] === 'up') {
                    directions.player1 = Direccion.ARRIBA;
                } else if (keys1[0] === 'down') {
                    directions.player1 = Direccion.ABAJO;
                } 

            if(!properties.paused) {
                // MOVER PALAS
                this.palas[0].mover(deltaLoop, directions.player1);
                quantumLoop = parseInt( deltaLoop / 0.005, 10 );
            
                for( var i = 0; i < quantumLoop; i++ ) {
                    this.pelota.mover(0.005);
                }
                quantumLoop = deltaLoop - quantumLoop * 0.005;
                this.pelota.mover(quantumLoop);
            }

            this.contexto.clearRect(0, 0, canvasZone.width, canvasZone.height);
            this.dibujarMundo();

            this.palas[0].dibujar(this.contexto);
            this.contexto.fillStyle = "#FFF";
            this.contexto.fillRect(canvasZone.width - this.pelota.lado, 0, this.pelota.lado, canvasZone.height);
            this.pelota.dibujar(this.contexto);

            selfLoop = this;    
            properties.rafid = requestAnimationFrame( function(){ selfLoop.practicar(); });
        }
    
    }

    /*#####################################################################################################
    ##################################          CLASE PALA           ######################################
    #######################################################################################################*/

    function Pala(x, l, v){
        // PROPIEDADES
        this.ancho = canvasZone.width / 35;
        this.alto  = canvasZone.height / l;
        this.pos = new Vector2D(x, canvasZone.height/2);
        this.velocidad = v;
        this.color = properties.colorDefault;
    
    }

    Pala.prototype.mover = function(delta, direccion){
        var distancia = Math.round(delta * this.velocidad);
        switch(direccion) {
            case 1:
                this.pos.y -= distancia;
                this.pos.y = Math.max(this.alto / 2, this.pos.y);
                break;
            case 2:
                this.pos.y += distancia;
                this.pos.y = Math.min(canvasZone.height - this.alto / 2, this.pos.y);
                break;
        }
    
    }
    
    Pala.prototype.dibujar = function(contexto){
        contexto.fillStyle = this.color;
        contexto.fillRect(this.pos.x - this.ancho / 2, this.pos.y - this.alto / 2, this.ancho, this.alto);
    
    }

    Pala.prototype.medio = function(game) {
        if (($('.weepong-canvas').height()/2 + game.palas[1].alto) > game.palas[1].pos.y && ($('.weepong-canvas').height()/2 - game.palas[1].alto) < game.palas[1].pos.y) return false;
        return true
    
    }

    /*#####################################################################################################
    #################################          CLASE PELOTA           #####################################
    #######################################################################################################*/

    function Pelota(pong, iv){
        
        // PROPIEDADES
        this.posIni = new Vector2D(canvasZone.width / 2, canvasZone.height / 2);
        this.posIni = this.posIni.rotar(20);
        this.pos;
        this.pong = pong;

        this.color = properties.colorDefault;
        this.lado = canvasZone.width / 35;
        this.velocidad = 300;
        this.velocidadIni = 300;
        this.incrementoVelocidad = iv;
        this.maxAngulo = 60;
        this.velocidad = this.velocidadIni;
        this.vector;
        this.inicio(-1);

    }

    Pelota.prototype.incrementarVelocidad = function() {
        
        this.velocidad += this.incrementoVelocidad;
        this.vector    =  this.vector.normalizar().escalar( this.velocidad );
    
    }

    Pelota.prototype.dibujar = function(contexto) {
        contexto.fillStyle = this.color;
        contexto.fillRect(this.pos.x - this.lado/2, this.pos.y - this.lado/2, this.lado, this.lado);
    
    }

    Pelota.prototype.inicio = function(direccion) {
        this.pos       = this.posIni;
        this.velocidad = this.velocidadIni;
        this.vector    = new Vector2D(direccion * this.velocidad, 0);
    
    }

    Pelota.prototype.sacar = function(direccion) {
        this.pos       = new Vector2D(canvasZone.width / 2, canvasZone.height / 2);
        this.velocidad = this.velocidadIni;
        this.vector    = new Vector2D(direccion * this.velocidad, 0);
    
    }

    Pelota.prototype.mover = function(delta) {

        var mitad = this.lado / 2;
        
        if (this.vector != undefined) this.pos = this.pos.sumar(this.vector.escalar(delta));

        // Player 2 gol
        if(this.pos.x - mitad < 0){
            
            this.pong.puntuaciones[1]++;
            
            if (this.pong.mode === Modes.MATCH) {
                
                scoreFirst.html(this.pong.puntuaciones[0]);
                scoreSecond.html(this.pong.puntuaciones[1]);

            } 
            
            // Event killer
            if (this.pong.events) { 
                
                if (properties.activePower) {
                 
                    this.pong.events.events[properties.activePower].killFunction();
                
                }

            }

            // Collision sound (If sound is enable)
            if (properties.sound) {
                
                SONIDOS.gol.play();

            }

            // Prepare ball
            this.velocidadIni = 0;
            this.sacar(1);
            var self = this;

            setTimeout(function () {
                
                self.velocidadIni = 300;
                self.sacar(1);

            }, 2000);

            // Set colision to 0 if you're playing in practice mode
            if (this.pong.mode === Modes.PRACTICE) {
                
                this.pong.colisiones = 0;

            }

        }
        
        if(this.pos.y - mitad < 0){
            this.pos.y = mitad;
            this.vector.y *= -1;
            if (properties.sound) {
                SONIDOS.plop.play();
            }
        }

        // Player 1 gol
        if (this.pong.mode != Modes.PRACTICE) {
            
            if(this.pos.x + mitad > canvasZone.width){
            
                this.pong.puntuaciones[0]++;
            
                if (this.pong.mode === Modes.MATCH) {
                
                    scoreFirst.html(this.pong.puntuaciones[0]);
                    scoreSecond.html(this.pong.puntuaciones[1]);
                
                } else if(this.pong.mode === Modes.PRACTICE){
                    
                    scoreFirst.html(this.pong.colisiones);
                
                }

                if (this.pong.events) {  

                    if (properties.activePower) {
                     
                        this.pong.events.events[properties.activePower].killFunction();
                    
                    }

                }
                
                this.pong.ia.getFallo();
                
                if (properties.sound) {
                    SONIDOS.gol.play();
                }
                

                this.velocidadIni = 0;
                this.sacar(-1);
                var self = this;

                setTimeout(function () {
                    self.velocidadIni = 300;
                    self.sacar(-1);
                }, 2000);
            
            }
        }

        // Collision with wall
        if(this.pos.y + mitad > canvasZone.height){
            
            this.pos.y = canvasZone.height - mitad;
            this.vector.y *= -1;
            
            if (properties.sound) {
                SONIDOS.plop.play();
            }

        }

        var vector;

        // Collisions
        if(this.vector != undefined) {

            if(this.pong.mode === Modes.MATCH) {
                
                // Paddle 1 & 2 collision
                
                if(this.vector.x < 0 && this.colisiona(this.pong.palas[0])) {
                        
                    this.vector.x *= -1;

                    if (this.velocidad < 7000) {
                        
                        this.incrementarVelocidad();

                    }

                    vector = this.vector.clonar();
                    this.pong.ia.getFallo();
                    this.vector = this.vector.rotar(this.pos.y - this.pong.palas[0].pos.y);
                    
                    if (properties.sound) {
                        
                        SONIDOS.beep.play();

                    }
 
                } else if (this.vector.x > 0 && this.colisiona(this.pong.palas[1])) {
                       
                    this.vector.x *= -1;
                    
                    if (this.velocidad < 7000) {
                        
                        this.incrementarVelocidad();

                    }

                    vector = this.vector.clonar();
                    this.vector = this.vector.rotar(this.pong.palas[1].pos.y - this.pos.y);

                    if (properties.sound) {
                        
                        SONIDOS.beep.play();

                    }           

                } 

                // Events-walls collisions
                if (this.pong.barreras.length > 0) {

                    if (this.pong.barreras[0].colision(this)) {

                        this.vector.x *= -1;

                        vector = this.vector.clonar();
                        this.vector = this.vector.rotar(this.pong.barreras[0].y - this.pos.y);
                        
                        if (properties.sound) {
                            SONIDOS.beep.play();
                        }

                    } else if (this.pong.barreras[1].colision(this)) {

                        this.vector.x *= -1;

                        vector = this.vector.clonar();
                        this.vector = this.vector.rotar(this.pong.barreras[1].y - this.pos.y);
                        
                        if (properties.sound) {
                            SONIDOS.beep.play();
                        }

                    } 
                }

            }   else if(this.pong.mode === Modes.PRACTICE) {
                
                // Paddle and wall collision
                if(this.vector.x < 0 && this.colisiona(this.pong.palas[0])) {

                    this.vector.x *= -1;
                    this.incrementarVelocidad();
                    this.pong.colisiones += 1;

                    if(this.pong.mode === Modes.PRACTICE){
                        scoreFirst.html(this.pong.colisiones);
                    } 

                    vector = this.vector.clonar();
                    this.vector = this.vector.rotar(this.pos.y - this.pong.palas[0].pos.y);
                    
                    if (properties.sound) {
                        SONIDOS.beep.play();
                    }

                } else if(this.pos.x >= canvasZone.width - this.lado) {
                    
                    this.pos.x = canvasZone.width - this.lado
                    this.vector.x *= -1;
                    this.incrementarVelocidad();
                    if (properties.sound) {
                        SONIDOS.beep.play();
                    }
                
                }

            }
        }

        var angulo = this.vector.getAnguloRelativo();

        if(angulo > this.maxAngulo || angulo < -this.maxAngulo) {
            this.vector = vector;
        }
    
    }

    Pelota.prototype.colisiona = function(pala){
        
        var mitad = this.lado/2;

        if (this.pos.x + mitad < pala.pos.x - pala.ancho/2) return false;
        if (this.pos.y + mitad < pala.pos.y - pala.alto/2)  return false;
        if (this.pos.x - mitad > pala.pos.x + pala.ancho/2) return false;
        if (this.pos.y - mitad > pala.pos.y + pala.alto/2)  return false;
        
        return true;
    
    }

    /*#####################################################################################################
    ####################################       CLASE VECTOR       #########################################
    #######################################################################################################*/

    function Ia(pelota,pala,alto,jugador) {
        
        this.pelota     = pelota;
        this.pala       = pala;
        this.alto       = alto;
        this.jugador    = jugador;
        this.prediccion = null;
        this.fallo

    }
    
    Ia.prototype.calcularRebotes = function() {
        if (this.prediccion!=null) return;
        
        var tiempo    = Math.abs((this.pala.pos.x-this.pelota.pos.x)/this.pelota.vector.x);
        var y         = this.pelota.vector.y*tiempo+this.pelota.pos.y;
        var inferior  = this.pelota.lado;
        var superior  = this.alto-this.pelota.lado;
    
        while(y < inferior || y > superior) {
    
            if (y < inferior) {
                y = -y + inferior*2;
            } else {
                y = superior*2-y;
            }
    
        }
    
        this.prediccion = y;
    
    }
    
    Ia.prototype.getFallo = function() {
        
        var ops = [1, 2];
        this.fallo = (ops[ parseInt(Math.random()*ops.length, 10 )]);
    
    }

    Ia.prototype.direccion = function() {
        
        var ideal;

        if (this.jugador === 1 && this.pelota.vector.x > 0 || this.jugador === 2 && this.pelota.vector.x < 0) {
            ideal = this.alto/2;
            this.prediccion = null;
        } else {
            this.calcularRebotes();
            ideal = this.prediccion;
        }

        if (properties.difficult === 'easy') {
            if (this.fallo === 1) {
                ideal += 60; 
            } else if (this.fallo === 2) {
                ideal -= 60;
            }
        } else if (properties.difficult === 'medium'){
            if (this.fallo === 1) {
                ideal += 35; 
            } else if (this.fallo === 2) {
                ideal -= 35;
            }            
        } else if (properties.difficult === 'difficult') {
            if (this.fallo === 1) {
                ideal += 10; 
            } else if (this.fallo === 2) {
                ideal -= 10;
            }
        }
        
        if (ideal - this.pelota.lado/2 < this.pala.pos.y - this.pala.alto/4) {
            return Direccion.ARRIBA;
        }
        
        if (ideal + this.pelota.lado/2 > this.pala.pos.y + this.pala.alto/4) {
            return Direccion.ABAJO;
        }

        return Direccion.QUIETO;

    }

    /*#####################################################################################################
    ##############################              CLASE EVENTO            ###################################
    #######################################################################################################*/

    function Evento (time, interval, timeout, pong, init, kill) {

        this.duracion     = time;
        this.pong         = pong;
        this.initFunction = init;
        this.killFunction = kill;

        this.interval     = interval;
        this.timeout      = timeout;

    }

    /*#####################################################################################################
    ##############################       CLASE QUE LANZA EL EVENTO      ###################################
    #######################################################################################################*/

    function EventTrigger(pong) {
        
        this.x     = null;
        this.y     = null;
        this.lado  = canvasZone.width / 20;

        this.pong = pong;

        this.draw = false;
        this.killInit;
        this.killBill;

        this.afects = [0, 1, 2];
        this.afectado;
        this.tipo;

        var selfET = this;
    
        this.events = [

            // Event 0
            new Evento (1500, false, true, pong, function() {

                this.pong.pelota.color   = "#000";
                this.pong.palas[0].color = "#000";
                this.pong.palas[1].color = "#000";
                $('.weepong-score').css('color', '#000');
                this.pong.lineaColor = '#000';

            }, function(obj) {

                obj.pong.pelota.color   = '#FFF';
                obj.pong.palas[0].color = '#FFF';
                obj.pong.palas[1].color = '#FFF'; 
                $('.weepong-score').css('color', '#FFF');
                obj.pong.lineaColor = '#FFF';

            }),

            // Event 1
            new Evento (4500, true, true, pong, function() {

                var self = this;

                properties.killidInterval = setInterval(function() {
                    
                    self.pong.pelota.color   = "#000";
                    self.pong.palas[0].color = "#000";
                    self.pong.palas[1].color = "#000";
                    $('.weepong-score').css('color', '#000');
                    self.pong.lineaColor = "#000";

                    setTimeout(function() {
                            self.pong.pelota.color   = "#FFF";
                            self.pong.palas[0].color = "#FFF";
                            self.pong.palas[1].color = "#FFF";
                            $('.weepong-score').css('color', '#FFF');
                            self.pong.lineaColor = "#FFF";      
                    }, 150);

                }, 300);

            }, function(obj) {

                obj.pong.pelota.color   = "white";
                obj.pong.palas[0].color = "white";
                obj.pong.palas[1].color = "white";
                $('.weepong-score').css('color', 'white');
                obj.pong.lineaColor = "white"; 
                clearInterval(properties.killidInterval);

            }),

            // Evento 2
            new Evento (3500, true, true, pong, function() {
                
                var dir = 0;
                var self = this;

                properties.killidInterval = setInterval(function(){

                    if (dir === 0) {
                
                        self.pong.pelota.pos.y   += canvasZone.height * 0.05;
                        self.pong.palas[0].pos.y += canvasZone.height * 0.05;
                        self.pong.palas[1].pos.y += canvasZone.height * 0.05;
                        $('.weepong-score').css('top', $('.weepong-score').position().top + canvasZone.height * 0.05);
                        dir = 1;

                    } else if (dir === 1) {
                
                        self.pong.pelota.pos.y   -= canvasZone.height * 0.05;
                        self.pong.palas[0].pos.y -= canvasZone.height * 0.05;
                        self.pong.palas[1].pos.y -= canvasZone.height * 0.05;
                        $('.weepong-score').css('top', $('.weepong-score').position().top - canvasZone.height * 0.05);
                        dir = 0;
                    
                    }

                }, 10);

            }, function() {

                $('.weepong-score').css('top', 15);
                clearInterval(properties.killidInterval);
                properties.activePower = 2;

            }),

            // Evento 3
            new Evento (0, false, false, pong, function() {

                if (selfET.afectado === 0) {

                    this.pong.palas[0].alto = canvasZone.height/3;
                    this.pong.palas[1].alto = canvasZone.height/3;

                } else if (selfET.afectado === 1) {
                    
                    this.pong.palas[0].alto = canvasZone.height/3;
                
                } else if (selfET.afectado === 2) {
                
                    this.pong.palas[1].alto = canvasZone.height/3;
                
                }

            }, function() {

                this.pong.palas[0].alto = canvasZone.height/5;
                this.pong.palas[1].alto = canvasZone.height/5;

            }),

            // Evento 4
            new Evento (0, false, false, pong, function() {

                if (selfET.afectado === 0) {
                    
                    this.pong.palas[0].alto = canvasZone.height/8;
                    this.pong.palas[1].alto = canvasZone.height/8;

                } else if (selfET.afectado === 1) {
                    
                    this.pong.palas[0].alto = canvasZone.height/8;
                
                } else if (selfET.afectado === 2) {
                
                    this.pong.palas[1].alto = canvasZone.height/8;
                
                }

            }, function() {
                
                this.pong.palas[0].alto = canvasZone.height/5;
                this.pong.palas[1].alto = canvasZone.height/5;

            }),

            // Evento 5
            new Evento (5000, true, true, pong, function() {

                var dir = 0;
                var angles = [150, 200, 250, 300, 400];

                var self = this;

                properties.killidInterval = setInterval(function(){
                    
                    if(self.pong.pelota.vector.y < 200) {
                        
                        if (self.pong.pelota.vector.y > -200) self.pong.pelota.vector.y  = angles[Math.floor(Math.random() * angles.length)]
                        
                        self.pong.pelota.vector.y = angles[Math.floor(Math.random() * angles.length)];
                        self.pong.pelota.vector.y *= -1
                    }

                    self.pong.pelota.vector.y *= -1

                }, 700);

            }, function () {

                clearInterval(properties.killidInterval);

            }),

            // Evento 6
            new Evento (5000, false, true, pong, function() {

                this.pong.barreras = [new Barrera(parseInt(Math.random() * ((canvasZone.width  * 0.25) - (canvasZone.width  * 0.35) + 1) + (canvasZone.width  * 0.35), 10), parseInt(Math.random() * ((canvasZone.height * 0.2) - (canvasZone.height * 0.8) + 1) + (canvasZone.height * 0.8), 10)),
                                 new Barrera(parseInt(Math.random() * ((canvasZone.width  * 0.65) - (canvasZone.width  * 0.75) + 1) + (canvasZone.width  * 0.75), 10), parseInt(Math.random() * ((canvasZone.height * 0.2) - (canvasZone.height * 0.8) + 1) + (canvasZone.height * 0.8), 10))];

            }, function() {

                this.pong.barreras = [];

            }),

            // Evento 7
            new Evento (0, false, false, pong, function() {

                this.pong.pelota.lado = canvasZone.width/15;

            }, function() {

                this.pong.pelota.lado = canvasZone.width/35;

            }),

            // Evento 8
            new Evento (0, false, false, pong, function() {

                this.pong.pelota.lado = canvasZone.width/60;

            }, function() {

                this.pong.pelota.lado = canvasZone.width/35;

            }),

            // Evento 9
            new Evento (3500, false, true, pong, function() {

                properties.pelotaVel = this.pong.pelota.velocidad

                this.pong.pelota.velocidad                = 100;
                this.pong.pelota.velocidadIni             = 100;
                this.pong.pelota.incrementoVelocidad      = 0;
                this.pong.pelota.incrementarVelocidad();
                
                this.pong.palas[0].velocidad              = 80;
                this.pong.palas[1].velocidad              = 80;

            }, function() {

                this.pong.pelota.velocidad                = properties.pelotaVel;
                this.pong.pelota.velocidadIni             = 300;
                this.pong.pelota.incrementoVelocidad      = 25;
                this.pong.pelota.incrementarVelocidad();
                
                this.pong.palas[0].velocidad              = 600;
                this.pong.palas[1].velocidad              = 600;

            }),

            // Evento 10
            new Evento (3500, false, true, pong, function() {
                
                this.pong.pelota.velocidad                = properties.pelotaVel;

                this.pong.pelota.velocidad                = 1100;
                this.pong.pelota.velocidadIni             = 1100;
                this.pong.pelota.incrementoVelocidad      = 0;
                this.pong.pelota.incrementarVelocidad();
                
                this.pong.palas[0].velocidad              = 1100;
                this.pong.palas[1].velocidad              = 1100;

            }, function() {
    
                this.pong.pelota.velocidad                = properties.pelotaVel;
                this.pong.pelota.velocidadIni             = 300;
                this.pong.pelota.incrementoVelocidad      = 25;
                this.pong.pelota.incrementarVelocidad();
                
                this.pong.palas[0].velocidad              = 600;
                this.pong.palas[1].velocidad              = 600;

            }),

            // Evento 11
            new Evento (3500, false, true, pong, function() {

                Direccion = { QUIETO: 0, ARRIBA: 2, ABAJO: 1 };

            }, function() {

                Direccion = { QUIETO: 0, ARRIBA: 1, ABAJO: 2 };

            }),

            // Evento 12
            new Evento (5000, false, true, pong, function() {

                this.pong.pelotas = [new Pelota(this.pong, 25)];

                this.pong.pelotas[0].velocidad = this.pong.pelota.velocidad; 
                this.pong.pelotas[0].pos.x     = this.pong.pelota.pos.x;
                this.pong.pelotas[0].pos.y     = this.pong.pelota.pos.y;

                this.pong.pelotas[0].vector    = this.pong.pelota.vector.rotar(this.pong.pelotas[0].pos.y + this.pong.palas[1].pos.y);   
                this.pong.pelotas[0].incrementarVelocidad();

            }, function() {

                this.pong.pelotas = [];

            }),

            // Evento 13
            new Evento (5000, false, true, pong, function() {

                this.pong.pelota.color   = "#000";
                this.pong.palas[0].color = "#000";
                this.pong.palas[1].color = "#000";
                $('.wz-win').css('background', '#FFF');

                pauseText.css('color', '#000');

                this.pong.lineaColor = "#000";

                $('.weepong-score').css('color', '#000');

            }, function() {
                    
                this.pong.pelota.color   = "#FFF";
                this.pong.palas[0].color = "#FFF";
                this.pong.palas[1].color = "#FFF";
                $('.wz-win').css('background', '#000'); 

                pauseText.css('color', '#000')

                this.pong.lineaColor = "#FFF";

                $('.weepong-score').css('color', '#FFF');

            })

        ];

    }

    EventTrigger.prototype.init = function() {
        var self = this;

        clearInterval(this.killInit);
        
        this.killInit = setInterval(function() {

            properties.powerStart = (new Date()).getTime();

            self.x = parseInt(Math.random() * ((canvasZone.width  * 0.75) - (canvasZone.width  * 0.25) + 1), 10) + (canvasZone.width  * 0.25);
            self.y = parseInt(Math.random() * ((canvasZone.height * 0.8) - (canvasZone.height * 0.2) + 1), 10) + (canvasZone.height * 0.2);
            
            self.tipo     = parseInt(Math.random() * self.events.length, 10);
            self.afectado = self.afects[parseInt(Math.random() * self.afects.length, 10)];
            
            self.draw = true;

            setTimeout(function(){
                
                self.draw       = false;
                self.tipo       = false;
                self.x          = null;
                self.y          = null;

            }, 10000);

        }, 20000);

    }

    EventTrigger.prototype.dibujar = function(ctx) {

        if(this.afectado === 0) {
            ctx.fillStyle = '#0033FF';
        } else if(this.afectado === 1) {
            ctx.fillStyle = '#00FF33';
        } else if(this.afectado === 2) {
            ctx.fillStyle = '#FF0000';
        }

        ctx.fillRect(this.x, this.y, this.lado, this.lado);
    
    }

    EventTrigger.prototype.givePower = function(pelota, palas, ctx, pong) {
        
        if (this.colision(pelota)) {
            
            this.x         = null;
            this.y         = null;
            this.draw      = false;
            
            var selfEvent = this.events[this.tipo];

            console.log(this.tipo);

            if (this.tipo === 0) {
                
                clearInterval(properties.killidInterval);

                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();
                
                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {
                    
                    selfEvent.killFunction(selfEvent);
                    properties.activePower = null;

                }, selfEvent.duracion);

            } else if (this.tipo === 1)  {
                
                clearInterval(properties.killidInterval);
                
                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {
                    
                    selfEvent.killFunction(selfEvent);
                    properties.activePower = null;

                }, selfEvent.duracion);

            } else if (this.tipo === 2)  {

                clearInterval(properties.killidInterval);
                
                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {
                    
                    selfEvent.killFunction(selfEvent);
                    properties.activePower = null;

                }, selfEvent.duracion);
                
            } else if (this.tipo === 3)  {

                properties.activePower = this.tipo;

                selfEvent.initFunction();

            } else if (this.tipo === 4)  {

                clearInterval(properties.killidInterval);

                properties.activePower = this.tipo;

                selfEvent.initFunction();

            } else if (this.tipo === 5)  {

                clearInterval(properties.killidInterval);

                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {
                   
                    selfEvent.killFunction();
                    properties.activePower = null;

                }, selfEvent.duracion);

            } else if (this.tipo === 6)  {

                clearInterval(properties.killidInterval);

                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {
                   
                    selfEvent.killFunction();
                    properties.activePower = null;
                    
                }, selfEvent.duracion); 

            } else if (this.tipo === 7)  {

                properties.activePower =  this.tipo;

                selfEvent.initFunction();

            } else if (this.tipo === 8)  {
                
                properties.activePower = this.tipo;

                selfEvent.initFunction();

            } else if (this.tipo === 9)  {

                clearInterval(properties.killidInterval);

                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {

                    selfEvent.killFunction();
                    properties.activePower = null;

                }, selfEvent.duracion);
                
            } else if (this.tipo === 10) {
                
                clearInterval(prperties.killidInterval);

                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function() {

                    selfEvent.killFunction();
                    properties.activePower = null;

                }, selfEvent.duracion);

            } else if (this.tipo === 11) {

                clearInterval(properties.killidInterval);
                
                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction;

                properties.killidTimeout = setTimeout(function () {

                    selfEvent.killFunction();
                    properties.activePower = null;

                }, selfEvent.duracion);

            } else if (this.tipo === 12) {
                
                clearInterval(properties.killidInterval);
                
                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function () {

                    selfEvent.killFunction();
                    properties.activePower = null;

                }, selfEvent.duracion);

            } else if (this.tipo === 13) {

                clearInterval(properties.killidInterval);
                
                properties.activePower = this.tipo;
                properties.eventStarts = Date.now();

                selfEvent.initFunction();

                properties.killidTimeout = setTimeout(function () {

                    selfEvent.killFunction();
                    properties.activePower = null;

                }, selfEvent.duracion);

            } 

        }   
    
    }

    EventTrigger.prototype.colision = function(pelota) {

        if (pelota.pos.y + pelota.lado < this.y) {
            
            return false;

        } else if (pelota.pos.y > this.y + this.lado + 5) {
            
            return false;

        } else if (pelota.pos.x + pelota.lado < this.x) {
            
            return false;

        } else if (pelota.pos.x > this.x + this.lado + 5) {
            
            return false; 

        } else {

            properties.activePower = null;

            pelota.pong.palas[0].alto = canvasZone.height/5;
            pelota.pong.palas[1].alto = canvasZone.height/5;
            pelota.lado = canvasZone.width/35; 

            clearInterval(properties.killidInterval);

            return true;

        }

    }

    /*#####################################################################################################
    ###################################       CLASE BARRERAS        #######################################
    #######################################################################################################*/

    function Barrera(x, y) {
        
        this.x = x;
        this.y = y;
        this.ancho = canvasZone.width  / 35;
        this.alto  = canvasZone.height / 4.5;
    
    }

    Barrera.prototype.colision = function(pelota) {

        if (pelota.pos.y + pelota.lado < this.y) {
            return false;
        } else if (pelota.pos.y > this.alto + this.y) {
            return false;
        } else if (pelota.pos.x + pelota.lado < this.x) {
            return false;
        } else if (pelota.pos.x > this.x + this.ancho) {
            return false;
        } else {
            return true;
        }

    }

    Barrera.prototype.dibujar = function(ctx) {
        
        ctx.fillStyle = "#999";
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    
    }

    /*#####################################################################################################
    ###################################          SONIDOS           ########################################
    #######################################################################################################*/

    var SONIDOS = {
       "beep"   : new Audio("data:audio/ogg;base64,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"),
       "gol"    : new Audio("data:audio/ogg;base64,T2dnUwACAAAAAAAAAAAsDAAAAAAAAGla7cABHgF2b3JiaXMAAAAAAUSsAAAAAAAAAHcBAAAAAAC4AU9nZ1MAAAAAAAAAAAAALAwAAAEAAACVpevOEC3//////////////////8kDdm9yYmlzHQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMDQwNjI5AAAAAAEFdm9yYmlzKUJDVgEACAAAADFMIMWA0JBVAAAQAABgJCkOk2ZJKaWUoSh5mJRISSmllMUwiZiUicUYY4wxxhhjjDHGGGOMIDRkFQAABACAKAmOo+ZJas45ZxgnjnKgOWlOOKcgB4pR4DkJwvUmY26mtKZrbs4pJQgNWQUAAAIAQEghhRRSSCGFFGKIIYYYYoghhxxyyCGnnHIKKqigggoyyCCDTDLppJNOOumoo4466ii00EILLbTSSkwx1VZjrr0GXXxzzjnnnHPOOeecc84JQkNWAQAgAAAEQgYZZBBCCCGFFFKIKaaYcgoyyIDQkFUAACAAgAAAAABHkRRJsRTLsRzN0SRP8ixREzXRM0VTVE1VVVVVdV1XdmXXdnXXdn1ZmIVbuH1ZuIVb2IVd94VhGIZhGIZhGIZh+H3f933f930gNGQVACABAKAjOZbjKaIiGqLiOaIDhIasAgBkAAAEACAJkiIpkqNJpmZqrmmbtmirtm3LsizLsgyEhqwCAAABAAQAAAAAAKBpmqZpmqZpmqZpmqZpmqZpmqZpmmZZlmVZlmVZlmVZlmVZlmVZlmVZlmVZlmVZlmVZlmVZlmVZlmVZQGjIKgBAAgBAx3Ecx3EkRVIkx3IsBwgNWQUAyAAACABAUizFcjRHczTHczzHczxHdETJlEzN9EwPCA1ZBQAAAgAIAAAAAABAMRzFcRzJ0SRPUi3TcjVXcz3Xc03XdV1XVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYHQkFUAAAQAACGdZpZqgAgzkGEgNGQVAIAAAAAYoQhDDAgNWQUAAAQAAIih5CCa0JrzzTkOmuWgqRSb08GJVJsnuamYm3POOeecbM4Z45xzzinKmcWgmdCac85JDJqloJnQmnPOeRKbB62p0ppzzhnnnA7GGWGcc85p0poHqdlYm3POWdCa5qi5FJtzzomUmye1uVSbc84555xzzjnnnHPOqV6czsE54Zxzzonam2u5CV2cc875ZJzuzQnhnHPOOeecc84555xzzglCQ1YBAEAAAARh2BjGnYIgfY4GYhQhpiGTHnSPDpOgMcgppB6NjkZKqYNQUhknpXSC0JBVAAAgAACEEFJIIYUUUkghhRRSSCGGGGKIIaeccgoqqKSSiirKKLPMMssss8wyy6zDzjrrsMMQQwwxtNJKLDXVVmONteaec645SGultdZaK6WUUkoppSA0ZBUAAAIAQCBkkEEGGYUUUkghhphyyimnoIIKCA1ZBQAAAgAIAAAA8CTPER3RER3RER3RER3RER3P8RxREiVREiXRMi1TMz1VVFVXdm1Zl3Xbt4Vd2HXf133f141fF4ZlWZZlWZZlWZZlWZZlWZZlCUJDVgEAIAAAAEIIIYQUUkghhZRijDHHnINOQgmB0JBVAAAgAIAAAAAAR3EUx5EcyZEkS7IkTdIszfI0T/M00RNFUTRNUxVd0RV10xZlUzZd0zVl01Vl1XZl2bZlW7d9WbZ93/d93/d93/d93/d939d1IDRkFQAgAQCgIzmSIimSIjmO40iSBISGrAIAZAAABACgKI7iOI4jSZIkWZImeZZniZqpmZ7pqaIKhIasAgAAAQAEAAAAAACgaIqnmIqniIrniI4oiZZpiZqquaJsyq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7rukBoyCoAQAIAQEdyJEdyJEVSJEVyJAcIDVkFAMgAAAgAwDEcQ1Ikx7IsTfM0T/M00RM90TM9VXRFFwgNWQUAAAIACAAAAAAAwJAMS7EczdEkUVIt1VI11VItVVQ9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV1TRN0zSB0JCVAAAZAAAjQQYZhBCKcpBCbj1YCDHmJAWhOQahxBiEpxAzDDkNInSQQSc9uJI5wwzz4FIoFURMg40lN44gDcKmXEnlOAhCQ1YEAFEAAIAxyDHEGHLOScmgRM4xCZ2UyDknpZPSSSktlhgzKSWmEmPjnKPSScmklBhLip2kEmOJrQAAgAAHAIAAC6HQkBUBQBQAAGIMUgophZRSzinmkFLKMeUcUko5p5xTzjkIHYTKMQadgxAppRxTzinHHITMQeWcg9BBKAAAIMABACDAQig0ZEUAECcA4HAkz5M0SxQlSxNFzxRl1xNN15U0zTQ1UVRVyxNV1VRV2xZNVbYlTRNNTfRUVRNFVRVV05ZNVbVtzzRl2VRV3RZV1bZl2xZ+V5Z13zNNWRZV1dZNVbV115Z9X9ZtXZg0zTQ1UVRVTRRV1VRV2zZV17Y1UXRVUVVlWVRVWXZlWfdVV9Z9SxRV1VNN2RVVVbZV2fVtVZZ94XRVXVdl2fdVWRZ+W9eF4fZ94RhV1dZN19V1VZZ9YdZlYbd13yhpmmlqoqiqmiiqqqmqtm2qrq1bouiqoqrKsmeqrqzKsq+rrmzrmiiqrqiqsiyqqiyrsqz7qizrtqiquq3KsrCbrqvrtu8LwyzrunCqrq6rsuz7qizruq3rxnHrujB8pinLpqvquqm6um7runHMtm0co6rqvirLwrDKsu/rui+0dSFRVXXdlF3jV2VZ921fd55b94WybTu/rfvKceu60vg5z28cubZtHLNuG7+t+8bzKz9hOI6lZ5q2baqqrZuqq+uybivDrOtCUVV9XZVl3zddWRdu3zeOW9eNoqrquirLvrDKsjHcxm8cuzAcXds2jlvXnbKtC31jyPcJz2vbxnH7OuP2daOvDAnHjwAAgAEHAIAAE8pAoSErAoA4AQAGIecUUxAqxSB0EFLqIKRUMQYhc05KxRyUUEpqIZTUKsYgVI5JyJyTEkpoKZTSUgehpVBKa6GU1lJrsabUYu0gpBZKaS2U0lpqqcbUWowRYxAy56RkzkkJpbQWSmktc05K56CkDkJKpaQUS0otVsxJyaCj0kFIqaQSU0mptVBKa6WkFktKMbYUW24x1hxKaS2kEltJKcYUU20txpojxiBkzknJnJMSSmktlNJa5ZiUDkJKmYOSSkqtlZJSzJyT0kFIqYOOSkkptpJKTKGU1kpKsYVSWmwx1pxSbDWU0lpJKcaSSmwtxlpbTLV1EFoLpbQWSmmttVZraq3GUEprJaUYS0qxtRZrbjHmGkppraQSW0mpxRZbji3GmlNrNabWam4x5hpbbT3WmnNKrdbUUo0txppjbb3VmnvvIKQWSmktlNJiai3G1mKtoZTWSiqxlZJabDHm2lqMOZTSYkmpxZJSjC3GmltsuaaWamwx5ppSi7Xm2nNsNfbUWqwtxppTS7XWWnOPufVWAADAgAMAQIAJZaDQkJUAQBQAAEGIUs5JaRByzDkqCULMOSepckxCKSlVzEEIJbXOOSkpxdY5CCWlFksqLcVWaykptRZrLQAAoMABACDABk2JxQEKDVkJAEQBACDGIMQYhAYZpRiD0BikFGMQIqUYc05KpRRjzknJGHMOQioZY85BKCmEUEoqKYUQSkklpQIAAAocAAACbNCUWByg0JAVAUAUAABgDGIMMYYgdFQyKhGETEonqYEQWgutddZSa6XFzFpqrbTYQAithdYySyXG1FpmrcSYWisAAOzAAQDswEIoNGQlAJAHAEAYoxRjzjlnEGLMOegcNAgx5hyEDirGnIMOQggVY85BCCGEzDkIIYQQQuYchBBCCKGDEEIIpZTSQQghhFJK6SCEEEIppXQQQgihlFIKAAAqcAAACLBRZHOCkaBCQ1YCAHkAAIAxSjkHoZRGKcYglJJSoxRjEEpJqXIMQikpxVY5B6GUlFrsIJTSWmw1dhBKaS3GWkNKrcVYa64hpdZirDXX1FqMteaaa0otxlprzbkAANwFBwCwAxtFNicYCSo0ZCUAkAcAgCCkFGOMMYYUYoox55xDCCnFmHPOKaYYc84555RijDnnnHOMMeecc845xphzzjnnHHPOOeecc44555xzzjnnnHPOOeecc84555xzzgkAACpwAAAIsFFkc4KRoEJDVgIAqQAAABFWYowxxhgbCDHGGGOMMUYSYowxxhhjbDHGGGOMMcaYYowxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGFtrrbXWWmuttdZaa6211lprrQBAvwoHAP8HG1ZHOCkaCyw0ZCUAEA4AABjDmHOOOQYdhIYp6KSEDkIIoUNKOSglhFBKKSlzTkpKpaSUWkqZc1JSKiWlllLqIKTUWkottdZaByWl1lJqrbXWOgiltNRaa6212EFIKaXWWostxlBKSq212GKMNYZSUmqtxdhirDGk0lJsLcYYY6yhlNZaazHGGGstKbXWYoy1xlprSam11mKLNdZaCwDgbnAAgEiwcYaVpLPC0eBCQ1YCACEBAARCjDnnnHMQQgghUoox56CDEEIIIURKMeYcdBBCCCGEjDHnoIMQQgghhJAx5hx0EEIIIYQQOucchBBCCKGEUkrnHHQQQgghlFBC6SCEEEIIoYRSSikdhBBCKKGEUkopJYQQQgmllFJKKaWEEEIIoYQSSimllBBCCKWUUkoppZQSQgghlFJKKaWUUkIIoZRQSimllFJKCCGEUkoppZRSSgkhhFBKKaWUUkopIYQSSimllFJKKaUAAIADBwCAACPoJKPKImw04cIDUGjISgCADAAAcdhq6ynWyCDFnISWS4SQchBiLhFSijlHsWVIGcUY1ZQxpRRTUmvonGKMUU+dY0oxw6yUVkookYLScqy1dswBAAAgCAAwECEzgUABFBjIAIADhAQpAKCwwNAxXAQE5BIyCgwKx4Rz0mkDABCEyAyRiFgMEhOqgaJiOgBYXGDIB4AMjY20iwvoMsAFXdx1IIQgBCGIxQEUkICDE2544g1PuMEJOkWlDgIAAAAAAAEAHgAAkg0gIiKaOY4Ojw+QEJERkhKTE5QAAAAAAOABgA8AgCQFiIiIZo6jw+MDJERkhKTE5AQlAAAAAAAAAAAACAgIAAAAAAAEAAAACAhPZ2dTAAQ6LAAAAAAAACwMAAACAAAABiWH6x4wM/8h/yn/Lv8n/yv/Lv8w/yL/KP82LSknLScxMTGUJgVmAzDBa1YJNqp+tpGyzpuSjWQk/vsEe6rYtbxTH+eDGpvW+cUX1Q1lfjsTAESsSlHCpAAT5u93CbJCiu9nX5qSOE/2VJAKJtXsfShW8ixsb9u93doeePe1b4MS+mJhFQAaeLWz8noE4jeQxP888+48z/P8p38ehgSJ3QUAcA7YALvjEoBmMIGDB8B18HCwAWI4wAYB62mFzuqLYMBzU36Nl2fy9Th8+PDs6eXN+2jmPBmJk+cDmatWNHCjzgXSEYKASYf1LFVSOUN0uggIgTeLE0W/r5ujBKKUW+NbVgQpqeWHLaE0uZGVRdACq+9OUlpVve3dcZJ0lCXIKq121MvHB23b0vDCY+BzK22ISnstarIjKm3I+rgS1Cv47e2lP0XEQdDvEnEpgVVhHx0hytMC1Ap52KKSSdWEf6aoxJjsBRSRVXuiIJFS+4jSF0llaRZVEsHA+ecOc0YNHhRcnqvM0y56gL53jnZG9u49KZ8W2yFBUNZyBbj5dmP2scBNGwMeiMUZ/P4zrIkynsL3BwCwKGwDnqsKABYMiUeyAKoCPKASADC0HQBGAHCJDzDhGgB7OAIHdI4CwLEBBBSpoAEOHxtsTyNekbGhJDxgBDndyrEaoAJOOSiNERtYiLbOIngWWKDIoaAM2hbNq0meQsyyy0+4JuSANoHksbIEdGBFebPDczCBH8IOMLXuOF8mfFQWHcExsAoQFiMR/gAMlZVZN7OkpsGARyiLVoB5ynaAkwkJeAJ2tpwEt0gcXHXWWRuMWdoETqAG39vxTZCDfWFJEhZI4quIG9BhIvXSQhDUVH6AKbgqSY+vlzrumrkxpn8N7czokc4XF1lyPwkeiaFcJxi5vEQfApV3S6DCBmnOMqS9sVitu2ht515KZBnxNblwrf7dEaBMAD6I5QK5PUDOL5BM+wOAgS7wuQoAAPBfwAMAVAfSB7YEAAAXDh72wAUEmHANHBwcIEHnKOABnaccwwIY9wWx7plfPfPHY5k702wLcjLHgEBKavfAQURSEBlnX1cPaM2DUsgc6q4kDSyojplcb2NQKelpa9ymBaGiRZplJausJXLpxF4jJym1nqSphmQDgVgXW7zVJXqJQTRbXDpmLLHx03GJ1aVHhgNShrgX51GzA7FEfNQ6s5Lt2hHfU7kYyJZ3FbbFNgklDbVl/3VQ19BQwZVWwph1tRVHq/CfNqjgHtta+JBDwYX6CU1brVntmadRKrz0vtzQjuIwS/H8jeAhNERBlxDqLKNcaa3UFtwxtfokpOMpl80CLkvZehkmSCUM6SgVUAb+UkNvMe+SnAA+iOUsOW6geH5Bavw/AACvXMPnKgAAwKgE9gIA/frAlgB0GOjgYAU4uAATboKHh6NAgs4BAHSeVQwN8PDNQW4Fiavw46vWp6FpQisNCKBAaiGcKcAALESOCUQWVgPZCH9KxDiFFcnEg6bA6xDrDSAOyCYYB0ESsnCmdAM3qcHwx9RFguf07OjIHrXAuDA+KyawUk4bEjJLo7PKsaSBLJhChg1uUga+mf7Z4kGrAuPc4iSMyuKyPKcWmMDjHO2pSFaZJHzMjyYFKUw7yhBMCOqfrHTBO/UJH9VcrBo7nVNkqri456awjIdvuOAnefkC7h7knP9BAnAFZGOxSjM9Smzlq2HZaey/ddO4G/Lj9N3z416Rq9NWmdJhpBOtqA8zp1255EqhbQAeiLUCcz2O7JeGasX/BwCAKfH5KAAAwK8DOMAaCB94EgAC4MEBeOASB0y4AsDBERCgczQA0AUEM7UADl8+xGRmdk+nP/+omoKFpHigkQzAEmR0lbCwIlCSxG3LlIFlIQOOKOV48X0kMhGaGbGTNtt1A+ig9Du2VJCEguWQ0hQyhO1Ivx/Zsbo3yhYdZOBKBXY/Fzkpo1Slx5gtSWhcC37ZJwsVhWalLCUJdKOYSo07WKL6PG2b1VWgU9ucHbVo9EyRzWBKBdXvuayGsCijITe2YBbB9WNmLcEpap/42UJpIeirrdY4CuH0rhy6M/LIDxcWxTaM1fTfDjKIcmI6yMx8x5vb61yrIRj27ZoMINoFXCnFV8iGXZZ666H0nH12g6O1i7PGeyM/hgkAPojlbTluIOcTUsr8PwAYxPzE5yMAAMCPAPYCAKYPPAEAGOYArIGDSzDhBsHBw5EQoHA08IANwAmtIAByb2LMl35Kpof3e3lDkSpNDi9IIol1VLwCvVbwDiRBcdghtCCipRHRmkISYhWLHp6CtH7lhRQDEAU6StTFfC5RtUKlQlaJhMqa4R8Yo9dKl2NeYwxatD1ORxyztAV+XlSs5S1AHiu77iJV6pvtax+ppn5bdImylIYRtUVyhYSKOfdsdyOgOTcUz5RS093gO58sqLvUjbIIHtEFPmYJXlpRZoF4qToGYQCigsgTG/3EWzNeXfHBqA6ZG7dsmsPMAx93ddi5ORvSq/ounXzUlh36UcHwIjGl7OiWZ1bclNNhJNVaLGKPSzB9iqeTIfWARegDAD6IBbbYj4Xi/BRIeQrfDwAA7St4PgIADRbEI1gAVYH0gacAWAD4wMHBDngBoASYcEOBh4Oj4IDCAYDJEhIBpxQkwP1PA/bTNJ1b714VzQ9N2zcHovQAA2wysgykApjUYyYLjB3OALsTog2UWhSem0wLJ3SXp5qFRtGGbfcz4AFZ2CvgVQDKB2pIXhMkJlikjsIKFgEre1eKRxiaYIf/A22gyKDUhNYAnGDPZBENWdhRGVZxC5WEp/C1DWUyZmlpYMpEDZYkyxXIQTM5bRPOwYAxy+Mmagg56oU9J/WxCxbnFVt1KEEHhCgUuKL5hFbuyEudRdMnp9HnlY+OEjlk7gFlwHBQMj9VaFUIgzQVoLb8RAgMYghh8oY1h11xFpXMk4Nox9l6wzBULU7WsMgmAR6ItQN9foqMByji+wMAgKAAfH4vAAD4AOwFAIwe2AKABgMN1sAlPgG4BsDDARIUDuAAHWmVhQA4fC9wORVzuJqV/KDGEunZ9uiZSEohwnpGphpYEFgkLYMggBJhWYdekXoK4jDupxDhrqRGamBBMErqmzTpxKGSokwSceMlNQo9EtYS80UVGgb793QRoUcdzWqD8KCFtFJfpLWOJ2K9ksMl9gjTzfOgFZLJ+AotiPeou22FFRfFs/K0UaHR8QP2rBQPqqPIE43qSgcbZaWlCWXddnpHxSnco76QqXIkAaDa4/m5lL14Rv9S/5/QSCSo3N8aGOiUY+VAo8OiUkleS0m7LEu7/i4SzN22GNcXX24IxbvvYOt7n49VPmc+NCsbpA1+iCUVeR4g9wvClvl/ADDQr+HzGwAAKAvggQXoBwgfUABgATzYAaAAgIMHJtwEBwdHQoLCUQBAJyUEQwJkIbH+urE6NvXso4RNCj15fZdWh/Qi3ixUlC0J0JUy11hsU8BZywOuiOiUlFw7ml73VKgEZ07ID8H7FJBGmsQDFUAifpUAuigpqcoSKltlwE3wgaQPTbz0JBooEuJAJJ+Wt1ST0BPidyRkQujchiWNDxVZlC2Z/STUxD0pfkGJVBm0bJB53JW4pk9BiTco0QoQQY3wI+feKIrHSCUlKHLqzFjo5bhoWhg11ugpNzsTxRlLp1FTjownZwLyH0UD7Oul46QXBiUKBCzXjm+A/ZIZgpwfs7ISKtO4ECD2epkvBqkP5Nav0WZ7dQk8lnjlVC1hV0j+TSDCy8KK3w8AACR2BwD4BiwB6we6AKDBMDs4oASAC3yACVcAeDgCDxSOAh7QycIwFFJjba8v1Rh8aDi8lRlGOwkiIeHDW6/mek7psOp1bsAqgII8T3zobAl6unNLiVD05wZFnEr2QJOEQAWSsfa36G7iq5B4cn7xKVQSv1z6r1DCoqBHiWgDlEGZETWblaAapd8enHIgiySUG3exwddIFrfY62LiHc6WftWGlTum72L1VKmCJVWX42iELrzdDmJxxki0hB+boVFB+ZvATbwgobUTULwL17quGVvTM/fn7rvvfWXno3f/Z4OOrScdGAyAKn39mxQjwwn97wXESEUJmaQgmo/jk9jYedmQ/5NBNQzjtZL/2QsQuj5b2XpBBq7oGmcp2AXfnR5kSfAAhD79lmm31gSFArervwKPiECpKqYRWgrZEzeDTCgDggL338/T6TQxxaLswUIBpEL1TKQFKnhrvwR4uOTDESa5dqQvb3H5pp4ace0MJRlhdiLLkCRGaEukQnVYmCORi8POu0kJSMGti8AaMBL5ySbcg9/JDFkeVXY5mD2uJAGMQn1cHrIgY/baAShcImAP4GXVb5dcnitLjUUp6Uq5dCdyLY7BqLQS+9q6eAOURj0MVBDgf76HhAu+xCANFAQFleYB1gqxuWCFwPHaVuzOlXKm5AScSkXONgf1sHy/AuWK42hb7KXxGNMq86/wbxlEjZX7JvyaYvM2ZxXJxxXk63cXc6EEhDo90oMMMgz7hqAcezgjt7brcRN+qAzWEfHHLCy+7ZuaUfN8Ck6Zg6zsyaf1YIuoCYT9Srnd6MgTb5X6mwXSslfmT4l6Jd6HZSubXtnI/KXwvdDL7AkOmKUeqlyPcBeG6wE="),
       "plop"   : new Audio("data:audio/ogg;base64,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")
    };

    /*#####################################################################################################
    ####################################       CLASE VECTOR       #########################################
    #######################################################################################################*/

    //Vectores
    function Vector2D(x, y){
        
        this.x = x;
        this.y = y;

    }

    Vector2D.prototype.longitud = function(){
        
        return( Math.sqrt( this.x * this.x + this.y * this.y ) );

    };

    Vector2D.prototype.escalar = function( e ){
        
        return( new Vector2D( this.x * e, this.y * e ) );

    };

    Vector2D.prototype.sumar = function( v ){
        
        return( new Vector2D( this.x + v.x, this.y + v.y ) );

    };

    Vector2D.prototype.normalizar = function(){

        var vec;
        var lon = this.longitud();

        if( lon !== 0 ) {
            vec = this.escalar( 1 / lon );
        } else {
            vec = new Vector2D( 0, 0 );
        }
        return vec;

    };

    Vector2D.prototype.rotar = function(angulo){

        var radianes = angulo * Math.PI / 180;
        var x = this.x * Math.cos(radianes) - this.y * Math.sin(radianes);
        var y = this.x * Math.sin(radianes) + this.y * Math.cos(radianes);

        x = Math.round(x * 100);
        if(x !== 0) x /= 100;

        y = Math.round(y * 100);
        if (y !== 0 ) y /= 100;

        return new Vector2D( x, y );

    };

    Vector2D.prototype.getAngulo = function(){
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    };

    Vector2D.prototype.getAnguloRelativo = function(){

        var angulo = this.getAngulo();

        if( angulo >= 180 ) angulo -= 180;
        if( angulo > 90 ) angulo = 180 - angulo;
        if( angulo <= -180 ) angulo += 180;
        if( angulo < -90 ) angulo = -180 - angulo;

        return angulo;

    };

    Vector2D.prototype.clonar = function(){
        return new Vector2D( this.x, this.y );
    };

    $(win)

        .on('click', '.weepong-selection-oneplayer', function(){
           
            transiciones.toSinglePlayer();

        })

        .on('click', '.weepong-difficult-easy', function(){
            
            transiciones.easyMode();

        })

        .on('click', '.weepong-difficult-medium', function(){
            
            transicionws.mediumMode();

        })

        .on('click', '.weepong-difficult-hard', function(){
            
            transiciones.hardMode();

        })

        .on('click', '.weepong-difficult-impossible', function(){
            
            transiciones.impossibleMode();

        })

        .on('click', '.weepong-selection-twoplayers', function(){
            
            transiciones.toMultiPlayer();

        })

        .on('click', '.weepong-type-normal', function(){
            
            transiciones.normalMode();

        })

        .on('click', '.weepong-type-awesome', function(){
            

            transiciones.awesomeMode();

        })

        .on('click', '.weepong-selection-practice', function(){
            
            transiciones.practiceMode();
        
        })

        .on('click', '.weepong-selection-instructions', function(){
            
            transiciones.toInstructions();
        
        })

        .on('wz-win-close', function(){
            
            cancelRequestAnimFrame(properties.rafid);
        
        })

        .key('p', function(){
            
            if(!properties.menu){
                
                if(properties.paused){
                    
                    $('#sound').css('display', 'none');
                    pauseText.css('display', 'none');
                    properties.paused = false;

                    if (properties.activePower) {

                        if (pong.events.events[properties.activePower].timeout) {

                            if (pong.events.events[properties.activePower].interval) pong.events.events[properties.activePower].initFunction();

                            properties.killidTimeout = setTimeout(function() {

                                console.log('no más');

                                pong.events.events[properties.activePower].killFunction(pong.events.events[properties.activePower]);
                                clearTimeout(properties.killidTimeout);

                            }, properties.eventTime);

                        }

                    }

                } else {
                   
                    $('#sound').css('display', 'block');
                    pauseText.css('display', 'block');
                    properties.paused = true;

                    if (properties.activePower) {

                        if (pong.events.events[properties.activePower].timeout) {

                            clearTimeout(properties.killidTimeout);
                            
                            var time = Date.now() - properties.eventStarts;
                            properties.eventTime = pong.events.events[properties.activePower].duracion - time;

                            if(pong.events.events[properties.activePower].interval) {
                                
                                clearInterval(properties.killidInterval);

                            }

                        }

                    }

                }
            
            }

        })

        // teclas

        .key('up', function(){

                if(properties.menu) {            

                    if(pantallas.weepongSelection.css('display') === 'block') {

                        if (properties.select > 0) {
                            properties.select -= 1;
                        } else if (properties.select === 0) {
                            properties.select = properties.menus.main.length - 1;
                        }

                        for(var i = 0; i < properties.menus.main.length; i++) {
                            properties.menus.main[i].attr('id', ' ');
                        }  

                        properties.menus.main[properties.select].attr('id', 'selected');

                    } else if(pantallas.weepongDifficult.css('display') === 'block' ) {

                        if (properties.select > 0) {
                            properties.select -= 1;
                        } else if (properties.select === 0) {
                            properties.select = properties.menus.single.length - 1;
                        }

                        for(var i = 0; i < properties.menus.single.length; i++) {
                            properties.menus.single[i].attr('id', ' ');
                        }  

                        properties.menus.single[properties.select].attr('id', 'selected');

                    } else if(pantallas.weepongType.css('display') === 'block' ) {

                        if (properties.select > 0) {
                            properties.select -= 1;
                        } else if (properties.select === 0) {
                            properties.select = properties.menus.doble.length - 1;
                        }

                        for(var i = 0; i < properties.menus.doble.length; i++) {
                            properties.menus.doble[i].attr('id', ' ');
                        }  

                        properties.menus.doble[properties.select].attr('id', 'selected');

                    }  

                } else {
                    
                    if (pong.mode === Modes.MATCH) {
                        
                        if(properties.players === 2) {
                            keys2.unshift('up');
                        } else if (properties.players === 1) {
                            keys1.unshift('up');
                        }

                    } else if (pong.mode === Modes.PRACTICE) {
                        keys1.unshift('up');
                    }

                }

            }, null, function(){
                
                if (properties.menu === false) {

                    if (pong.mode === Modes.MATCH) {
                        
                        if(properties.players === 2) {
                            
                            if(keys2.length > 0 && keys2[0] === 'up') {
                                keys2.shift();
                            } else if(keys2.length > 0 && keys2[1] === 'up') {
                                keys2.pop();
                            }

                        } else if (properties.players === 1) {
                            
                            if(keys1.length > 0 && keys1[0] === 'up') {
                                keys1.shift();
                            } else if(keys1.length > 0 && keys1[1] === 'up') {
                                keys1.pop();
                            }

                        }

                    } else if (pong.mode === Modes.PRACTICE) {
                        
                        if(keys1.length > 0 && keys1[0] === 'up') {
                            keys1.shift();
                        } else if(keys1.length > 0 && keys1[1] === 'up') {
                            keys1.pop();
                        }

                    }

                }

            }

        )

        .key('down', function(){
                if (properties.menu) {
                
                    if(pantallas.weepongSelection.css('display') === 'block') {

                        if (properties.select < properties.menus.main.length - 1) {
                            properties.select += 1;
                        } else if (properties.select === properties.menus.main.length - 1) {
                            properties.select = 0;
                        }

                        for(var i = 0; i < properties.menus.main.length; i++) {
                            properties.menus.main[i].attr('id', '');
                        }  

                        properties.menus.main[properties.select].attr('id', 'selected');

                    } else if(pantallas.weepongDifficult.css('display') === 'block' ) {

                        if (properties.select < properties.menus.single.length - 1) {
                            properties.select += 1;
                        } else if (properties.select === properties.menus.single.length - 1) {
                            properties.select = 0;
                        }

                        for(var i = 0; i < properties.menus.single.length; i++) {
                            properties.menus.single[i].attr('id', '');
                        }  

                        properties.menus.single[properties.select].attr('id', 'selected');

                    } else if(pantallas.weepongType.css('display') === 'block' ) {

                        if (properties.select < properties.menus.doble.length - 1) {
                            properties.select += 1;
                        } else if (properties.select === properties.menus.doble.length - 1) {
                            properties.select = 0;
                        }

                        for(var i = 0; i < properties.menus.doble.length; i++) {
                            properties.menus.doble[i].attr('id', '');
                        }  

                        properties.menus.doble[properties.select].attr('id', 'selected');

                    }  

                } else {            
                    
                    if (pong.mode === Modes.MATCH) {
                        
                        if(properties.players === 2) {
                            keys2.unshift('down');
                        } else if (properties.players === 1) {
                            keys1.unshift('down');
                        }

                    } else if (pong.mode === Modes.PRACTICE) {
                        keys1.unshift('down');
                    }

                }

            }, null, function(){
                
                if(properties.menu === false) {            
                    
                    if (pong.mode === Modes.MATCH) {
                        
                        if(properties.players === 2) {
                            if(keys2.length > 0 && keys2[0] === 'down') {
                                keys2.shift();
                            } else if(keys2.length > 0 && keys2[1] === 'down') {
                                keys2.pop();
                            }
                        } else if (properties.players === 1) {
                            if(keys1.length > 0 && keys1[0] === 'down') {
                                keys1.shift();
                            } else if(keys1.length > 0 && keys1[1] === 'down') {
                                keys1.pop();
                            }
                        }
                    
                    } else if (pong.mode === Modes.PRACTICE) {
                    
                        if(keys1.length > 0 && keys1[0] === 'down') {
                            keys1.shift();
                        } else if(keys1.length > 0 && keys1[1] === 'down') {
                            keys1.pop();
                        }
                    
                    }

                }

            }
        )

        .key('enter', function() {

            if(pantallas.weepongSelection.css('display') === 'block') {

                for(var i = 0; i < properties.menus.main.length; i++) {
                    properties.menus.main[i].attr('id', ' ');
                }  

                properties.menus.main[0].attr('id', 'selected');

                if (properties.select === 0) {

                    transiciones.toSinglePlayer();
                     
                    for(var i = 0; i < properties.menus.single.length; i++) {
                        properties.menus.single[i].attr('id', ' ');
                    } 

                    properties.menus.single[0].attr('id', 'selected');
                    properties.select = 0;

                } else if (properties.select === 1) {

                    transiciones.toMultiPlayer();                    

                    for(var i = 0; i < properties.menus.doble.length; i++) {
                        properties.menus.doble[i].attr('id', '');
                    }  
                    properties.menus.doble[0].attr('id', 'selected');
                    properties.select = 0;

                } else if (properties.select === 2) {

                    properties.select = 0;
                    transiciones.practiceMode();

                } else if (properties.select === 3) {
            
                    properties.select = 0;
                    transiciones.toInstructions();

                }

            } else if(pantallas.weepongDifficult.css('display') === 'block' ) {

                for(var i = 0; i < properties.menus.single.length; i++) {
                    
                    properties.menus.single[i].attr('id', ' ');
                }  

                properties.menus.single[0].attr('id', 'selected');

                if (properties.select === 0) {

                    properties.select = 0;
                    transiciones.easyMode();      

                } else if (properties.select === 1) {

                    properties.select = 0;
                    transiciones.mediumMode();

                } else if (properties.select === 2) {

                    properties.select = 0;
                    transiciones.hardMode();

                } else if (properties.select === 3) {

                    properties.select = 0;
                    transiciones.impossibleMode();

                }

            } else if(pantallas.weepongType.css('display') === 'block' ) {

                for(var i = 0; i < properties.menus.doble .length; i++) {
                    properties.menus.doble[i].attr('id', '');
                }  

                properties.menus.doble[0].attr('id', 'selected');

                if(properties.select === 0) {

                    properties.select = 0;
                    transiciones.normalMode();

                } else if (properties.select === 1) {

                    properties.select = 0;
                    transiciones.awesomeMode();

                }

            } 

        })

        .on('wz-resize', function() {
            
            $('.weepong-title', win).css('margin-left', (($('.weepong-canvas').width()/2) - $('.weepong-title').width()/4) + 'px');

        })
        
        .on('click', '#sound', function() {
            if (properties.sound) {
                properties.sound = false;
                $('#sound').css('background-image', 'url(https://static.weezeel.com/app/36/nosound.png)');
            } else if (!properties.sound) {
                properties.sound = true;
                $('#sound').css('background-image', 'url(https://static.weezeel.com/app/36/sound.png)');
            }
        })  

        .key('esc', function(){
            properties.select = 0;
            if (pong != undefined) {
                pong.back();
                pong = null;
                properties.menu = true;
                properties.paused = false;
            } else {
                pantallas.weepongSelection.css('display', 'block');
                $('.weepong-title').css('display', 'block');
                pantallas.weepongInstructions.css('display', 'none');                
            }
        })

        .key('w', function(){

            keys1.unshift('up');

        }, null, function(){
            
            if(keys1.length > 0 && keys1[0] === 'up') {
                keys1.shift();
            } else if(keys1.length > 0 && keys1[1] === 'up') {
                keys1.pop();
            }

        })

        .key('s', function(){

            keys1.unshift('down');

        }, null, function(){
            
            if(keys1.length > 0 && keys1[0] === 'down') {
                keys1.shift();
            } else if(keys1.length > 0 && keys1[1] === 'down') {
                keys1.pop();
            }

        })

        .key('ctrl + g', function(){
            
            if (properties.colorDefault === '#FFF') {
                
                for (var i = 0; i < properties.menus.main.length; i++) {
                    properties.menus.main[i].css('color', '#00FF00');
                }

                for (var i = 0; i < properties.menus.single.length; i++) {
                    properties.menus.single[i].css('color', '#00FF00');
                }

                for (var i = 0; i < properties.menus.doble.length; i++) {
                    properties.menus.doble[i].css('color', '#00FF00');
                }

                $('.weepong-win', win).css('color', '#00FF00');
                $('.weepong-lose', win).css('color', '#00FF00');
                pauseText.css('color', '#00FF00');
                scoreFirst.css('color', '#00FF00');
                scoreSecond.css('color', '#00FF00');
                properties.colorDefault = '#00FF00';

            } else if (properties.colorDefault === '#00FF00') {

                for (var i = 0; i < properties.menus.main.length; i++) {
                    properties.menus.main[i].css('color', '#FFF');
                }

                for (var i = 0; i < properties.menus.single.length; i++) {
                    properties.menus.single[i].css('color', '#FFF');
                }

                for (var i = 0; i < properties.menus.doble.length; i++) {
                    properties.menus.doble[i].css('color', '#FFF');
                }

                $('.weepong-win', win).css('color', '#FFF');
                $('.weepong-lose', win).css('color', '#FFF');
                pauseText.css('color', '#FFF');
                scoreFirst.css('color', '#FFF');
                scoreSecond.css('color', '#FFF');
                properties.colorDefault = '#FFF';

            }

        });

    pantallas.weepongSelection.mouseover(function() {

        for(var i = 0; i < properties.menus.main.length; i++) {
            properties.menus.main[i].attr('id', '');
        }

        properties.menus.main[0].mouseover(function() { properties.select = 0; properties.menus.main[properties.select].attr('id', 'selected'); });
        properties.menus.main[1].mouseover(function() { properties.select = 1; properties.menus.main[properties.select].attr('id', 'selected'); });
        properties.menus.main[2].mouseover(function() { properties.select = 2; properties.menus.main[properties.select].attr('id', 'selected'); });
        properties.menus.main[3].mouseover(function() { properties.select = 3; properties.menus.main[properties.select].attr('id', 'selected'); });

    });

    pantallas.weepongSelection.mouseout(function(){

        properties.menus.main[properties.select].attr('id', 'selected');

    });

    pantallas.weepongDifficult.mouseover(function() {

        for(var i = 0; i < properties.menus.single.length; i++) {
            properties.menus.single[i].attr('id', '');
        }

        properties.menus.single[0].mouseover(function() { properties.select = 0; properties.menus.single[properties.select].attr('id', 'selected'); });
        properties.menus.single[1].mouseover(function() { properties.select = 1; properties.menus.single[properties.select].attr('id', 'selected'); });
        properties.menus.single[2].mouseover(function() { properties.select = 2; properties.menus.single[properties.select].attr('id', 'selected'); });
        properties.menus.single[3].mouseover(function() { properties.select = 3; properties.menus.single[properties.select].attr('id', 'selected'); });

    });

    pantallas.weepongDifficult.mouseout(function(){

        properties.menus.single[properties.select].attr('id', 'selected')

    })

    pantallas.weepongType.mouseover(function(){

        for(var i = 0; i < properties.menus.doble.length; i++) {
            properties.menus.doble[i].attr('id', '');
        }

        properties.menus.doble[0].mouseover(function() { properties.select = 0; properties.menus.doble[properties.select].attr('id', 'selected'); })
        properties.menus.doble[1].mouseover(function() { properties.select = 1; properties.menus.doble[properties.select].attr('id', 'selected'); })

    });

    pantallas.weepongType.mouseout(function(){

        properties.menus.doble[properties.select].attr('id', 'selected');

    });
        
});