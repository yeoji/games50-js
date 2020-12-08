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
    constructor(scene, direction, roomOffset) {
        super(scene);

        this.direction = direction;
        this.isOpen = false;

        this.roomOffset = roomOffset;
        let [x, y] = getDoorwayPosition(direction);
        x += roomOffset.x;
        y += roomOffset.y;

        const tileIds = getDoorwayTiles(direction, this.isOpen);

        this.topLeft = new DoorPiece(scene, x, y - TILE_HEIGHT, tileIds[0]);
        this.topRight = new DoorPiece(scene, x + TILE_WIDTH, y - TILE_HEIGHT, tileIds[1]);
        this.bottomLeft = new DoorPiece(scene, x, y, tileIds[2]);
        this.bottomRight = new DoorPiece(scene, x + TILE_WIDTH, y, tileIds[3]);

        this.bringTopToFront();
    }

    bringTopToFront = () => {
        switch(this.direction) {
            case LEFT:
                this.topLeft.setDepth(999);
                this.bottomLeft.setDepth(999);
            case RIGHT:
                this.topRight.setDepth(999);
                this.bottomRight.setDepth(999);
            case DOWN:
                this.bottomLeft.setDepth(999);
                this.bottomRight.setDepth(999);
            case UP:
                this.topLeft.setDepth(999);
                this.topRight.setDepth(999);
        }
    }

    getPieces = () => {
        return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight]
    }

    getEntry = () => {
        switch(this.direction) {
            case LEFT:
                return new Phaser.Geom.Rectangle(this.topRight.x, this.topRight.y + (TILE_HEIGHT/2), TILE_WIDTH + 5, TILE_HEIGHT)
            case RIGHT:
                return new Phaser.Geom.Rectangle(this.topLeft.x - 5, this.topLeft.y + (TILE_HEIGHT/2), TILE_WIDTH, TILE_HEIGHT)
            case DOWN:
                return new Phaser.Geom.Rectangle(this.topLeft.x + (TILE_WIDTH/2), this.topLeft.y - 5, TILE_WIDTH, TILE_HEIGHT)
            case UP:
                return new Phaser.Geom.Rectangle(this.bottomLeft.x + (TILE_WIDTH/2), this.bottomLeft.y + 5, TILE_WIDTH, TILE_HEIGHT)
        }
    }

    open = () => {
        this.isOpen = true;
        this.update();
    }

    close = () => {
        this.isOpen = false;
        this.update();
    }

    resetPosition = () => {
        this.topLeft.setPosition(this.topLeft.x - this.roomOffset.x, this.topLeft.y - this.roomOffset.y);
        this.topRight.setPosition(this.topRight.x - this.roomOffset.x, this.topRight.y - this.roomOffset.y);
        this.bottomLeft.setPosition(this.bottomLeft.x - this.roomOffset.x, this.bottomLeft.y - this.roomOffset.y);
        this.bottomRight.setPosition(this.bottomRight.x - this.roomOffset.x, this.bottomRight.y - this.roomOffset.y);
    }

    update = () => {
        const tileIds = getDoorwayTiles(this.direction, this.isOpen);

        this.topLeft.setFrame(tileIds[0]);
        this.topRight.setFrame(tileIds[1]);
        this.bottomLeft.setFrame(tileIds[2]);
        this.bottomRight.setFrame(tileIds[3]);
    }

    destroy = () => {
        this.topLeft.destroy();
        this.topRight.destroy();
        this.bottomLeft.destroy();
        this.bottomRight.destroy();
    }
}

class DoorPiece extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tileId) {
        super(scene, x, y, "tiles", tileId);

        this.scene.add.existing(this.setOrigin(0, 0));
        this.scene.physics.add.existing(this);
    }
}

export default Doorway;