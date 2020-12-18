import Phaser from 'phaser';
import { sceneStack } from '../50mon';
import Textbox from '../gui/Textbox';

class DialogueScene extends Phaser.Scene {
    constructor() {
        super('DialogueScene');
    }

    init({text, onComplete}) {
        this.text = text;
        this.onComplete = onComplete || function() {}
    }

    create() {
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.dialogue = new Textbox(this, 0, 0, this.game.config.width, 50, this.text);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.enterKey)) {
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