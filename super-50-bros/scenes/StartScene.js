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
    }

    create() {
        this.scene.start("PlayScene");
    }
}

export default StartScene;