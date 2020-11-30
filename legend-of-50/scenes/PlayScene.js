import Phaser from 'phaser';
import Dungeon from '../objects/Dungeon';
import Player from '../objects/Player';
import { LEFT, RIGHT, UP, DOWN } from '../constants';

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    create() {
        this.controls = this.input.keyboard.createCursorKeys();

        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2);
        this.dungeon = new Dungeon(this, this.player);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.controls.space)) {
            this.player.attack();
        } else {
            if(this.controls.left.isDown) {
                this.player.move(LEFT);
            } else if(this.controls.right.isDown) {
                this.player.move(RIGHT);
            } else if(this.controls.up.isDown) {
                this.player.move(UP);
            } else if(this.controls.down.isDown) {
                this.player.move(DOWN);
            } else {
                this.player.stop();
            }
        }
    }
}

export default PlayScene;