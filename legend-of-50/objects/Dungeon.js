import Phaser from 'phaser';
import Room from './Room';

class Dungeon extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);

        this.currentRoom = new Room(scene);
    }
}

export default Dungeon;