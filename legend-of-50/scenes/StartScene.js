import Phaser from 'phaser';
import {loadFont} from '../../common/utils';
import { TILE_HEIGHT, TILE_WIDTH } from '../constants';

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.load.image("background", "assets/graphics/background.png");
        this.load.spritesheet("tiles", "assets/graphics/tilesheet.png", {
            frameWidth: TILE_WIDTH,
            frameHeight: TILE_HEIGHT
        });
        this.load.spritesheet("character", "assets/graphics/character_walk.png", {
            frameWidth: 16,
            frameHeight: 32,
        });
        this.load.spritesheet("character-attack", "assets/graphics/character_swing_sword.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("character-lift", "assets/graphics/character_pot_lift.png", {
            frameWidth: 16,
            frameHeight: 32,
        });
        this.load.spritesheet("character-lift-walk", "assets/graphics/character_pot_walk.png", {
            frameWidth: 16,
            frameHeight: 32,
        });
        this.load.spritesheet("switches", "assets/graphics/switches.png", {
            frameWidth: 16,
            frameHeight: 18
        });
        this.load.spritesheet("entities", "assets/graphics/entities.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("hearts", "assets/graphics/hearts.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        loadFont("zelda", "assets/fonts/zelda.otf");
        this.loadSounds();
    }

    loadSounds() {
        this.load.audio("music", "assets/sounds/music.mp3")
        this.load.audio("door", "assets/sounds/door.wav")
        this.load.audio("hit-enemy", "assets/sounds/hit_enemy.wav")
        this.load.audio("hit-player", "assets/sounds/hit_player.wav")
        this.load.audio("sword", "assets/sounds/sword.wav")
        this.load.audio("pickup", "assets/sounds/pickup.wav")
        this.load.audio("pot-break", "assets/sounds/pot_break.mp3")
        this.load.audio("heart", "assets/sounds/heart.wav")
    }

    create() {
        this.add.image(0,0,'background').setScale(0.3).setOrigin(0,0);

        this.add.text(this.game.config.width/2 + 2, this.game.config.height/2 - 30, "Legend of 50", {
            fontFamily: 'zelda',
            fill: 'rgba(34, 34, 34, 255)',
            fontSize: 64
        }).setOrigin(0.5, 0.5);
        this.add.text(this.game.config.width/2, this.game.config.height/2 - 32, "Legend of 50", {
            fontFamily: 'zelda',
            fill: 'rgba(175, 53, 42, 255)',
            fontSize: 64
        }).setOrigin(0.5, 0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2 + 64, "Press Enter", {
            fontFamily: 'zelda',
            fill: 'rgba(255, 255, 255, 255)',
            fontSize: 32
        }).setOrigin(0.5, 0.5);

        if(!this.sound.get("music") || !this.sound.get("music").isPlaying) {
            this.sound.play("music", {
                sound: 0.5,
                loop: true
            });
        }

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('PlayScene');
        });
    }
}

export default StartScene;