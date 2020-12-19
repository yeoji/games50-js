import Phaser from 'phaser';
import { sceneStack } from '../50mon';
import Textbox from '../gui/Textbox';

class DialogueScene extends Phaser.Scene {
    constructor() {
        super('DialogueScene');
    }

    init({x = 0, y = 0, width, height, text, fontSize = 8, canSkip = true, onComplete}) {
        this.x = x;
        this.y = y;
        this.width = width || this.game.config.width;
        this.height = height || 50;

        this.text = text;
        this.fontSize = fontSize;

        this.canSkip = canSkip;
        this.onComplete = onComplete || function() {}
    }

    create() {
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.dialogue = new Textbox(this, this.x, this.y, this.width, this.height, this.text, this.fontSize);
    }

    update() {
        if(this.canSkip && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            if(this.dialogue.ended) {
                this.dialogue.close();

                sceneStack.pop();
                this.onComplete();
            } else {
                this.dialogue.next();
            }
        }
    }
}

export default DialogueScene;