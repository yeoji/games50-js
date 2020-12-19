import Phaser from 'phaser'; 

class ProgressBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, colour, value, max) {
        super(scene);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.colour = colour;
        this.value = value;
        this.max = max;

        this.create();
    }

    create() {
        if(this.value > 0) {
            this.progress = this.scene.add.rectangle(this.x, this.y, this.getProgressWidth(), this.height, this.colour).setOrigin(0, 0);
        }
        this.outline = this.scene.add.graphics().lineStyle(2, 0x000000).strokeRoundedRect(this.x, this.y, this.width, this.height, 3);
    }

    getProgressWidth() {
        return this.width * (this.value / this.max);
    }

    getProgressScale() {
        return (this.value/this.max);
    }

    setValue(value) {
        if(value >= 0 && value <= this.max) {
            this.value = value;
        }
    }
}

export default ProgressBar;