import Phaser from 'phaser';

class BattleSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, 'pokemon', sprite);

        this.scene.add.existing(this);
    }

    flashWhite() {
        let flashing = true;
        let flashingCount = 0;

        return new Promise(resolve => {
            const flashingInterval = setInterval(() => {
                if(flashing) {
                    this.setPipeline('WhiteShader');
                } else {
                    this.resetPipeline();
                }
                flashing = !flashing;
                flashingCount++;
    
                if(flashingCount === 6) {
                    clearInterval(flashingInterval);
                    resolve();
                }
            }, 100);
        });
    }

    flashOpacity() {
        let flashing = true;
        let flashingCount = 0;

        return new Promise(resolve => {
            const flashingInterval = setInterval(() => {
                if(flashing) {
                    this.setAlpha(0.25);
                } else {
                    this.setAlpha(1);
                }
                flashing = !flashing;
                flashingCount++;
    
                if(flashingCount === 6) {
                    clearInterval(flashingInterval);
                    resolve();
                }
            }, 100);
        })
    }
}

export default BattleSprite;