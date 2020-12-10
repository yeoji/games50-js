import Phaser from 'phaser';
import { LEFT, RIGHT, UP, DOWN, PLAYER_PADDING, SECOND } from '../constants';

const PLAYER_DAMAGE = 1;
const PLAYER_HEALTH = 6;
const WALK_SPEED = 50;

const SWORD_WIDTH = 8;
const SWORD_HEIGHT = 16;

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "character");

        this.direction = DOWN;
        this.attacking = false;
        this.attributes = {
            damage: PLAYER_DAMAGE,
            health: PLAYER_HEALTH
        }

        this.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, (anim) => {
            if(anim.key.includes("character-attack")) {
                this.attacking = false;
                this.hitbox = null;
            }
        });

        this.createAnimations();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();
        this.body.onWorldBounds = true;
    }

    getHurtbox = () => {
        return new Phaser.Geom.Rectangle(this.x - 4, this.y - 4, 8, 12);
    }

    createAnimations = () => {
        this.scene.anims.create({
            key: "character-idle-left",
            frames: [{ key: 'character', frame: 12 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "character-idle-right",
            frames: [{ key: 'character', frame: 4 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "character-idle-up",
            frames: [{ key: 'character', frame: 8 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "character-idle-down",
            frames: [{ key: 'character', frame: 0 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "character-walk-left",
            frames: this.scene.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: "character-walk-right",
            frames: this.scene.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: "character-walk-up",
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: "character-walk-down",
            frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: "character-attack-left",
            frames: this.scene.anims.generateFrameNumbers('character-attack', { start: 12, end: 15 }),
            frameRate: 20,
        })
        this.scene.anims.create({
            key: "character-attack-right",
            frames: this.scene.anims.generateFrameNumbers('character-attack', { start: 8, end: 11 }),
            frameRate: 20,
        })
        this.scene.anims.create({
            key: "character-attack-up",
            frames: this.scene.anims.generateFrameNumbers('character-attack', { start: 4, end: 7 }),
            frameRate: 20,
        })
        this.scene.anims.create({
            key: "character-attack-down",
            frames: this.scene.anims.generateFrameNumbers('character-attack', { start: 0, end: 3 }),
            frameRate: 20,
        })
    }

    move = (direction) => {
        if(this.attacking) {
            // can't move when attacking
            return
        }

        this.direction = direction;
        this.setVelocity(0);

        switch(direction) {
            case UP:
                this.setVelocityY(-WALK_SPEED);
                break;
            case DOWN:
                this.setVelocityY(WALK_SPEED);
                break;
            case LEFT:
                this.setVelocityX(-WALK_SPEED);
                break;
            case RIGHT:
                this.setVelocityX(WALK_SPEED);
                break;
        }

        this.anims.play(`character-walk-${direction}`, true);
    }

    stop = () => {
        if(this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            this.anims.play(`character-idle-${this.direction}`, true);
            this.setVelocity(0);
        }
    }

    attack = () => {
        this.attacking = true;
        this.createSwordHitbox();

        this.setVelocity(0);
        this.anims.play(`character-attack-${this.direction}`, true);
        this.anims.chain(`character-idle-${this.direction}`);
    }

    damage = (dmg) => {
        if(!this.invulnerable) {
            this.attributes.health -= dmg;
            this.goInvulnerable();
        }
    }

    goInvulnerable = () => {
        this.invulnerable = true;

        const invulnerableFlashing = setInterval(() => {
            if(this.alpha === 1) {
                this.setAlpha(0.3);
            } else {
                this.setAlpha(1);
            }
        }, 60);

        setTimeout(() => {
            clearInterval(invulnerableFlashing);
            this.setAlpha(1);
            this.invulnerable = false;
        }, 1.5 * SECOND);
    }

    createSwordHitbox = () => {
        let x = this.x - this.body.halfWidth;
        let y = this.y - this.body.halfHeight + PLAYER_PADDING;
        let width;
        let height;

        switch(this.direction) {
            case UP:
                // flip directions for up and down
                width = SWORD_HEIGHT;
                height = SWORD_WIDTH;
                break;
            case DOWN:
                y = y + (this.height - (PLAYER_PADDING * 2));
                width = SWORD_HEIGHT;
                height = SWORD_WIDTH;
                break;
            case LEFT:
                x = x - SWORD_WIDTH;
                y = y + PLAYER_PADDING;
                width = SWORD_WIDTH;
                height = SWORD_HEIGHT;
                break;
            case RIGHT:
                x = x + this.width;
                y = y + PLAYER_PADDING;
                width = SWORD_WIDTH;
                height = SWORD_HEIGHT;
                break;
        }
        this.hitbox = new Phaser.Geom.Rectangle(x, y, width, height);
    }
}

export default Player;