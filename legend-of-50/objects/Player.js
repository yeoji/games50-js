import Phaser from 'phaser';
import { LEFT, RIGHT, UP, DOWN, PLAYER_PADDING, SECOND } from '../constants';

const PLAYER_DAMAGE = 1;
const PLAYER_MAX_HEALTH = 6;
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
            health: PLAYER_MAX_HEALTH
        }
        this.holding = null;

        this.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, (anim) => {
            if(anim.key.includes("character-attack")) {
                this.attacking = false;
                this.hitbox = null;
            }
        });

        this.createAnimations();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setBodySize(this.width, this.height - (PLAYER_PADDING * 2));
        this.setSize(this.width, this.height - (PLAYER_PADDING * 2));
        
        this.setCollideWorldBounds();
        this.body.onWorldBounds = true;
    }

    getHurtbox = () => {
        return new Phaser.Geom.Rectangle(this.x - 4, this.y - 4, 8, 12);
    }

    createAnimations = () => {
        const walkIdleLiftAnims = {
            down: 0,
            right: 4,
            up: 8,
            left: 12,
        }
        Object.entries(walkIdleLiftAnims).forEach(([direction, startFrame], index) => {
            this.scene.anims.create({
                key: `character-idle-${direction}`,
                frames: [{ key: 'character', frame: startFrame }],
                frameRate: 20
            });

            this.scene.anims.create({
                key: `character-walk-${direction}`,
                frames: this.scene.anims.generateFrameNumbers('character', { start: startFrame, end: startFrame + 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.scene.anims.create({
                key: `character-lift-${direction}`,
                frames: this.scene.anims.generateFrameNumbers('character-lift', { start: startFrame - index, end: startFrame - index + 2 }),
                frameRate: 20,
            });

            this.scene.anims.create({
                key: `character-lift-idle-${direction}`,
                frames: [{ key: 'character-lift-walk', frame: startFrame }],
                frameRate: 20
            });
            this.scene.anims.create({
                key: `character-lift-walk-${direction}`,
                frames: this.scene.anims.generateFrameNumbers('character-lift-walk', { start: startFrame, end: startFrame + 3 }),
                frameRate: 10,
                repeat: -1
            });
        });

        const attackAnims = {
            left: 12,
            right: 8,
            up: 4,
            down: 0
        }
        Object.entries(attackAnims).forEach(([direction, startFrame]) => {
            this.scene.anims.create({
                key: `character-attack-${direction}`,
                frames: this.scene.anims.generateFrameNumbers('character-attack', { start: startFrame, end: startFrame + 3 }),
                frameRate: 20,
            })
        });
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

        if(this.holding !== null) {
            this.anims.play(`character-lift-walk-${direction}`, true);

            this.holding.disableBody();
            this.holding.setPosition(this.x - this.body.halfWidth, this.y - this.body.halfHeight - this.holding.height + PLAYER_PADDING);
        } else {
            this.anims.play(`character-walk-${direction}`, true);
        }
    }

    stop = () => {
        if(this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            if(this.holding !== null) {
                this.anims.play(`character-lift-idle-${this.direction}`, true);
            } else {
                this.anims.play(`character-idle-${this.direction}`, true);
            }
            this.setVelocity(0);
        }
    }

    attack = () => {
        if(this.holding) {
            return;
        }

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

    heal = (hp) => {
        this.attributes.health = Math.min(this.attributes.health + hp, PLAYER_MAX_HEALTH);
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

    pickUp(object) {
        if(this.holding != null) {
            // already holding an object
            return;
        }

        this.anims.play(`character-lift-${this.direction}`, true);

        object.disableBody();
        object.setPosition(this.x - this.body.halfWidth, this.y - this.body.halfHeight - object.height + PLAYER_PADDING);

        this.holding = object;
    }
}

export default Player;