import Phaser from 'phaser';
import {loadFont} from '../../common/utils';
import {loadBackgrounds, renderBackground} from '../background';
import Alien from '../objects/Alien';

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        loadBackgrounds(this);

        this.load.spritesheet("aliens", "assets/graphics/aliens.png", {
            frameWidth: 35,
            frameHeight: 35
        });
        this.load.spritesheet("tiles", "assets/graphics/tiles.png", {
            frameWidth: 35,
            frameHeight: 35
        });
        
        this.load.atlas('wood', 'assets/graphics/obstacles/wood.png', 'assets/graphics/obstacles/wood.json');

        loadFont("font", "assets/fonts/font.ttf");

        this.loadSounds();
    }

    loadSounds() {
        this.load.audio("music", "assets/sounds/music.wav")
        this.load.audio("bounce", "assets/sounds/bounce.wav")
        this.load.audio("kill", "assets/sounds/kill.wav")
        this.load.audio("break1", "assets/sounds/break1.wav")
        this.load.audio("break2", "assets/sounds/break2.wav")
        this.load.audio("break3", "assets/sounds/break3.mp3")
        this.load.audio("break4", "assets/sounds/break4.wav")
        this.load.audio("break5", "assets/sounds/break5.wav")
    }

    create() {
        this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

        renderBackground(this);

        this.drawAliens();
        this.drawTitle();

        if(!this.sound.get("music") || !this.sound.get("music").isPlaying) {
            this.sound.play("music", {
                sound: 0.5,
                loop: true
            });
        }

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('PlayScene');
        })
    }

    drawAliens() {
        this.aliens = [];
        for (let i = 0; i < 100; i++) {
            this.aliens.push(new Alien(this, Phaser.Math.Between(0, this.game.config.width), Phaser.Math.Between(0, this.game.config.height - 35)));
        }
    }

    drawTitle() {
        this.add.graphics().fillRoundedRect(this.game.config.width/2 - 168, this.game.config.height/2 - 55, 328, 108, 3).fillStyle(0x404040, 0.78);

        this.add.text(this.game.config.width/2, this.game.config.height/2 - 20, "Angry 50", {
            fontFamily: 'font',
            fill: 'rgba(200, 200, 200, 1)',
            fontSize: 64
        }).setOrigin(0.5, 0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2 + 35, "Click to start!", {
            fontFamily: 'font',
            fill: 'rgba(200, 200, 200, 1)',
            fontSize: 16
        }).setOrigin(0.5, 0.5);
    }
}

export default StartScene;