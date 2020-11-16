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
        this.cameras.main.setBounds(0, 0, mapWidth * 15, mapHeight * 15);
        this.physics.world.setBounds(0, 0, mapWidth * 15, mapHeight * 15);

        this.level = new Level(this, generateLevel(mapWidth, mapHeight));

        this.player = new Player(this);
        this.physics.add.collider(this.player, this.level.getGround());
        this.cameras.main.startFollow(this.player, true);
    }

    update() {
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
}

export default PlayScene;