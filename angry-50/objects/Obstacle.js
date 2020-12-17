import Phaser from 'phaser';

class Obstacle extends Phaser.Physics.Matter.Sprite {
    constructor(scene, config) {
        super(scene.matter.world, config.x, config.y, config.material, config.type);

        this.scene.add.existing(this);
    }
}

export default Obstacle;