import Phaser from 'phaser';
import Level from '../objects/Level';
import Player from '../objects/Player';
import {generateLevel} from '../levelMaker';

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    preload() {
        this.controls = this.input.keyboard.createCursorKeys();
    }

    create() {
        const mapWidth = 20;
        const mapHeight = 20;
        this.cameras.main.setBounds(0, 0, mapWidth * 15, 144);
        this.physics.world.setBounds(0, 0, mapWidth * 15, 144);

        this.level = new Level(this, generateLevel(mapWidth, mapHeight));
        this.level.spawnEnemies();

        this.player = new Player(this);
        this.physics.add.collider(this.player, this.level.getGround());
        this.physics.add.collider(this.player, this.level.getEnemies(), this.endGame, null, this);
        this.cameras.main.startFollow(this.player, true);
    }

    update() {
        this.level.update(this.player);

        if(Phaser.Input.Keyboard.JustDown(this.controls.space) && this.player.body.touching.down) {
            this.player.jump();
            return;
        }

        if(this.controls.left.isDown) {
            this.player.moveLeft();
        } else if(this.controls.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.stop();
        }
    }

    endGame() {
        this.scene.start("StartScene");
    }
}

export default PlayScene;