import Phaser from 'phaser';

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.game.config.backgroundColor.random();

        this.load.spritesheet("tiles", "assets/graphics/tiles.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("character", "assets/graphics/character.png", {
            frameWidth: 16,
            frameHeight: 20
        })
    }

    create() {
        this.anims.create({
            key: "idle",
            frames: [{ key: 'character', frame: 0 }],
            frameRate: 20
        })
        this.anims.create({
            key: "moving",
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 10 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: "jumping",
            frames: [{ key: 'character', frame: 2 }],
            frameRate: 20
        })

        this.scene.start("PlayScene");
    }
}

export default StartScene;