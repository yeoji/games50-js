import Phaser from 'phaser';

const GROUND = 0;
const SKY = 1;

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    preload() {
    }

    create() {
        const mapWidth = 20;
        const mapHeight = 20;

        for (let row = 0; row < mapHeight; row++) {
            for (let col = 0; col < mapWidth; col++) {
                if(row < 5) {
                    this.add.sprite(col * 16, row * 16, "tiles", SKY);
                } else {
                    this.add.sprite(col * 16, row * 16, "tiles", GROUND);
                }
            }
        }

    }
}

export default PlayScene;