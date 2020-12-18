import Phaser from 'phaser';
import Panel from './Panel';

const LINES_TO_DISPLAY = 3;

class Textbox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, text, fontSize = 8) {
        super(scene);

        this.panel = new Panel(scene, x, y, width, height);
        this.text = this.scene.add.text(x + 4, y + 4, text, {
            fontFamily: 'font',
            fontSize: fontSize
        }).setWordWrapWidth(this.scene.game.config.width  - 8).setVisible(false);

        this.textWrapped = this.text.getWrappedText();
        this.currentChunk = 0;

        this.next();
    }

    next() {
        this.text.setText(this.textWrapped.slice(this.currentChunk * LINES_TO_DISPLAY, (this.currentChunk * LINES_TO_DISPLAY) + LINES_TO_DISPLAY));
        this.text.setVisible(true);

        this.currentChunk++;

        if(this.textWrapped.length <= this.currentChunk * LINES_TO_DISPLAY) {
            this.ended = true;
            return;
        }
    }

    close() {
        this.panel.destroy();
        this.text.destroy();
    }
}

export default Textbox;