import Phaser from 'phaser';

class LockedBlock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        const variant = Phaser.Math.Between(4, 7);

        super(scene, x, y, "keysAndLocks", variant);

        scene.add.existing(this);
    }
}

export default LockedBlock;