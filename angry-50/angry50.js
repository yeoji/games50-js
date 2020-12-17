import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import StartScene from './scenes/StartScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 640,
    height: 360,
    scale: {
        maxWidth: 1280,
        maxHeight: 720,
        zoom: (1280/640),
        resolution: (1280/640),
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false
        }
    },
    scene: [StartScene, PlayScene]
};

const game = new Phaser.Game(config);