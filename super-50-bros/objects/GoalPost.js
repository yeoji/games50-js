import Phaser from 'phaser';

class Pole extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        const variant = Phaser.Math.Between(0, 5);
        super(scene, x, y, "flagPoles", variant);

        scene.add.existing(this);
    }
}

class Flag extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "flags");

        const variant = Phaser.Math.Between(0, 3);
        this.startFrame = (variant * 6) + (variant * 3) + 6;

        scene.add.existing(this);

        this.createAnimations();
        this.anims.play("waving", true);
    }

    createAnimations() {
        this.scene.anims.create({
            key: "waving",
            frames: this.scene.anims.generateFrameNumbers('flags', { start: this.startFrame, end: this.startFrame + 1 }),
            frameRate: 10,
            repeat: -1
        })
    }
}

class GoalPost extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene);

        this.pole = new Pole(scene, x, y);
        this.flag = new Flag(scene, x + 8, y - 16);

        scene.add.existing(this);
    }

    getBounds() {
        return this.pole.getBounds();
    }
}

export default GoalPost;