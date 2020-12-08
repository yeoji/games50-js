import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, MAP_RENDER_OFFSET_X, MAP_RENDER_OFFSET_Y, TILE_WIDTH } from '../constants';

const OPEN_FRAME_ID = 0;
const CLOSED_FRAME_ID = 1;

class Switch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, roomOffset) {
        // generate a random position within the map (excluding the offset and the walls)
        const randomX = Phaser.Math.Between(MAP_RENDER_OFFSET_X + (TILE_WIDTH * 2), GAME_WIDTH - MAP_RENDER_OFFSET_X - (TILE_WIDTH * 2));
        const randomY = Phaser.Math.Between(MAP_RENDER_OFFSET_Y + (TILE_WIDTH * 2), GAME_HEIGHT - MAP_RENDER_OFFSET_Y - (TILE_WIDTH * 2));

        super(scene, randomX + roomOffset.x, randomY + roomOffset.y, 'switches', CLOSED_FRAME_ID);

        this.activated = false;

        this.scene.add.existing(this.setOrigin(0, 0));
        this.scene.physics.add.existing(this);
    }

    activate = () => {
        this.activated = true;

        this.setFrame(OPEN_FRAME_ID);
    }
}

export default Switch;