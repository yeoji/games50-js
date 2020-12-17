import Phaser from 'phaser';

const SQUARE_ALIEN = 'square';
export const CIRCLE_ALIEN = 'alien';

const CIRCLE_FRAME_IDS = [5, 6, 8, 9, 14];

class Alien extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, type = SQUARE_ALIEN) {
        const frameId = type === SQUARE_ALIEN ? Phaser.Math.Between(0, 4) : Phaser.Math.RND.pick(CIRCLE_FRAME_IDS);
        
        super(scene.matter.world, x, y, 'aliens', frameId);
        scene.add.existing(this);

        if(type === CIRCLE_ALIEN) {
            this.setCircle(17.5);
        }

        this.setBounce(0.4);
    }
}

export default Alien;