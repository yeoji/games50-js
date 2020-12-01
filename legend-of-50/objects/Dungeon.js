import Phaser from 'phaser';
import Room from './Room';

class Dungeon extends Phaser.GameObjects.Container {
    constructor(scene, player) {
        super(scene);

        this.currentRoom = new Room(scene, player);
    }

    update = () => {
        this.currentRoom.update();
    }
}

export default Dungeon;