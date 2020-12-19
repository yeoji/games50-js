import Phaser from 'phaser';
import World from '../objects/World';
import Player from '../objects/Player';
import {DOWN, LEFT, RIGHT, UP} from '../constants';
import { sceneStack } from '../50mon';

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.controls = this.input.keyboard.createCursorKeys();

        this.world = new World(this);
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2);
    }

    update() {
        if(this.controls.left.isDown) {
            this.attemptMove(LEFT);
        } else if(this.controls.right.isDown) {
            this.attemptMove(RIGHT);
        } else if(this.controls.up.isDown) {
            this.attemptMove(UP);
        } else if(this.controls.down.isDown) {
            this.attemptMove(DOWN);
        }
    }

    attemptMove(direction) {
        if(this.player.moving) {
            return;
        }
        
        const encounter = this.checkForEncounters();
        if(encounter) {
            sceneStack.push('FadeScene', {
                r: 255,
                g: 255,
                b: 255,
                a: 1,
                duration: 1000,
                onComplete: () => {
                    sceneStack.push('BattleScene', {
                        player: this.player
                    });
                    sceneStack.push('FadeScene', {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 0,
                        duration: 1000
                    });
                }
            });
        } else {
            this.player.move(direction);
        }
        
        this.controls[direction].isDown = false;
    }

    checkForEncounters() {
        for (let i = 0; i < this.world.tallGrass.length; i++) {
            const tallGrass = this.world.tallGrass[i];

            if(Phaser.Geom.Rectangle.Overlaps(this.player.getBounds(), tallGrass.getBounds())) {
                const hasEncounter = Phaser.Math.Between(1, 10) === 1;
                if(hasEncounter) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default PlayScene;