import Phaser from 'phaser';
import Gem from './Gem';

class JumpBlock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        const variant = Phaser.Math.Between(0, 29);

        super(scene, x, y, "jumpBlocks", variant);

        // 20% chance that this block contains a gem
        this.hasGem = Phaser.Math.Between(1, 5) === 1;

        scene.add.existing(this);
    }

    activate() {
        if(this.hasGem) {
            this.scene.sound.play("powerupReveal");

            const gem = new Gem(this.scene, this.x, this.y);
            this.scene.add.existing(gem);
            this.scene.tweens.create({
                targets: gem,
                y: '-= 16',
                duration: 1000,
                repeat: 0,
            }).play();

            this.hasGem = false;
            return gem;
        } else {
            this.scene.sound.play("emptyBlock");
        }
        return null;
    }
}

export default JumpBlock;