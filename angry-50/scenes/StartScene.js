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

        loadFont("font", "assets/fonts/font.ttf");
    }

    create() {
        this.matter.world.setBounds(-17.5, -17.5, this.game.config.width, this.game.config.height);

        renderBackground(this);

        this.drawAliens();
        this.drawTitle();

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('PlayScene');
        });
    }

    drawAliens() {
        this.aliens = [];
        for (let i = 0; i < 100; i++) {
            this.aliens.push(new Alien(this, Phaser.Math.Between(0, this.game.config.width), Phaser.Math.Between(0, this.game.config.height - 35)).setOrigin(0,0));
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