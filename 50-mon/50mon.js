import Phaser from 'phaser';
import SceneStack from '../common/SceneStack';
import BattleMenuScene from './scenes/BattleMenuScene';
import BattleScene from './scenes/BattleScene';
import DialogueScene from './scenes/DialogueScene';
import FadeScene from './scenes/FadeScene';
import FightScene from './scenes/FightScene';
import PlayScene from './scenes/PlayScene';
import StartScene from './scenes/StartScene';
import WhiteShader from './pipelines/WhiteShader';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    scale: {
        width: 384,
        height: 216,
        zoom: (384/1280),
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [StartScene, PlayScene, FadeScene, DialogueScene, BattleScene, BattleMenuScene, FightScene],
    callbacks: {
        postBoot: game => {
            game.renderer.addPipeline('WhiteShader', new WhiteShader(game));
        }
    }
};

const game = new Phaser.Game(config);

export const sceneStack = new SceneStack(game.scene, ['StartScene']);