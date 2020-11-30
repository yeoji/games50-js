import Phaser from 'phaser';
import Dungeon from '../objects/Dungeon';

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    init() {
        this.dungeon = new Dungeon(this);
    }

    preload() {
    }

    create() {
    }
}

export default PlayScene;