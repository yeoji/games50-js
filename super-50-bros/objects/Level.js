import Phaser from 'phaser';
import Ground, {GROUND_TILE_ID} from './Ground';

class Level extends Phaser.GameObjects.Container {
    constructor(scene, tiles) {
        super(scene);

        this.createBackground();
        this.createMap(tiles);

        scene.add.existing(this);
    }

    createBackground() {
        const randomBackground = Phaser.Math.Between(0, 2);
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2, this.scene.game.config.height/2 - 10, "backgrounds", randomBackground));
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2, this.scene.game.config.height/2 + 118, "backgrounds", randomBackground).setFlipY(true));
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2 + 256, this.scene.game.config.height/2 - 10, "backgrounds", randomBackground));
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2 + 256, this.scene.game.config.height/2 + 118, "backgrounds", randomBackground).setFlipY(true));
    }

    createMap(tiles) {
        this.ground = this.scene.physics.add.staticGroup();

        for (let col = 0; col < tiles.length; col++) {
            for (let row = 0; row < tiles[col].length; row++) {
                const tile = tiles[col][row];
                
                if(tile.id === GROUND_TILE_ID) {
                    const object = new Ground(this.scene, col * 16, row * 16);
                    this.add(object);
                    this.ground.add(object);
                } else {
                    this.add(new Phaser.GameObjects.Sprite(this.scene, col * 16, row * 16, "tileset", tile.id));
                }

                if(tile.hasTopper) {
                    this.add(new Phaser.GameObjects.Sprite(this.scene, col * 16, row * 16, "topperset", tile.id));
                }
            }
        }
    }

    getGround() {
        return this.ground;
    }
}

export default Level;