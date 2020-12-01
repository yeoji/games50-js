import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import StartScene from './scenes/StartScene';
import GameOverScene from './scenes/GameOverScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 384,
    height: 216,
    scale: {
        maxWidth: 1280,
        maxHeight: 720,
        zoom: (1280/384),
        resolution: (1280/384),
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [StartScene, PlayScene, GameOverScene]
};

const game = new Phaser.Game(config);