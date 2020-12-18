import Phaser from 'phaser';
import { sceneStack } from '../50mon';

class FadeScene extends Phaser.Scene {
    constructor() {
        super('FadeScene');
    }

    init({r, g, b, a, duration, onComplete}) {
        this.colour = Phaser.Display.Color.GetColor(r, g, b);
        this.opacity = a === 1 ? 0 : 1;
        this.duration = duration;

        this.onComplete = onComplete;
    }

    create() {
        this.fadeCanvas = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, this.colour, this.opacity).setOrigin(0, 0);

        this.tweens.add({
            targets: this.fadeCanvas,
            duration: this.duration,
            fillAlpha: (this.opacity === 1 ? 0: 1),
            onComplete: () => {
                sceneStack.pop();

                this.onComplete();
            }
        });
    }
}

export default FadeScene;