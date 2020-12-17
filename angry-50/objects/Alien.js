import Phaser from 'phaser';

const SQUARE = 'square';

const CIRCLE_FRAME_IDS = [5, 6, 8, 9, 14];

class Alien extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, type = SQUARE) {
        const frameId = type === SQUARE ? Phaser.Math.Between(0, 4) : Phaser.Math.RND.pick(CIRCLE_FRAME_IDS);
        
        super(scene.matter.world, x, y, 'aliens', frameId);

        scene.add.existing(this);

        this.setBounce(0.4);
    }
}

export default Alien;