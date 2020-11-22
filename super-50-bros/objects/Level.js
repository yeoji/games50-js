import Phaser from 'phaser';
import GoalPost from './GoalPost';
import Ground, {GROUND_TILE_ID} from './Ground';
import JumpBlock from './JumpBlock';
import Key from './Key';
import LockedBlock from './LockedBlock';
import Snail from './Snail';

const SKY = 4;

const TILE_WIDTH = 16;
const BACKGROUND_WIDTH = 256;

class Level extends Phaser.GameObjects.Container {
    constructor(scene, tiles) {
        super(scene);

        this.tiles = tiles;
        this.keySpawned = false;

        this.createBackground();
        this.createMap();
        this.createBlocks();

        scene.add.existing(this);
    }

    createBackground() {
        const randomBackground = Phaser.Math.Between(0, 2);
        const mapWidth = this.tiles.length * TILE_WIDTH;

        for(let i=0; i < mapWidth/BACKGROUND_WIDTH; i++) {
            const bgOffset = i * BACKGROUND_WIDTH;

            this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2 + bgOffset, this.scene.game.config.height/2 - 10, "backgrounds", randomBackground));
            this.add(new Phaser.GameObjects.Sprite(this.scene, this.scene.game.config.width/2 + bgOffset, this.scene.game.config.height/2 + 118, "backgrounds", randomBackground).setFlipY(true));
        }
    }

    createMap() {
        this.ground = this.scene.physics.add.staticGroup();

        for (let col = 0; col < this.tiles.length; col++) {
            for (let row = 0; row < this.tiles[col].length; row++) {
                const tile = this.tiles[col][row];

                tile.forEach(t => {
                    if(t.texture === 'tileset' && t.id === GROUND_TILE_ID) {
                        const object = new Ground(this.scene, col * 16, row * 16);
                        this.add(object);
                        this.ground.add(object);
                    } else {
                        this.add(new Phaser.GameObjects.Sprite(this.scene, col * 16, row * 16, t.texture, t.id));
                    }
                })
            }
        }
    }

    createBlocks() {
        this.blocks = this.scene.physics.add.staticGroup();

        for (let col = 0; col < this.tiles.length - 2; col++) {
            const groundRow = 0;
            for (let row = 0; row < this.tiles[col].length; row++) {
                if(this.tiles[col][row][0].id === GROUND_TILE_ID) {
                    groundRow = row;
                    break;
                }
            }
            if(groundRow === 0) {
                continue
            }

            // random 10% chance for jump block to spawn
            let block = null;
            const spawnBlock = col > 2 && Phaser.Math.Between(1, 10) === 1;
            const spawnKeyAndLock =  !this.keySpawned && ((col > 2 && Phaser.Math.Between(1, 10) === 1) || (col > this.tiles.length - 10))
            if(spawnBlock) {
                block = new JumpBlock(this.scene, col * 16, (groundRow - 3) * 16);
            } else if(spawnKeyAndLock) {
                block = new LockedBlock(this.scene, col * 16, (groundRow - 3) * 16);

                const key = new Key(this.scene, col * 16, (groundRow  - 1) * 16);
                this.add(key);
                this.key = key;
                this.scene.physics.add.collider(this.key, this.ground);

                this.keySpawned = true;
            }

            if(block) {
                this.add(block);
                this.blocks.add(block);
            }
        }
    }

    spawnEnemies() {
        this.enemies = this.scene.physics.add.group();

        for (let col = 0; col < this.tiles.length; col++) {
            for (let row = 0; row < this.tiles[col].length; row++) {
                const tile = this.tiles[col][row][0];
                const nextTile = this.tiles[col][row + 1];

                const onGround = (tile.id === SKY) && (nextTile && nextTile[0].id === GROUND_TILE_ID);
                
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

    spawnGoalPost() {
        const mapWidth = this.tiles.length;
        let groundRow = 0;
        for (let row = 0; row < this.tiles[mapWidth - 2].length; row++) {
            if(this.tiles[mapWidth - 2][row][0].id === GROUND_TILE_ID) {
                groundRow = row;
                break;
            }
        }

        this.goalPost = new GoalPost(this.scene, (mapWidth - 2) * 16, (groundRow * 16) - 32);
        return this.goalPost;
    }

    update(player) {
        this.enemies.getChildren().forEach(enemy => enemy.goAfterPlayer(player));
    }

    getGround() {
        return this.ground;
    }

    getBlocks() {
        return this.blocks;
    }

    getKey() {
        return this.key;
    }

    getEnemies() {
        return this.enemies;
    }
}

export default Level;