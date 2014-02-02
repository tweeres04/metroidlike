(function(){
	var game;
	var circle;
	var ground;
	var palette = { yellow: "#BCB968", blue: "#8FA8A2", white: "#CCD4BD", red: "#9E3B36", brown: "#50553F" };
	var player;
	var platform;

	var tileSize = 64;
	var worldSize = { x: Math.floor(window.innerWidth - (window.innerWidth % tileSize)), y: window.innerHeight - (window.innerHeight % tileSize) };
	var groundTiles;
	var platformTiles;

	var levels = [
		[
			"           ",
			"   PP      ",
			"           ",
			"       PP  ",			
			"           ",
			"    P      ",
			"          P",
			"   PP    PP",
			"         PP",
			"GGGGGGGGGGG"
		]
	];

	function startGame(){
		game = new Phaser.Game(worldSize.x, worldSize.y, Phaser.CANVAS, 'container', { preload: preload, create: create, update: update, render: render });
	}

	function preload() {
		
	}

	function create() {
		game.stage.backgroundColor = palette.white;

		setupBitmapData();

		platformTiles = game.add.group();
		groundTiles = game.add.group();

		createWorld(levels[0]);

		player = new Player();
		game.add.existing(player);
	}

	function update() {
		game.physics.collide(player, platformTiles);
		game.physics.collide(player, groundTiles);
		player.update();
	}

	function render() {
		// game.debug.renderRectangle(player.body);
		// game.debug.renderInputInfo(50, 50);
		// game.debug.renderQuadTree(game.physics.quadTree);
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
		platform.context.fillStyle = palette.blue;
		platform.context.fillRect(0, 0, tileSize, tileSize);
		platform.context.strokeStyle = palette.brown;
		platform.context.lineWidth = 5;
		platform.context.beginPath();
		platform.context.moveTo(0, 0);
		platform.context.lineTo(tileSize, 0);
		platform.context.stroke();
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
				} else {

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

		Phaser.Sprite.call(me, game, 0, 32, circle);

		me.body.collideWorldBounds = true;
		// me.body.bounce.setTo(0.1, 0.1);
		me.anchor.setTo(0.5, 0.5);
		me.body.setSize(tileSize - 5, tileSize - 5);
		me.body.gravity.y = 20;
	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		var me = this;

		me.body.velocity.x = 0;

		if(me.cursors.up.isDown && me.body.touching.down){
			me.body.velocity.y = - me.speed * 2;
		} else if(me.cursors.down.isDown){

		}
		if(me.cursors.left.isDown){
			me.body.velocity.x = -me.speed;
		} else if(me.cursors.right.isDown){
			me.body.velocity.x = me.speed;
		}
	};

	// Helper/Utils
	Phaser.BitmapData.prototype.circle = function(x, y, radius, fill){
		this.context.arc(x, y, radius, 0, Math.PI*2);
		if(fill){
			this.context.fill();
		}
		//this.context.stroke();
	};

	// Start the game
	startGame();
})();