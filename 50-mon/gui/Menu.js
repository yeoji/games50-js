import Phaser from 'phaser';
import Panel from './Panel';
import Selection from './Selection';

class Menu extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, items = []) {
        super(scene);

        this.panel = new Panel(scene, x, y, width, height);
        this.selection = new Selection(scene, x + 4, y + 4, width, height, items);
    }

    update() {
        this.selection.update();
    }
}

export default Menu;