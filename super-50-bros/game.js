import Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import PlayScene from './scenes/PlayScene';

const config = {
    type: Phaser.AUTO,
    scale: {
        width: 256,
        height: 144,
        zoom: 1.2, // no idea why this makes the sprites not blurry
        max: {
            width: 1280,
            height: 720
        },
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [StartScene, PlayScene]
};

const game = new Phaser.Game(config);