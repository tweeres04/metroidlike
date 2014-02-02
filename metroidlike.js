(function(){
	var game;
	var circle;
	var ground;
	var item;
	var palette = { yellow: "#BCB968", blue: "#8FA8A2", white: "#CCD4BD", red: "#9E3B36", brown: "#50553F" };
	var player;
	var platform;
	var tilt = 0;

	var powerupEmitter;

	var tileSize;
	//var worldSize = { x: Math.floor(window.innerWidth - (window.innerWidth % tileSize)), y: window.innerHeight - (window.innerHeight % tileSize) };
	var worldSize;
	var groundTiles;
	var platformTiles;
	var itemTiles;

	var levels = [
		[
			"   I                ",
			"   PP   I           ",
			"                    ",
			"       PP           ",			
			"                    ",
			"    P              I",
			"                   P",
			"   PP             PP",
			" I                PP",
			"GGGGGGGGGGGGGGGGGGGG"
		]
	];

	function startGame(level){
		level = levels[level];

		tileSize = 16;
		var tileSizes = [ 128, 96, 64, 32, 24 ];
		var match = false;
		var testSize;

		for(var i = 0; !match && i < tileSizes.length; i++){
			if(level[0].length > level.length){
				testSize = tileSizes[i] * level[0].length;
			} else {
				testSize = tileSizes[i] * level.length;
			}
			if(testSize <= window.innerWidth){
				match = true;
				tileSize = tileSizes[i];
			}
		}
		// if(level[0].length > level.length){
		// 	tileSize = Math.log(window.innerWidth / level[0].length);
		// } else {
		// 	tileSize = Math.log(window.innerHeight / level.length);
		// }

		worldSize = {};
		worldSize.x = level[0].length * tileSize;
		worldSize.y = level.length * tileSize;
		game = new Phaser.Game(worldSize.x, worldSize.y, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
	}

	function preload() {
		
	}

	function create() {
		game.stage.backgroundColor = palette.white;
		game.stage.scale.maxWidth = window.innerWidth;
		game.stage.scale.maxHeight = window.innerHeight;
		game.stage.scale.refresh();

		setupBitmapData();

		platformTiles = game.add.group();
		groundTiles = game.add.group();
		itemTiles = game.add.group();

		createWorld(levels[0]);

		player = new Player();
		game.add.existing(player);

		powerupEmitter = game.add.emitter();
	    powerupEmitter.makeParticles(item);
	    powerupEmitter.gravity = 10;
	    powerupEmitter.minParticleScale = 0.05;
	    powerupEmitter.maxParticleScale = 0.1;
	}

	function update() {
		game.physics.collide(player, platformTiles);
		game.physics.collide(player, groundTiles);
		game.physics.overlap(player, itemTiles, getItem);
		player.update();
	}

	function render() {
		// game.debug.renderRectangle(itemTiles.getAt(0).body);
		// game.debug.renderInputInfo(50, 50);
		// game.debug.renderQuadTree(game.physics.quadTree);
	}

	function getItem(player, item){
		powerupEmitter.x = item.x + Math.floor(tileSize / 2);
		powerupEmitter.y = item.y + Math.floor(tileSize / 2);
		item.kill();
		powerupEmitter.start(true, 1000, null, 20);
	}

	function setupBitmapData(){
		circle = game.add.bitmapData(tileSize, tileSize);
		// circle.context.lineWidth = 3;
		circle.context.fillStyle = palette.red;
		circle.circle(Math.floor(tileSize / 2), Math.floor(tileSize / 2), Math.floor(tileSize / 2) - Math.round(circle.context.lineWidth / 2), true);

		ground = game.add.bitmapData(tileSize, tileSize);
		ground.context.fillStyle = palette.brown;
		ground.context.fillRect(0, 0, tileSize, tileSize);
		// circle.context.moveTo(0, 0);
		// circle.context.lineTo(0, tileSize);
		// circle.context.stroke();

		platform = game.add.bitmapData(tileSize, tileSize);
		// var platformGradient = platform.context.createLinearGradient(0, 0, 0, platform.height);
		// platformGradient.addColorStop(0, palette.blue);
		// platformGradient.addColorStop(0.25, "rgba(143, 168, 162, 0)");
		// platform.context.fillStyle = platformGradient;
		platform.context.fillStyle = palette.blue;
		platform.context.fillRect(0, 0, tileSize, Math.floor(tileSize / 2));
		// platform.context.strokeStyle = palette.brown;
		// platform.context.lineWidth = 5;
		// platform.context.beginPath();
		// platform.context.moveTo(0, 0);
		// platform.context.lineTo(tileSize, 0);
		// platform.context.stroke();

		item = game.add.bitmapData(tileSize, tileSize);
		item.context.fillStyle = palette.yellow;
		item.context.beginPath();
		item.context.moveTo(Math.floor(item.width / 2), 0);
		item.context.lineTo(tileSize, Math.floor(item.height / 2));
		item.context.lineTo(Math.floor(item.width / 2), item.height);
		item.context.lineTo(0, Math.floor(item.height / 2));
		item.context.lineTo(Math.floor(item.width / 2), 0);
		item.context.fill();
	}

	function createWorld(level){
		var tile;
		for(var i = 0; i < level.length; i++){
			for(var j = 0; j < level[i].length; j++){
				var code = level[i][j];
				if(code == "G"){
					tile = groundTiles.create(j * tileSize, i * tileSize, ground);
				} else if(code == "P"){
					tile = platformTiles.create(j * tileSize, i * tileSize, platform);
					tile.body.immovable = true;
				} else if(code == "I"){
					tile = itemTiles.create(j * tileSize, i * tileSize, item);
					tile.body.setSize(16, 16, tileSize / 2 - 8, tileSize / 2 - 8);
				}
				if(tile){
					// tile.body.setSize(60, 60, 2, 2);
				}
			}
		}
		groundTiles.setAll("body.immovable", true);
		groundTiles.setAll("body.allowCollision.left", false);
		groundTiles.setAll("body.allowCollision.right", false);
		groundTiles.setAll("body.allowCollision.down", false);
		platformTiles.setAll("body.immovable", true);
		platformTiles.setAll("body.allowCollision.left", false);
		platformTiles.setAll("body.allowCollision.right", false);
		platformTiles.setAll("body.allowCollision.down", false);
	}

	// Classes
	function Player(){
		var me = this;
		me.speed = tileSize * 5;
		me.cursors = game.input.keyboard.createCursorKeys();

		Phaser.Sprite.call(me, game, tileSize / 2, 0, circle);

		// me.body.collideWorldBounds = true;
		// me.body.bounce.setTo(0.1, 0.1);
		me.anchor.setTo(0.5, 0.5);
		me.body.setSize(tileSize - 5, tileSize - 5);
		me.body.gravity.y = tileSize / 3;
	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		var me = this;

		me.body.velocity.x = 0;

		if((me.cursors.up.isDown || game.input.activePointer.isDown) && me.body.touching.down){
			me.body.velocity.y = -me.speed * 2;
		} else if(me.cursors.down.isDown){
			platformTiles.setAll("body.allowCollision.up", false);
			setTimeout(function(){
				platformTiles.setAll("body.allowCollision.up", true);
			}, 10);
		}
		if(me.cursors.left.isDown || tilt < -0.75){
			me.body.velocity.x = -me.speed;
		} else if(me.cursors.right.isDown || tilt > 0.75){
			me.body.velocity.x = me.speed;
		} /*else if(tilt < -3){

		} else if(tile > 3){

		}*/
	};

	// Helper/Utils
	Phaser.BitmapData.prototype.circle = function(x, y, radius, fill){
		this.context.arc(x, y, radius, 0, Math.PI*2);
		if(fill){
			this.context.fill();
		}
		//this.context.stroke();
	};

	function handleMotionEvent(event) {
		if(window.innerWidth > window.innerHeight){
	    	tilt = event.accelerationIncludingGravity.y;
	    } else {
	    	tilt = -event.accelerationIncludingGravity.x;
	    }
	}

	window.addEventListener("devicemotion", handleMotionEvent, true);

	// Start the game
	startGame(0);
})();