import Phaser from 'phaser';
import { TILE_SIZE, DOWN, UP, RIGHT, LEFT } from '../constants';

const PLAYER_INITIAL_IDLE_FRAME = 7;

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'entities', PLAYER_INITIAL_IDLE_FRAME);

        this.setOrigin(0, 0.5);
        this.createAnimations();

        this.moving = false;

        this.scene.add.existing(this);
    }

    createAnimations = () => {
        const walkAnims = {
            down: 6,
            left: 18,
            right: 30,
            up: 42,
        }
        Object.entries(walkAnims).forEach(([direction, startFrame]) => {
            this.scene.anims.create({
                key: `player-idle-${direction}`,
                frames: [{ key: 'entities', frame: startFrame + 1 }],
                frameRate: 20
            });

            this.scene.anims.create({
                key: `player-walk-${direction}`,
                frames: this.scene.anims.generateFrameNumbers('entities', { start: startFrame, end: startFrame + 2 }),
                frameRate: 10,
                repeat: -1
            });
        });
    }

    move(direction) {
        let newPosition = {
            x: this.x,
            y: this.y
        };

        switch(direction) {
            case DOWN:
                newPosition.y += TILE_SIZE;
                break;
            case UP:
                newPosition.y -= TILE_SIZE;
                break;
            case RIGHT:
                newPosition.x += TILE_SIZE;
                break;
            case LEFT:
                newPosition.x -= TILE_SIZE;
                break;
        }

        const outOfBoundsX = newPosition.x >= this.scene.game.config.width || newPosition.x < 0;
        const outOfBoundsY = newPosition.y > this.scene.game.config.height || newPosition.y < 0;
        if(this.moving || outOfBoundsX || outOfBoundsY) {
            return;
        }

        this.moving = true;
        this.anims.play(`player-walk-${direction}`, true);

        this.scene.tweens.add({
            targets: this,
            duration: 500,
            x: newPosition.x,
            y: newPosition.y,
            onComplete: () => {
                this.moving = false;
                this.anims.play(`player-idle-${direction}`, true);
            }
        });
    }
}

export default Player;