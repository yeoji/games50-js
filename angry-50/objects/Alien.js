import Phaser from 'phaser';
import Obstacle from './Obstacle';

const SQUARE_ALIEN = 'square';
export const CIRCLE_ALIEN = 'alien';

const CIRCLE_FRAME_IDS = [5, 6, 8, 9, 14];

class Alien extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, type = SQUARE_ALIEN) {
        const frameId = type === SQUARE_ALIEN ? Phaser.Math.Between(0, 4) : Phaser.Math.RND.pick(CIRCLE_FRAME_IDS);
        
        super(scene.matter.world, x, y, 'aliens', frameId);
        this.scene = scene;

        scene.add.existing(this);

        this.type = type;

        if(type === CIRCLE_ALIEN) {
            this.setCircle(17.5);
        }

        this.setBounce(0.4);
        this.setOnCollide(this.handleCollision);
    }

    handleCollision = ({bodyA, bodyB}) => {
        if(!this.scene || this.scene.scene.key === 'StartScene') {
            return;
        }

        const scene = this.scene;

        if(bodyA.gameObject instanceof Alien && bodyB.gameObject instanceof Alien) {
            if(bodyA.gameObject.type === CIRCLE_ALIEN && bodyB.gameObject.type === CIRCLE_ALIEN) {
                return;
            }
            
            const player = bodyA.gameObject.type === CIRCLE_ALIEN ? bodyA : bodyB;
            const enemy = bodyA.gameObject.type === CIRCLE_ALIEN ? bodyB : bodyA;

            const destroyed = this.checkCollisionDestroy(player, enemy);
            if(destroyed) {
                scene.sound.play('kill');
            }
        } else {
            const alien = bodyA.gameObject instanceof Alien ? bodyA : bodyB;
            const other = bodyA.gameObject instanceof Alien ? bodyB : bodyA;
    
            const isPlayer = (alien.gameObject && alien.gameObject.type === CIRCLE_ALIEN);
    
            if(other.gameObject instanceof Obstacle) {
                if(isPlayer) {
                    this.checkCollisionDestroy(alien, other);
                } else {
                    const destroyed = this.checkCollisionDestroy(other, alien);
                    if(destroyed) {
                        scene.sound.play('kill');
                    }
                }
            } else if(isPlayer) {
                scene.sound.play('bounce');
            }
        }
    }

    checkCollisionDestroy(destroyer, other) {
        const velocity = destroyer.gameObject.body.velocity;
        const sumVel = Math.abs(velocity.x) + Math.abs(velocity.y);

        if(sumVel > 5) {
            other.gameObject.destroy();
            return true;
        }
        return false;
    }
}

export default Alien;