import Phaser from 'phaser';
import {loadFont} from '../../common/utils';

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.load.image("background", "assets/graphics/background.png");

        loadFont("zelda", "assets/fonts/zelda.otf");
    }

    create() {
        this.add.image(0,0,'background').setOrigin(0,0);

        this.add.text(this.game.config.width/2 + 2, this.game.config.height/2 - 90, "Legend of 50", {
            fontFamily: 'zelda',
            fill: 'rgba(34, 34, 34, 255)',
            fontSize: 192
        }).setOrigin(0.5, 0.5);
        this.add.text(this.game.config.width/2, this.game.config.height/2 - 92, "Legend of 50", {
            fontFamily: 'zelda',
            fill: 'rgba(175, 53, 42, 255)',
            fontSize: 192
        }).setOrigin(0.5, 0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2 + 192, "Press Enter", {
            fontFamily: 'zelda',
            fill: 'rgba(255, 255, 255, 255)',
            fontSize: 96
        }).setOrigin(0.5, 0.5);
    }

    update() {
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('PlayScene');
        });
    }
}

export default StartScene;