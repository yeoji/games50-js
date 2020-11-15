import Phaser from 'phaser';

const GROUND = 0;
const SKY = 1;

const PLAYER_MOVE_SPEED = 50;

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    preload() {
        this.controls = this.input.keyboard.createCursorKeys();
    }

    create() {
        const mapWidth = 20;
        const mapHeight = 20;

        this.ground = this.physics.add.staticGroup();
        for (let row = 0; row < mapHeight; row++) {
            for (let col = 0; col < mapWidth; col++) {
                if(row < 6) {
                    this.add.sprite(col * 16, row * 16, "tiles", SKY);
                } else {
                    const tile = this.add.sprite(col * 16, row * 16, "tiles", GROUND);
                    this.ground.add(tile);
                }
            }
        }

        this.player = this.physics.add.sprite(this.game.config.width/2, 0, "character", 0);
        this.physics.add.collider(this.player, this.ground);

        this.cameras.main.startFollow(this.player, true);
    }

    update() {
        if(this.controls.left.isDown) {
            this.player.setVelocityX(-PLAYER_MOVE_SPEED);
        } else if(this.controls.right.isDown) {
            this.player.setVelocityX(PLAYER_MOVE_SPEED);
        } else {
            this.player.setVelocityX(0);
        }
    }
}

export default PlayScene;