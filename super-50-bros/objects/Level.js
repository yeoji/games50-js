import Phaser from 'phaser';
import Ground, {GROUND_TILE_ID} from './Ground';
import Snail from './Snail';

const SKY = 4;

class Level extends Phaser.GameObjects.Container {
    constructor(scene, tiles) {
        super(scene);

        this.tiles = tiles;
        this.createBackground();
        this.createMap();

        scene.add.existing(this);
    }

    createBackground() {
        const randomBackground = Phaser.Math.Between(0, 2);
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2, this.scene.game.config.height/2 - 10, "backgrounds", randomBackground));
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2, this.scene.game.config.height/2 + 118, "backgrounds", randomBackground).setFlipY(true));
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2 + 256, this.scene.game.config.height/2 - 10, "backgrounds", randomBackground));
        this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2 + 256, this.scene.game.config.height/2 + 118, "backgrounds", randomBackground).setFlipY(true));
    }

    createMap() {
        this.ground = this.scene.physics.add.staticGroup();

        for (let col = 0; col < this.tiles.length; col++) {
            for (let row = 0; row < this.tiles[col].length; row++) {
                const tile = this.tiles[col][row];
                
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

    spawnEnemies() {
        this.enemies = this.scene.physics.add.group();

        for (let col = 0; col < this.tiles.length; col++) {
            for (let row = 0; row < this.tiles[col].length; row++) {
                const tile = this.tiles[col][row];
                const nextTile = this.tiles[col][row + 1];

                const onGround = (tile.id === SKY) && (nextTile && nextTile.id === GROUND_TILE_ID);
                
                // random 5% chance for enemy to spawn
                const spawnEnemy = Phaser.Math.Between(1, 20) === 1;

                if(onGround && spawnEnemy) {
                    const enemy = new Snail(this.scene, col * 16, row * 16);
                    this.add(enemy);
                    this.enemies.add(enemy);
                }
            }
        }

        this.scene.physics.add.collider(this.enemies, this.ground);
    }

    update(player) {
        this.enemies.getChildren().forEach(enemy => enemy.goAfterPlayer(player));
    }

    getGround() {
        return this.ground;
    }

    getEnemies() {
        return this.enemies;
    }
}

export default Level;