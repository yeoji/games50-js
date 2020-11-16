import Phaser from 'phaser';
import Player from '../objects/Player';

const GROUND = 2;
const SKY = 4;

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
                if(row < 7) {
                    this.add.sprite(col * 16, row * 16, "tileset", SKY);
                } else {
                    const tile = this.add.sprite(col * 16, row * 16, "tileset", GROUND);
                    this.ground.add(tile);
                
                    if (row === 7) {
                        this.add.sprite(col * 16, row * 16, "topperset", GROUND);
                    } 
                }
            }
        }

        this.player = new Player(this);
        
        this.physics.add.collider(this.player, this.ground);

        this.cameras.main.startFollow(this.player, true);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.controls.space) && this.player.body.touching.down) {
            this.player.jump();
            return;
        }

        if(this.controls.left.isDown) {
            this.player.moveLeft();
        } else if(this.controls.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.stop();
        }
    }
}

export default PlayScene;