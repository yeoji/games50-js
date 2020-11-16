import Phaser from 'phaser';

const PINK_SNAIL_START_FRAME = 48;
const PINK_SNAIL_IDLE_FRAME = 50;

const SNAIL_TRIGGER_DISTANCE = 100;
const SNAIL_SPEED = 15;

class Snail extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "creatures");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.createAnimations();
        this.setCollideWorldBounds();

        this.anims.play("snailSleeping", true);
    }

    createAnimations() {
        this.scene.anims.create({
            key: "snailSleeping",
            frames: [{ key: 'creatures', frame: PINK_SNAIL_IDLE_FRAME}],
            frameRate: 20
        })
        this.scene.anims.create({
            key: "snailMoving",
            frames: this.scene.anims.generateFrameNumbers('creatures', { start: PINK_SNAIL_START_FRAME, end: PINK_SNAIL_START_FRAME + 1 }),
            frameRate: 10,
            repeat: -1
        })
    }

    goAfterPlayer(player) {
        // only change the snail direction when the player is on the ground
        if(!player.body.touching.down) {
            return
        }
        if(Math.abs(this.x - player.x) >= SNAIL_TRIGGER_DISTANCE) {
            return
        }

        if(this.x < player.x) {
            this.setFlipX(true);
            this.setVelocityX(SNAIL_SPEED);
            this.anims.play("snailMoving", true);
        } else if(this.x > player.x) {
            this.setFlipX(false);
            this.setVelocityX(-SNAIL_SPEED);
            this.anims.play("snailMoving", true);
        }
    }
}

export default Snail;