import Phaser from 'phaser';

export const GROUND_TILE_ID = 2;

class Ground extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "tileset", GROUND_TILE_ID);

        scene.add.existing(this);
    }
}

export default Ground;