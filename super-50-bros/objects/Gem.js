import Phaser from 'phaser';

class Gem extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        const variant = Phaser.Math.Between(0, 3);

        super(scene, x, y, "gems", variant);

        scene.add.existing(this);
    }
}

export default Gem;