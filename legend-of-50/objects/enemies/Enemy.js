import Phaser from 'phaser';
import { DOWN, LEFT, RIGHT, UP, SECOND } from '../../constants';
import enemies from './enemies.json';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const randomEnemy = enemies[Phaser.Math.Between(0, enemies.length - 1)];

        super(scene, x, y, randomEnemy.texture);

        this.name = randomEnemy.name;
        this.attributes = Object.assign({}, randomEnemy.attributes);

        this.createAnimations(randomEnemy.texture, randomEnemy.animations);
        this.anims.play(`${this.name}-idle-down`, true);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.events.on('shutdown', this.die);
        
        this.setCollideWorldBounds();
        this.body.onWorldBounds = true;

        this.startMovement();
    }

    createAnimations = (texture, animDefs) => {
        animDefs.forEach(def => {
            this.scene.anims.create({
                key: `${this.name}-${def.key}`,
                frames: this.scene.anims.generateFrameNumbers(texture, { start: def.frames.start, end: def.frames.end || def.frames.start }),
                frameRate: def.frameRate || 10,
                repeat: def.repeat || 0
            });
        })
    }

    startMovement = () => {
        // generate random direction and move/idle duration
        const idleDuration = Phaser.Math.Between(1, 5);
        const moveDuration = Phaser.Math.Between(3, 5);
        this.direction = Phaser.Math.RND.pick([LEFT, DOWN, RIGHT, UP]);

        switch(this.direction) {
            case LEFT:
                this.setVelocityX(-this.attributes.speed);
                break;
            case RIGHT:
                this.setVelocityX(this.attributes.speed);
                break;
            case UP:
                this.setVelocityY(-this.attributes.speed);
                break;
            case DOWN:
                this.setVelocityY(-this.attributes.speed);
                break;
        }

        this.anims.play(`${this.name}-walk-${this.direction}`, true);

        this.movingTimeout = setTimeout(() => {
            this.stopMovement();

            this.idleTimeout = setTimeout(() => {
                this.startMovement();
            }, idleDuration * SECOND);
        }, moveDuration * SECOND);
    }

    stopMovement = () => {
        this.setVelocity(0);
        this.anims.play(`${this.name}-idle-${this.direction}`, true);
    }

    reverseDirection = () => {
        switch(this.direction) {
            case LEFT:
                this.direction = RIGHT;
                this.setVelocityX(this.attributes.speed);
                break;
            case RIGHT:
                this.direction = LEFT;
                this.setVelocityX(-this.attributes.speed);
                break;
            case UP:
                this.direction = DOWN;
                this.setVelocityY(this.attributes.speed);
                break;
            case DOWN:
                this.direction = UP;
                this.setVelocityY(-this.attributes.speed);
                break;
        }
        this.anims.play(`${this.name}-walk-${this.direction}`, true);

        this.bumped = false;
    }

    damage = (dmg) => {
        this.attributes.health -= dmg;

        if(this.attributes.health <= 0) {
            this.die();
        }
    }

    die = () => {
        clearTimeout(this.movingTimeout);
        clearTimeout(this.idleTimeout);
        this.destroy();
    }
}

export default Enemy;