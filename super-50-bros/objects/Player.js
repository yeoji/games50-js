import Phaser from 'phaser';

const MOVE_SPEED = 50;
const JUMP_VELOCITY = -160;

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 10, scene.game.config.height/2, "character");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.createAnimations();
        this.setCollideWorldBounds();
    }

    createAnimations() {
        this.scene.anims.create({
            key: "idle",
            frames: [{ key: 'character', frame: 0 }],
            frameRate: 20
        })
        this.scene.anims.create({
            key: "moving",
            frames: this.scene.anims.generateFrameNumbers('character', { start: 9, end: 10 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: "jumping",
            frames: [{ key: 'character', frame: 2 }],
            frameRate: 20
        })
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

    isFalling() {
        return this.body.velocity.y > 0;
    }
}

export default Player;