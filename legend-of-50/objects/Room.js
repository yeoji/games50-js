import Phaser from 'phaser';
import {
    MAP_WIDTH, MAP_HEIGHT, 
    TILE_TOP_LEFT_CORNER, TILE_BOTTOM_LEFT_CORNER, TILE_TOP_RIGHT_CORNER, TILE_BOTTOM_RIGHT_CORNER, 
    TILE_WIDTH, TILE_HEIGHT, MAP_RENDER_OFFSET_X, MAP_RENDER_OFFSET_Y, 
    TILE_LEFT_WALLS, TILE_RIGHT_WALLS, TILE_TOP_WALLS, TILE_BOTTOM_WALLS, TILE_FLOORS
} from '../constants';

class Room extends Phaser.GameObjects.Container {
    constructor(scene, player) {
        super(scene);

        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;

        this.generateFloorAndWalls();

        this.player = player;
        this.scene.add.existing(player);
    }

    generateFloorAndWalls = () => {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const xLoc = x * TILE_WIDTH + MAP_RENDER_OFFSET_X;
                const yLoc = y * TILE_HEIGHT + MAP_RENDER_OFFSET_Y;

                // do the room corners
                if(x === 0 && y === 0) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_TOP_LEFT_CORNER).setOrigin(0,0);
                    continue;
                } else if(x === 0 && y === this.height - 1) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_BOTTOM_LEFT_CORNER).setOrigin(0,0);
                    continue;
                } else if(x === this.width - 1 && y === 0) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_TOP_RIGHT_CORNER).setOrigin(0,0);
                    continue;
                } else if(x === this.width - 1 && y === this.height - 1) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_BOTTOM_RIGHT_CORNER).setOrigin(0,0);
                    continue;
                }

                // do the walls
                if (x === 0) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_LEFT_WALLS[Phaser.Math.Between(0, TILE_LEFT_WALLS.length - 1)]).setOrigin(0,0);
                    continue
                } else if(x === this.width - 1) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_RIGHT_WALLS[Phaser.Math.Between(0, TILE_RIGHT_WALLS.length - 1)]).setOrigin(0,0);
                    continue
                } else if(y === 0) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_TOP_WALLS[Phaser.Math.Between(0, TILE_TOP_WALLS.length - 1)]).setOrigin(0,0);
                    continue
                } else if(y === this.height - 1) {
                    this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_BOTTOM_WALLS[Phaser.Math.Between(0, TILE_BOTTOM_WALLS.length - 1)]).setOrigin(0,0);
                    continue
                }

                // do the floor
                this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_FLOORS[Phaser.Math.Between(0, TILE_FLOORS.length - 1)]).setOrigin(0,0);
            }
        }
    }
}

export default Room;