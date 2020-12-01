import Phaser from 'phaser';
import { DOOR_BOTTOM_CLOSED, DOOR_BOTTOM_OPEN, DOOR_LEFT_CLOSED, DOOR_LEFT_OPEN, DOOR_RIGHT_CLOSED, DOOR_RIGHT_OPEN, DOOR_TOP_CLOSED, DOOR_TOP_OPEN, DOWN, GAME_HEIGHT, GAME_WIDTH, LEFT, RIGHT, TILE_HEIGHT, TILE_WIDTH, UP } from '../constants';

const getDoorwayPosition = (direction) => {
    switch(direction) {
        case LEFT:
            return [0, GAME_HEIGHT/2]
        case RIGHT:
            return [GAME_WIDTH - (TILE_WIDTH * 2), GAME_HEIGHT/2]
        case UP:
            return [GAME_WIDTH/2 - TILE_WIDTH, TILE_HEIGHT]
        case DOWN:
            return [GAME_WIDTH/2 - TILE_WIDTH, GAME_HEIGHT - TILE_HEIGHT]
    }
};

const getDoorwayTiles = (direction, isOpen) => {
    switch(direction) {
        case LEFT:
            return isOpen ? DOOR_LEFT_OPEN : DOOR_LEFT_CLOSED;
        case RIGHT:
            return isOpen ? DOOR_RIGHT_OPEN : DOOR_RIGHT_CLOSED;
        case UP:
            return isOpen ? DOOR_TOP_OPEN : DOOR_TOP_CLOSED;
        case DOWN:
            return isOpen ? DOOR_BOTTOM_OPEN : DOOR_BOTTOM_CLOSED;
    }
}

class Doorway extends Phaser.GameObjects.Container {
    constructor(scene, direction) {
        super(scene);

        this.direction = direction;

        const [x, y] = getDoorwayPosition(direction);
        const tileIds = getDoorwayTiles(direction, false);

        this.topLeft = new DoorPiece(scene, x, y - TILE_HEIGHT, tileIds[0]);
        this.topRight = new DoorPiece(scene, x + TILE_WIDTH, y - TILE_HEIGHT, tileIds[1]);
        this.bottomLeft = new DoorPiece(scene, x, y, tileIds[2]);
        this.bottomRight = new DoorPiece(scene, x + TILE_WIDTH, y, tileIds[3]);
    }

    open = () => {
        const tileIds = getDoorwayTiles(this.direction, true);

        this.topLeft.setFrame(tileIds[0]);
        this.topRight.setFrame(tileIds[1]);
        this.bottomLeft.setFrame(tileIds[2]);
        this.bottomRight.setFrame(tileIds[3]);
    }
}

class DoorPiece extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, tileId) {
        super(scene, x, y, "tiles", tileId);

        this.scene.add.existing(this.setOrigin(0, 0));
    }
}

export default Doorway;