import Phaser from 'phaser';
import Level from '../objects/Level';
import Player from '../objects/Player';
import {generateLevel} from '../levelMaker';

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');

        this.score = 0;
        this.scoreText = [];
    }

    preload() {
        this.controls = this.input.keyboard.createCursorKeys();
    }

    create() {
        const mapWidth = 20;
        const mapHeight = 20;
        this.cameras.main.setBounds(0, 0, mapWidth * 15, 144);
        this.physics.world.setBounds(0, 0, mapWidth * 15, 144);

        this.level = new Level(this, generateLevel(mapWidth, mapHeight));
        this.level.spawnEnemies();

        this.player = new Player(this);
        this.physics.add.collider(this.player, this.level.getGround());
        this.physics.add.collider(this.player, this.level.getEnemies(), this.handleEnemyCollide, null, this);
        this.cameras.main.startFollow(this.player, true);
    }

    drawScore() {
        this.scoreText.forEach(text => text.destroy());

        const shadow = this.add.text(6, 1, this.score, {
            fontFamily: 'text',
            fill: '#000',
            fontSize: 16,
            resolution: 10,
        })
        const text = this.add.text(5, 0, this.score, {
            fontFamily: 'text',
            fill: '#fff',
            fontSize: 16,
            resolution: 10
        });

        shadow.setScrollFactor(0);
        text.setScrollFactor(0);

        this.scoreText = [text, shadow];
    }

    update() {
        this.drawScore();
        this.level.update(this.player);

        if(Phaser.Input.Keyboard.JustDown(this.controls.space) && this.player.body.touching.down) {
            this.player.jump();
            return;
        }

        if(this.controls.left.isDown) {
            this.player.moveLeft();
        } else if(this.controls.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.stop();
        }
    }

    handleEnemyCollide(player, enemy) {
        if(player.isFalling()) {
            // player killed enemy by jumping on it, add to score
            enemy.destroy();
            this.score += 100;
        } else {
            this.scene.start("StartScene");
        }
    }
}

export default PlayScene;