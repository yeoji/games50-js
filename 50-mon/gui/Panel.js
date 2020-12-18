import Phaser from 'phaser';

const BORDER_COLOUR = 0xffffff;
const INNER_PANEL_COLOUR = 0x383838;

class Panel extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height) {
        super(scene);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.create();

        this.scene.add.existing(this);
    }

    create() {
        this.outerPanel = this.scene.add.graphics().fillStyle(BORDER_COLOUR).fillRoundedRect(this.x, this.y, this.width, this.height, 3);
        this.innerPanel = this.scene.add.graphics().fillStyle(INNER_PANEL_COLOUR).fillRoundedRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4, 3);
    }

    destroy() {
        this.outerPanel.destroy();
        this.innerPanel.destroy();
    }
}

export default Panel;