import Phaser from 'phaser';
import {loadFont} from '../../common/utils';
import Pokemon from '../objects/Pokemon';
import pokemons from '../data/pokemon.json';
import { sceneStack } from '../50mon';
import { LARGE_FONT, MEDIUM_FONT, POKEMON_ELLIPSE_COLOUR } from '../constants';

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

        this.load.image('cursor', 'assets/graphics/cursor.png');

        this.loadSounds();
    }

    loadSounds() {
        this.load.audio("intro-music", "assets/sounds/intro.mp3")
        this.load.audio("field-music", "assets/sounds/field_music.wav")
        this.load.audio("battle-music", "assets/sounds/battle_music.mp3")
        this.load.audio("victory-music", "assets/sounds/victory.wav")
        this.load.audio("run", "assets/sounds/run.wav")
        this.load.audio("blip", "assets/sounds/blip.wav")
        this.load.audio("heal", "assets/sounds/heal.wav")
        this.load.audio("powerup", "assets/sounds/powerup.wav")
        this.load.audio("hit", "assets/sounds/hit.wav")
        this.load.audio("exp", "assets/sounds/exp.wav")
        this.load.audio("levelup", "assets/sounds/levelup.wav")
    }

    create() {
        this.sound.play('intro-music', {
            sound: 0.5,
            loop: true
        });

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
                    this.sound.stopByKey('intro-music');

                    sceneStack.pop();

                    sceneStack.push('PlayScene');
                    sceneStack.push('DialogueScene', {
                        text: `Welcome to the world of 50Mon! To start fighting monsters with your own randomly assigned monster,` + 
                        ` just walk in the tall grass!  If you need to heal, just press 'H' in the field! ` +
                        `Good luck! (Press Enter to dismiss dialogues)`
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
        this.add.text(this.game.config.width/2, this.game.config.height/2 - 72, "50-Mon!", LARGE_FONT).setFill('rgba(24, 24, 24, 1)').setOrigin(0.5, 0.5);

        this.add.text(this.game.config.width/2, this.game.config.height/2 + 68, "Press Enter", MEDIUM_FONT).setFill('rgba(24, 24, 24, 1)').setOrigin(0.5, 0.5);
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