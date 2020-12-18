import Phaser from 'phaser';
import {loadFont} from '../../common/utils';
import Pokemon from '../objects/Pokemon';
import pokemons from '../data/pokemon.json';
import { sceneStack } from '../50mon';
import { POKEMON_ELLIPSE_COLOUR } from '../constants';

class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        loadFont("font", "assets/fonts/font.ttf");

        this.load.atlas('pokemon', 'assets/graphics/pokemon/pokemon.png', 'assets/graphics/pokemon/pokemon.json');

        this.load.spritesheet("tiles", "assets/graphics/tiles.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("entities", "assets/graphics/entities.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    create() {
        this.game.config.backgroundColor.setFromRGB({
            r: 188,
            g: 188,
            b: 188
        });

        this.drawTitle();
        this.drawPokemon();

        this.input.keyboard.on('keydown-ENTER', () => {
            clearInterval(this.pokemonSlideAnimation);
            
            sceneStack.push('FadeScene', {
                r: 255,
                g: 255,
                b: 255,
                a: 1,
                duration: 1000,
                onComplete: () => {
                    sceneStack.pop();

                    sceneStack.push('PlayScene');
                    sceneStack.push('DialogueScene', {
                        text: `Welcome to the world of 50Mon! To start fighting monsters with your own randomly assigned monster,` + 
                        ` just walk in the tall grass! If you need to heal, just press 'P' in the field!` +
                        ` Good luck! (Press Enter to dismiss dialogues)`
                    });
                    sceneStack.push('FadeScene', {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 0,
                        duration: 1000
                    });
                }
            });
        });
    }

    drawTitle() {
        this.add.text(this.game.config.width/2, this.game.config.height/2 - 72, "50-Mon!", {
            fontFamily: 'font',
            fill: 'rgba(24, 24, 24, 1)',
            fontSize: 32
        }).setOrigin(0.5, 0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2 + 68, "Press Enter", {
            fontFamily: 'font',
            fill: 'rgba(24, 24, 24, 1)',
            fontSize: 16
        }).setOrigin(0.5, 0.5);
    }

    drawPokemon() {
        this.add.ellipse(this.game.config.width/2, this.game.config.height/2 + 32, 148, 42, POKEMON_ELLIPSE_COLOUR, 0.5);

        let randomPokemon = Phaser.Math.RND.pick(pokemons);
        this.pokemon = new Pokemon(randomPokemon).createBattleSprite(this, this.game.config.width/2, this.game.config.height/2 + 16);

        this.pokemonSlideAnimation = setInterval(() => {
            this.tweens.add({
                targets: this.pokemon,
                duration: 200,
                x: -this.pokemon.width,
                onComplete: () => { 
                    this.pokemon.destroy();

                    randomPokemon = Phaser.Math.RND.pick(pokemons);
                    this.pokemon = new Pokemon(randomPokemon).createBattleSprite(this, this.game.config.width, this.game.config.height/2 + 16);
    
                    this.tweens.add({
                        targets: this.pokemon,
                        duration: 200,
                        x: this.game.config.width/2
                    })
                }
            });
        }, 3000);
    }
}

export default StartScene;