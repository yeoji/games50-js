import Phaser from 'phaser';
import Level from '../objects/Level';
import {loadFont} from '../utils';
import {generateMap} from '../mapMaker';

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.game.config.backgroundColor.random();

        this.load.spritesheet("backgrounds", "assets/graphics/backgrounds.png", {
            frameWidth: 256,
            frameHeight: 128
        })
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
        this.load.spritesheet("creatures", "assets/graphics/creatures.png", {
            frameWidth: 16,
            frameHeight: 16,
        })
        this.load.spritesheet("bushes", "assets/graphics/bushes_and_cacti.png", {
            frameWidth: 16,
            frameHeight: 16,
        })
        this.load.spritesheet("jumpBlocks", "assets/graphics/jump_blocks.png", {
            frameWidth: 16,
            frameHeight: 16,
        })

        loadFont("title", "assets/fonts/arcade_alternate/ArcadeAlternate.ttf");
        loadFont("text", "assets/fonts/font.ttf");
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

        this.drawBackground();
        this.drawTitle();
        this.drawStartGameText();

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start("PlayScene");
        })
    }

    drawTitle() {
        this.add.text(16, 36, "Super 50 Bros.", {
            fontFamily: 'title',
            fill: '#000',
            fontSize: 32,
            resolution: 10
        })
        this.add.text(15, 35, "Super 50 Bros.", {
            fontFamily: 'title',
            fill: '#fff',
            fontSize: 32,
            resolution: 10
        })
    }

    drawStartGameText() {
        this.add.text(76, 86, "Press Enter", {
            fontFamily: 'text',
            fill: '#000',
            fontSize: 16,
            resolution: 10
        })
        this.add.text(75, 85, "Press Enter", {
            fontFamily: 'text',
            fill: '#fff',
            fontSize: 16,
            resolution: 10
        })
    }

    drawBackground() {
        new Level(this, generateMap(20, 20));
    }
}

export default StartScene;