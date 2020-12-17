import Phaser from 'phaser';

class Obstacle extends Phaser.Physics.Matter.Sprite {
    constructor(scene, config) {
        super(scene.matter.world, config.x, config.y, config.material, config.type);

        this.scene.add.existing(this);

        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            const randomSound = Phaser.Math.Between(1, 5);
            this.scene.sound.play(`break${randomSound}`);
        })
    }
}

export default Obstacle;