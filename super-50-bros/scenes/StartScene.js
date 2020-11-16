import Phaser from 'phaser';

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.game.config.backgroundColor.random();

        this.load.spritesheet("tiles", "assets/graphics/tiles.png", {
            frameWidth: 80,
            frameHeight: 64
        })
        this.load.spritesheet("tileTops", "assets/graphics/tile_tops.png", {
            frameWidth: 80,
            frameHeight: 64
        })
        this.load.spritesheet("character", "assets/graphics/character.png", {
            frameWidth: 16,
            frameHeight: 20
        })
    }

    loadRandomTileset() {
        const randomTileset = Phaser.Math.Between(0, 59);
        this.textures.addSpriteSheetFromAtlas("tileset", {
            atlas: "tiles",
            frame: randomTileset,
            frameWidth: 16,
            frameHeight: 16
        })
        
        const randomTileTopSet = Phaser.Math.Between(0, 107);
        this.textures.addSpriteSheetFromAtlas("topperset", {
            atlas: "tileTops",
            frame: randomTileTopSet,
            frameWidth: 16,
            frameHeight: 16
        })
    }

    create() {
        this.loadRandomTileset();

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