import Phaser from 'phaser';
import {renderBackground} from '../background';
import Level from '../objects/Level';

const GROUND_FRAME_IDS = [3, 10, 11, 17];
const GROUND_TILE_SIZE = 35;
const GROUND_HEIGHT = 30;

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    init(data) {
        this.levelNo = data.levelNo;
    }

    create() {
        this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height - GROUND_HEIGHT);

        renderBackground(this);
        this.drawGround();

        this.level = new Level(this, this.levelNo);
    }

    drawGround() {
        const groundFrame = Phaser.Math.RND.pick(GROUND_FRAME_IDS);

        for (let x = 0; x < this.game.config.width; x += GROUND_TILE_SIZE) {
            this.add.sprite(x, this.game.config.height - GROUND_HEIGHT, 'tiles', groundFrame).setOrigin(0,0);
        }
    }

    update() {
        this.level.update();
    }
}

export default PlayScene;