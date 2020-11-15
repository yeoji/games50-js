import Phaser from 'phaser';

const MOVE_SPEED = 50;
const JUMP_VELOCITY = -150;

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, scene.game.config.width/2, 0, "character");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    moveLeft() {
        this.setFlipX(true);
        this.setVelocityX(-MOVE_SPEED);

        if(this.body.touching.down) {
            this.anims.play("moving", true);
        }
    }

    moveRight() {
        this.setFlipX(false);
        this.setVelocityX(MOVE_SPEED);

        if(this.body.touching.down) {
            this.anims.play("moving", true);
        }
    }

    jump() {
        this.setVelocityY(JUMP_VELOCITY);
        this.anims.play("jumping", true);
    }

    stop() {
        this.setVelocityX(0);

        if(this.body.touching.down) {
            this.anims.play("idle")
        }
    }
}

export default Player;