import Phaser from 'phaser';
import { sceneStack } from '../50mon';

class FightScene extends Phaser.Scene {
    constructor() {
        super('FightScene');
    }

    init({battleScene}) {
        this.battleScene = battleScene;
        this.attacking = false;    
    }

    async update() {
        if(this.attacking) {
            return;
        }

        this.attacking = true;

        const {playerPokemon, opponentPokemon, playerSprite, opponentSprite, playerHealthBar, opponentHealthBar} = this.battleScene;

        if(playerPokemon.speed >= opponentPokemon.speed) {
            await this.attack(playerPokemon, opponentPokemon, playerSprite, opponentSprite, opponentHealthBar);
            if(this.checkDeaths()) {
                return;
            }

            await this.attack(opponentPokemon, playerPokemon, opponentSprite, playerSprite, playerHealthBar);
            if(this.checkDeaths()) {
                return;
            }
        } else {
            await this.attack(opponentPokemon, playerPokemon, opponentSprite, playerSprite, playerHealthBar);
            if(this.checkDeaths()) {
                return;
            }

            await this.attack(playerPokemon, opponentPokemon, playerSprite, opponentSprite, opponentHealthBar);
            if(this.checkDeaths()) {
                return;
            }
        }

        // remove fight scene
        sceneStack.pop();

        sceneStack.push('BattleMenuScene', {
            battleScene: this.battleScene
        });
    }

    attack(attacker, defender, attackerSprite, defenderSprite, defenderHealthBar) {
        sceneStack.push('DialogueScene', {
            y: this.game.config.height - 64,
            height: 64,
            fontSize: 16,
            text: `${attacker.attributes.name} attacks ${defender.attributes.name}!`,
            canSkip: false
        });

        return new Promise(resolve => {
            setTimeout(async () => {
                await attackerSprite.flashWhite()
                await defenderSprite.flashOpacity()
    
                // update health bar of defender
                const dmg = Math.max(1, attacker.attack - defender.defense);
                defender.currentHP = Math.max(0, defender.currentHP - dmg);
                defenderHealthBar.setValue(defender.currentHP);

                sceneStack.getActiveScene().tweens.add({
                    targets: defenderHealthBar.progress,
                    width: defenderHealthBar.getProgressWidth(),
                    duration: 500,
                    onComplete: () => {
                        // remove battle dialogue
                        sceneStack.pop();

                        resolve();
                    }
                });
            }, 500);
        })
    }

    checkDeaths() {
        const {playerPokemon, opponentPokemon} = this.battleScene;

        if(playerPokemon.currentHP <= 0) {
            this.faint();
            return true;
        } else if(opponentPokemon.currentHP <= 0) {
            this.victory();
            return true;
        }
        return false;
    }

    faint() {
        const {playerSprite} = this.battleScene;

        sceneStack.getActiveScene().tweens.add({
            targets: playerSprite,
            y: this.game.config.height,
            duration: 200,
            onComplete: () => {
                sceneStack.push('DialogueScene', {
                    y: this.game.config.height - 64,
                    height: 64,
                    fontSize: 16,
                    text: `You fainted!`,
                    onComplete: () => {
                        sceneStack.push('FadeScene', {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 1,
                            duration: 1000,
                            onComplete: () => {
                                // remove fight scene
                                sceneStack.pop();
                                // remove battle scene
                                sceneStack.pop();

                                sceneStack.push('FadeScene', {
                                    r: 0,
                                    g: 0,
                                    b: 0,
                                    a: 0,
                                    duration: 1000
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    victory() {
        const {opponentSprite} = this.battleScene;

        sceneStack.getActiveScene().tweens.add({
            targets: opponentSprite,
            y: this.game.config.height,
            duration: 200,
            onComplete: () => {
                sceneStack.push('DialogueScene', {
                    y: this.game.config.height - 64,
                    height: 64,
                    fontSize: 16,
                    text: `Victory!`,
                    onComplete: () => {
                        sceneStack.push('FadeScene', {
                            r: 255,
                            g: 255,
                            b: 255,
                            a: 1,
                            duration: 1000,
                            onComplete: () => {
                                // remove fight scene
                                sceneStack.pop();
                                // remove battle scene
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
                    }
                });
            }
        });
    }
}

export default FightScene;