import Phaser from 'phaser';
import {TILE_SIZE} from '../constants';

const GRASS_TILE_IDS = [45, 46];
const TALL_GRASS_TILE_ID = 41;

class World extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);

        this.createBaseGrassLayer();
        this.createTallGrassLayer();
    }

    createBaseGrassLayer() {
        this.baseGrass = [];

        for (let x = 0; x < this.scene.game.config.width; x += TILE_SIZE) {
            for (let y = 0; y < this.scene.game.config.height; y += TILE_SIZE) {
                this.baseGrass.push(this.scene.add.sprite(x, y, 'tiles', Phaser.Math.RND.pick(GRASS_TILE_IDS)).setOrigin(0, 0));
            }
        }
    }

    createTallGrassLayer() {
        const tallGrassRows = 4;

        this.tallGrass = [];

        for (let x = 0; x < this.scene.game.config.width; x += TILE_SIZE) {
            for (let y = this.scene.game.config.height - (TILE_SIZE * tallGrassRows); y < this.scene.game.config.height; y += TILE_SIZE) {
                this.tallGrass.push(this.scene.add.sprite(x, y, 'tiles', TALL_GRASS_TILE_ID).setOrigin(0, 0));
            }
        }
    }
}

export default World;