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

        this.loadGraphics();
        this.loadSounds();

        loadFont("title", "assets/fonts/arcade_alternate/ArcadeAlternate.ttf");
        loadFont("text", "assets/fonts/font.ttf");
    }

    loadGraphics() {
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
        this.load.spritesheet("gems", "assets/graphics/gems.png", {
            frameWidth: 16,
            frameHeight: 16,
        })
        this.load.spritesheet("keysAndLocks", "assets/graphics/keys_and_locks.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("flagPoles", "assets/graphics/flags.png", {
            frameWidth: 16,
            frameHeight: 48
        })
        this.load.spritesheet("flags", "assets/graphics/flags.png", {
            frameWidth: 16,
            frameHeight: 16
        })
    }

    loadSounds() {
        this.load.audio("music", "assets/sounds/music.wav")
        this.load.audio("pickup", "assets/sounds/pickup.wav")
        this.load.audio("jump", "assets/sounds/jump.wav")
        this.load.audio("kill", "assets/sounds/kill.wav")
        this.load.audio("kill2", "assets/sounds/kill2.wav")
        this.load.audio("death", "assets/sounds/death.wav")
        this.load.audio("powerupReveal", "assets/sounds/powerup-reveal.wav")
        this.load.audio("emptyBlock", "assets/sounds/empty-block.wav")
    }

    loadRandomTileset() {
        const randomTileset = Phaser.Math.Between(0, 59);
        if(this.textures.get("tileset")) {
            this.textures.remove("tileset");
        }
        console.log('random tileset: ' + randomTileset)
        this.textures.addSpriteSheetFromAtlas("tileset", {
            atlas: "tiles",
            frame: randomTileset,
            frameWidth: 16,
            frameHeight: 16
        })
        
        const randomTileTopSet = Phaser.Math.Between(0, 107);
        console.log('random tiletopset: ' + randomTileTopSet)
        if(this.textures.get("topperset")) {
            this.textures.remove("topperset");
        }
        this.textures.addSpriteSheetFromAtlas("topperset", {
            atlas: "tileTops",
            frame: randomTileTopSet,
            frameWidth: 16,
            frameHeight: 16
        })
    }

    create() {
        if(!this.sound.get("music") || !this.sound.get("music").isPlaying) {
            this.sound.play("music", {
                sound: 0.5,
                loop: true
            });
        }

        this.loadRandomTileset();

        this.drawBackground();
        this.drawTitle();
        this.drawStartGameText();

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start("PlayScene", {
                level: 1
            });
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