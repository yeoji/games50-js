import Phaser from 'phaser';
import { sceneStack } from '../50mon';
import Menu from '../gui/Menu';

class BattleMenuScene extends Phaser.Scene {
    constructor() {
        super('BattleMenuScene');
    }

    create() {
        this.menu = new Menu(this, this.game.config.width - 64, this.game.config.height - 64, 64, 64, [
            {
                text: 'Fight',
                onSelect: () => {
                    console.log('fight selected')
                }
            },
            {
                text: 'Run',
                onSelect: () => {
                    sceneStack.pop();

                    sceneStack.push('DialogueScene', {
                        y: this.game.config.height - 64,
                        height: 64,
                        fontSize: 16,
                        text: `You fled successfully!`
                    });

                    setTimeout(() => {
                        sceneStack.push('FadeScene', {
                            r: 255,
                            g: 255,
                            b: 255,
                            a: 1,
                            duration: 1000,
                            onComplete: () => {
                                // get rid of fled message
                                sceneStack.pop();

                                // get rid of battle scene
                                sceneStack.pop();

                                sceneStack.push('FadeScene', {
                                    r: 255,
                                    g: 255,
                                    b: 255,
                                    a: 0,
                                    duration: 1000
                                });
                            }
                        });
                    }, 500);
                }
            }
        ])
    }

    update() {
        this.menu.update();
    }
}

export default BattleMenuScene;