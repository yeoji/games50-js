import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import StartScene from './scenes/StartScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    scale: {
        width: 1280,
        height: 720
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