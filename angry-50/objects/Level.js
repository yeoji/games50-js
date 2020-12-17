import Phaser from 'phaser';
import LaunchMarker from './LaunchMarker';
import levels from '../levels.json';
import Alien from './Alien';
import Obstacle from './Obstacle';

class Level extends Phaser.GameObjects.Container {
    constructor(scene, levelNo = 1) {
        super(scene);

        this.levelNo = levelNo;
        this.launchMarker = new LaunchMarker(scene);

        this.instructions = this.createInstructions();
        this.victoryText = this.createVictoryText();

        this.loadLevel();
    }

    loadLevel() {
        const levelData = levels[this.levelNo - 1];

        this.enemies = levelData.enemies.map(enemy => {
            return new Alien(this.scene, enemy.x, enemy.y);
        });

        this.obstacles = levelData.obstacles.map(obstacle => {
            return new Obstacle(this.scene, obstacle);
        });
    }

    update() {
        const activeEnemies = this.enemies.filter(enemy => enemy.active).length;

        this.launchMarker.update();

        if(!this.launchMarker.launched) {
            this.instructions.setVisible(true);
        } else {
            this.instructions.setVisible(false);

            if(Math.abs(this.launchMarker.alien.body.velocity.x) + Math.abs(this.launchMarker.alien.body.velocity.y) < 0.0001) {
                if(activeEnemies === 0) {
                    this.scene.scene.start('PlayScene', {
                        levelNo: (this.levelNo % levels.length) + 1
                    });
                }

                this.launchMarker.resetLaunchMarker();
            }
        }

        if(activeEnemies === 0) {
            this.victoryText.setVisible(true);
        }
    }

    createInstructions() {
        return this.scene.add.text(this.scene.game.config.width/2, 64, "Click and drag circular alien to shoot!", {
            fontFamily: 'font',
            fill: 'rgba(0, 0, 0, 1)',
            fontSize: 16
        }).setOrigin(0.5, 0.5).setVisible(false);
    }

    createVictoryText() {
        return this.scene.add.text(this.scene.game.config.width/2, this.scene.game.config.height/2 - 32, "VICTORY", {
            fontFamily: 'font',
            fill: 'rgba(0, 0, 0, 1)',
            fontSize: 64
        }).setOrigin(0.5, 0.5).setVisible(false);
    }
}

export default Level;