import Phaser from 'phaser';
import LaunchMarker from './LaunchMarker';
import levels from '../levels.json';
import Alien, {CIRCLE_ALIEN} from './Alien';
import Obstacle from './Obstacle';

class Level extends Phaser.GameObjects.Container {
    constructor(scene, levelNo = 1) {
        super(scene);

        this.levelNo = levelNo;
        this.launchMarker = new LaunchMarker(scene);

        this.instructions = this.createInstructions();
        this.victoryText = this.createVictoryText();

        this.extraAliens = [];
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

            const playerStopped = (
                Math.abs(this.launchMarker.alien.body.velocity.x) + Math.abs(this.launchMarker.alien.body.velocity.y) < 0.0001
                &&
                this.extraAliens.filter(alien => alien.body && (Math.abs(alien.body.velocity.x) + Math.abs(alien.body.velocity.y) >= 0.0001)).length === 0
            );
            if(playerStopped) {
                if(activeEnemies === 0) {
                    this.scene.scene.start('PlayScene', {
                        levelNo: (this.levelNo % levels.length) + 1
                    });
                }

                this.launchMarker.resetLaunchMarker();
                this.extraAliens.forEach(alien => alien.destroy());
                this.extraAliens = [];
            } else {
                if(this.extraAliens.length === 0 && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                    this.splitAlien();
                }
            }
        }

        if(activeEnemies === 0) {
            this.victoryText.setVisible(true);
        }
    }

    splitAlien() {
        const mainAlienX = this.launchMarker.alien.x;
        const mainAlienY = this.launchMarker.alien.y;

        const mainAlienVelX = this.launchMarker.alien.body.velocity.x;
        const mainAlienVelY = this.launchMarker.alien.body.velocity.y;

        this.extraAliens = [
            new Alien(this.scene, mainAlienX, mainAlienY, CIRCLE_ALIEN).setAngle(45).setVelocity(mainAlienVelX, mainAlienVelY - 1),
            new Alien(this.scene, mainAlienX, mainAlienY, CIRCLE_ALIEN).setAngle(135).setVelocity(mainAlienVelX, mainAlienVelY + 1),
        ];
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