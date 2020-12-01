import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(this.game.config.width/2 + 2, this.game.config.height/2 - 30, "GAME OVER", {
            fontFamily: 'zelda',
            fill: 'rgba(175, 53, 42, 255)',
            fontSize: 64
        }).setOrigin(0.5, 0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2 + 64, "Press Enter", {
            fontFamily: 'zelda',
            fill: 'rgba(255, 255, 255, 255)',
            fontSize: 32
        }).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('StartScene');
        });
    }
}

export default GameOverScene;