import Phaser from 'phaser';

class Key extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const variant = Phaser.Math.Between(0, 3);

        super(scene, x, y, "keysAndLocks", variant);

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}

export default Key;