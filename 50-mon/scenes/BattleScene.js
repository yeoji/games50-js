import Phaser from 'phaser';
import Pokemon, { BACK_FACING } from '../objects/Pokemon';
import pokemons from '../data/pokemon.json';
import { EXP_BAR_COLOUR, HEALTH_BAR_COLOUR, POKEMON_ELLIPSE_COLOUR, SMALL_FONT } from '../constants';
import { sceneStack } from '../50mon';
import Panel from '../gui/Panel';
import ProgressBar from '../gui/ProgressBar';

class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    init({player}) {
        this.battleStarted = false;

        this.playerPokemon = player.party[0];
        this.opponentPokemon = new Pokemon(Phaser.Math.RND.pick(pokemons), Phaser.Math.Between(2, 6));
    }

    create() {
        this.background = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0xd6d6d6).setOrigin(0, 0);
        
        this.drawPlayer();
        this.drawOpponent();

        this.bottomPanel = new Panel(this, 0, this.game.config.height - 64, this.game.config.width, 64);
    }

    update() {
        if(!this.battleStarted) {
            this.triggerSlideIn();
        }
    }

    drawPlayer() {
        this.playerEllipse = this.add.ellipse(-68, this.game.config.height - 64, 148, 42, POKEMON_ELLIPSE_COLOUR, 0.5);

        this.playerSprite = this.playerPokemon.createBattleSprite(this, -32, this.game.config.height - 96, BACK_FACING);
    }

    drawOpponent() {
        this.opponentEllipse = this.add.ellipse(this.game.config.width + 32, 60, 148, 42, POKEMON_ELLIPSE_COLOUR, 0.5);
        this.opponentSprite = this.opponentPokemon.createBattleSprite(this, this.game.config.width + 32, 32);
    }

    drawPokemonInfo() {
        this.opponentHealthBar = new ProgressBar(this, 8, 8, 152, 6, HEALTH_BAR_COLOUR, this.opponentPokemon.currentHP, this.opponentPokemon.HP);
        this.opponentLevel = this.add.text(this.opponentHealthBar.x, this.opponentHealthBar.y + 8, `LV ${this.opponentPokemon.level}`, SMALL_FONT).setFill('rgba(0, 0, 0, 1)');

        this.playerHealthBar = new ProgressBar(this, this.game.config.width - 160, this.game.config.height - 80, 152, 6, HEALTH_BAR_COLOUR, this.playerPokemon.currentHP, this.playerPokemon.HP);
        this.playerExpBar = new ProgressBar(this, this.game.config.width - 160, this.game.config.height - 73, 152, 6, EXP_BAR_COLOUR, this.playerPokemon.currentExp, this.playerPokemon.expToLevel);
        this.playerLevel = this.add.text(this.playerHealthBar.x, this.playerHealthBar.y - 12, `LV ${this.playerPokemon.level}`, SMALL_FONT).setFill('rgba(0, 0, 0, 1)');
    }

    triggerSlideIn() {
        this.battleStarted = true;

        this.tweens.add({
            targets: this.playerEllipse,
            duration: 1000,
            x: 66
        });
        this.tweens.add({
            targets: this.playerSprite,
            duration: 1000,
            x: 64
        });

        this.tweens.add({
            targets: this.opponentEllipse,
            duration: 1000,
            x: this.game.config.width - 70
        });
        this.tweens.add({
            targets: this.opponentSprite,
            duration: 1000,
            x: this.game.config.width - 64,
            onComplete: () => {
                this.triggerBattleStartDialogue();
                this.drawPokemonInfo();
            }
        });
    }

    triggerBattleStartDialogue() {
        sceneStack.push('DialogueScene', {
            y: this.game.config.height - 64,
            height: 64,
            fontSize: 16,
            text: `A wild ${this.opponentPokemon.attributes.name} appeared!`,
            onComplete: () => {
                sceneStack.push('DialogueScene', {
                    y: this.game.config.height - 64,
                    height: 64,
                    fontSize: 16,
                    text: `Go ${this.playerPokemon.attributes.name}!`,
                    onComplete: () => {
                        sceneStack.push('BattleMenuScene', {
                            battleScene: this
                        });
                    }
                })
            }
        });
    }
}

export default BattleScene;