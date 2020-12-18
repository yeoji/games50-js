import Phaser from 'phaser';
import World from '../objects/World';
import Player from '../objects/Player';
import {DOWN, LEFT, RIGHT, UP} from '../constants';

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.controls = this.input.keyboard.createCursorKeys();

        this.world = new World(this);
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2);
    }

    update() {
        if(this.controls.left.isDown) {
            this.player.move(LEFT);
        } else if(this.controls.right.isDown) {
            this.player.move(RIGHT);
        } else if(this.controls.up.isDown) {
            this.player.move(UP);
        } else if(this.controls.down.isDown) {
            this.player.move(DOWN);
        }
    }
}

export default PlayScene;