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
                this.sound.play('powerup');
                await attackerSprite.flashWhite()

                this.sound.play('hit');
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
        const {playerSprite, playerPokemon} = this.battleScene;

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

                                this.sound.play('field-music', {
                                    sound: 0.5,
                                    loop: true
                                });

                                playerPokemon.heal();
                                sceneStack.push('DialogueScene', {
                                    text: 'Your Pokemon has been fully restored; try again!'
                                });

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
                this.sound.stopByKey('battle-music');
                this.sound.play('victory-music', {
                    sound: 0.5,
                    loop: true
                });

                sceneStack.push('DialogueScene', {
                    y: this.game.config.height - 64,
                    height: 64,
                    fontSize: 16,
                    text: `Victory!`,
                    onComplete: this.updatePlayerExp
                });
            }
        });
    }

    updatePlayerExp = () => {
        const {opponentPokemon, playerPokemon, playerExpBar} = this.battleScene;

        // sum all IVs and multiply by level to get exp amount
        const exp = (opponentPokemon.attributes.HPIV + opponentPokemon.attributes.attackIV +
            opponentPokemon.attributes.defenseIV + opponentPokemon.attributes.speedIV) * opponentPokemon.level;

        sceneStack.push('DialogueScene', {
            y: this.game.config.height - 64,
            height: 64,
            fontSize: 16,
            text: `You earned ${exp} experience points!`,
            canSkip: false
        });

        setTimeout(() => {
            this.sound.play('exp');

            playerExpBar.setValue(Math.min(playerPokemon.currentExp + exp, playerPokemon.expToLevel));
            playerPokemon.currentExp += exp;

            sceneStack.getActiveScene().tweens.add({
                targets: playerExpBar.progress,
                width: playerExpBar.getProgressWidth(),
                duration: 500,
                onComplete: () => {
                    sceneStack.pop();

                    if(playerPokemon.currentExp >= playerPokemon.expToLevel) {
                        this.levelUpPokemon();
                    } else {
                        this.fadeOutWhite();
                    }
                }
            });
        }, 1500);
    }

    levelUpPokemon() {
        const {playerPokemon, playerExpBar, playerLevel, playerHealthBar} = this.battleScene;

        const [hpIncrease, attackIncrease, defenseIncrease, speedIncrease] = playerPokemon.levelUp();

        this.sound.play('levelup');

        sceneStack.push('DialogueScene', {
            y: this.game.config.height - 64,
            height: 64,
            fontSize: 16,
            text: `Congratulations! Level Up!`,
            onComplete: () =>{
                sceneStack.push('DialogueScene', {
                    x: this.game.config.width - 130,
                    y: 32,
                    height: 64,
                    width: 100,
                    fontSize: 8,
                    text: [
                        `HP: ${playerPokemon.HP - hpIncrease} + ${hpIncrease} = ${playerPokemon.HP} `,
                        `Attack: ${playerPokemon.attack - attackIncrease} + ${attackIncrease} = ${playerPokemon.attack} `,
                        `Defense: ${playerPokemon.defense - defenseIncrease} + ${defenseIncrease} = ${playerPokemon.defense} `,
                        `Speed: ${playerPokemon.speed - speedIncrease} + ${speedIncrease} = ${playerPokemon.speed} `
                    ],
                    onComplete: () => {
                        this.fadeOutWhite();
                    }
                });
            }
        });

        playerLevel.setText(`LV ${playerPokemon.level}`);

        playerExpBar.setMax(playerPokemon.expToLevel);
        playerExpBar.setValue(playerPokemon.currentExp);
        playerExpBar.progress.width = 0;
        sceneStack.getActiveScene().tweens.add({
            targets: playerExpBar.progress,
            width: playerExpBar.getProgressWidth(),
            duration: 500
        });

        playerPokemon.heal();
        playerHealthBar.setMax(playerPokemon.HP);
        playerHealthBar.setValue(playerPokemon.currentHP);
        sceneStack.getActiveScene().tweens.add({
            targets: playerHealthBar.progress,
            width: playerHealthBar.getProgressWidth(),
            duration: 500
        });

    }

    fadeOutWhite() {
        sceneStack.push('FadeScene', {
            r: 255,
            g: 255,
            b: 255,
            a: 1,
            duration: 1000,
            onComplete: () => {
                this.sound.stopByKey('victory-music');
                this.sound.play('field-music', {
                    sound: 0.5,
                    loop: true
                });
                
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
}

export default FightScene;