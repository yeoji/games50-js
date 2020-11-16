import Phaser from 'phaser';

class JumpBlock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        const variant = Phaser.Math.Between(0, 29);
        
        super(scene, x, y, "jumpBlocks", variant);

        scene.add.existing(this);
    }
}

export default JumpBlock;