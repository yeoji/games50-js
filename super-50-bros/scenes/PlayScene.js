import Phaser from 'phaser';
import Level from '../objects/Level';
import Player from '../objects/Player';
import {generateMap} from '../mapMaker';
import JumpBlock from '../objects/JumpBlock';
import LockedBlock from '../objects/LockedBlock';

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    init(data) {
        this.levelNo = data.level;
        this.score = data.score || 0;
        this.scoreText = [];

        this.gems = [];
        this.levelUnlocked = false;

        this.mapWidth = 100 + ((data.level - 1) * 10);
        this.mapHeight = 10;
    }

    preload() {
        this.controls = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.cameras.main.setBounds(0, 0, this.mapWidth * 16, 144);
        this.physics.world.setBounds(0, 0, this.mapWidth * 16, 144, true, true, true, false);
        this.physics.world.setBoundsCollision(true, true, true, false);

        this.level = new Level(this, generateMap(this.mapWidth, this.mapHeight));
        this.level.spawnEnemies();

        this.player = new Player(this);
        this.physics.add.collider(this.player, this.level.getGround());
        this.physics.add.collider(this.player, this.level.getBlocks(), this.handleBlockCollide, null, this);
        this.physics.add.collider(this.player, this.level.getEnemies(), this.handleEnemyCollide, null, this);
        this.physics.add.overlap(this.player, this.level.getKey(), this.handleUnlockLevel, null, this);
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
        this.gems.forEach(gem => this.checkIfGemIsConsumed(this.player, gem));
        if(this.goalPost) {
            this.checkIfGoalPostReached(this.player, this.goalPost);
        }

        if(!Phaser.Geom.Rectangle.Overlaps(this.player.getBounds(), this.physics.world.bounds)) {
            this.endGame();
            return;
        }

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
            this.sound.play("kill");
            this.sound.play("kill2");
            enemy.destroy();
            this.score += 100;
        } else {
            this.endGame();
        }
    }

    handleBlockCollide(player, block) {
        if(player.body.touching.up) {
            if(block instanceof JumpBlock) {
                const gem = block.activate();
                if(gem) {
                    this.gems.push(gem);
                }
            } else if(block instanceof LockedBlock) {
                if(this.levelUnlocked) {
                    block.destroy();

                    // spawn goal post
                    this.goalPost = this.level.spawnGoalPost();
                }
            }
        }
    }

    handleUnlockLevel(player, key) {
        this.levelUnlocked = true;
        key.destroy();
    }

    checkIfGemIsConsumed(player, gem) {
        if(Phaser.Geom.Rectangle.Overlaps(player.getBounds(), gem.getBounds())) {
            this.sound.play("pickup");

            gem.destroy();
            this.score += 500;

            const gemIndex = this.gems.indexOf(gem);
            this.gems = [...this.gems.slice(0, gemIndex), ...this.gems.slice(gemIndex+1)]
        }
    }

    checkIfGoalPostReached(player, goalPost) {
        if(Phaser.Geom.Rectangle.Overlaps(player.getBounds(), goalPost.getBounds())) {
            this.scene.start("PlayScene", {
                level: this.levelNo + 1,
                score: this.score
            })
        }
    }

    endGame() {
        this.sound.play("death");
        this.scene.start("StartScene");
    }
}

export default PlayScene;