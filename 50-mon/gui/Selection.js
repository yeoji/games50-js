import Phaser from 'phaser';
import { MEDIUM_FONT } from '../constants';

const CURSOR_WIDTH = 14;

class Selection extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, items = []) {
        super(scene);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.items = items;

        this.gapHeight = this.height / this.items.length;

        this.create();

        this.selectedItem = 0;
        this.selectionKeys = this.scene.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'select': Phaser.Input.Keyboard.KeyCodes.ENTER
        });
    }

    create() {
        this.cursor = this.scene.add.sprite(this.x - CURSOR_WIDTH - 2, this.y, 'cursor').setOrigin(0, 0);

        let paddedY = this.y;
        this.selections = this.items.map((item, i) => {
            paddedY = paddedY + (this.gapHeight * i);
            
            return this.scene.add.text(this.x, paddedY, item.text, MEDIUM_FONT).setFill('rgba(255, 255, 255, 1)').setOrigin(0, 0);
        });
    }

    update() {
        this.updateSelectionCursor();

        if(Phaser.Input.Keyboard.JustDown(this.selectionKeys.select)) {
            this.scene.sound.play('blip');
            this.items[this.selectedItem].onSelect();
        }
    }

    updateSelectionCursor() {
        if(Phaser.Input.Keyboard.JustDown(this.selectionKeys.down) && this.selectedItem + 1 < this.items.length) {
            this.scene.sound.play('blip');
            this.selectedItem++;
        }
        if(Phaser.Input.Keyboard.JustDown(this.selectionKeys.up) && this.selectedItem > 0) {
            this.scene.sound.play('blip');
            this.selectedItem--;
        }
        this.cursor.setY(this.selections[this.selectedItem].y);
    }
}

export default Selection;