import Phaser from 'phaser';
import LaunchMarker from './LaunchMarker';

class Level extends Phaser.GameObjects.Container {
    constructor(scene, levelNo) {
        super(scene);

        this.launchMarker = new LaunchMarker(scene);
    }

    update() {
        this.launchMarker.update();
    }
}

export default Level;