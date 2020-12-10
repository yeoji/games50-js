import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, MAP_RENDER_OFFSET_X, MAP_RENDER_OFFSET_Y, TILE_WIDTH } from '../constants';

const POT_1_FRAME_ID = 13;
const POT_2_FRAME_ID = 14;
const POT_3_FRAME_ID = 15;

class Pot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, roomOffset) {
        // generate a random position within the map (excluding the offset and the walls)
        const randomX = Phaser.Math.Between(MAP_RENDER_OFFSET_X + (TILE_WIDTH * 2), GAME_WIDTH - MAP_RENDER_OFFSET_X - (TILE_WIDTH * 2));
        const randomY = Phaser.Math.Between(MAP_RENDER_OFFSET_Y + (TILE_WIDTH * 2), GAME_HEIGHT - MAP_RENDER_OFFSET_Y - (TILE_WIDTH * 2));

        const randomPot = Phaser.Math.RND.pick([POT_1_FRAME_ID, POT_2_FRAME_ID, POT_3_FRAME_ID]);

        super(scene, randomX + roomOffset.x, randomY + roomOffset.y, 'tiles', randomPot);

        this.scene.add.existing(this.setOrigin(0, 0));
        this.scene.physics.add.existing(this, true);

        this.setBodySize(this.width - 2, this.height);
        this.setSize(this.width - 2, this.height);
    }
}

export default Pot;