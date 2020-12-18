import Phaser from 'phaser';

class Pokemon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y, 'pokemon', `${name}-front`.toLowerCase());

        this.scene.add.existing(this);
    }
}

export default Pokemon;