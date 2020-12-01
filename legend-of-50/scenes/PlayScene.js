import Phaser from 'phaser';
import Dungeon from '../objects/Dungeon';
import Player from '../objects/Player';
import { LEFT, RIGHT, UP, DOWN, MAP_RENDER_OFFSET_X, MAP_RENDER_OFFSET_Y, GAME_WIDTH, GAME_HEIGHT, TILE_WIDTH, TILE_HEIGHT, FULL_HEART_FRAME_ID, HEART_WIDTH, EMPTY_HEART_FRAME_ID, HALF_HEART_FRAME_ID } from '../constants';

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    create() {
        this.controls = this.input.keyboard.createCursorKeys();

        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2);
        this.dungeon = new Dungeon(this, this.player);

        this.hearts = [];
        const numHearts = 3;
        for (let i = 0; i < numHearts; i++) {
            this.hearts.push(this.add.sprite((i * (HEART_WIDTH + 1)) + 2, 2, "hearts", FULL_HEART_FRAME_ID).setOrigin(0));
        }

        this.physics.world.setBounds(MAP_RENDER_OFFSET_X + TILE_WIDTH, MAP_RENDER_OFFSET_Y, GAME_WIDTH - (MAP_RENDER_OFFSET_X + (TILE_WIDTH * 3)), GAME_HEIGHT - MAP_RENDER_OFFSET_Y - (TILE_HEIGHT * 2));
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

        if(this.player.attributes.health === 0) {
            this.scene.start('GameOverScene');
        }

        this.updateHearts();
        this.dungeon.update();
    }

    updateHearts() {
        const {health} = this.player.attributes;
        this.hearts.forEach((heart, i) => {
            const heartFrame = health <= (i * 2) ? EMPTY_HEART_FRAME_ID : health <= ((i*2) +1) ? HALF_HEART_FRAME_ID : FULL_HEART_FRAME_ID;

            heart.setFrame(heartFrame);
        });
    }
}

export default PlayScene;