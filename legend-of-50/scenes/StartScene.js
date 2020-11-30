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

        loadFont("zelda", "assets/fonts/zelda.otf");
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
    }

    update() {
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('PlayScene');
        });
    }
}

export default StartScene;