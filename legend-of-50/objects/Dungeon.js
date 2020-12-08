import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, UP, DOWN, LEFT, RIGHT, MAP_RENDER_OFFSET_X, TILE_WIDTH, MAP_RENDER_OFFSET_Y } from '../constants';
import Room from './Room';

class Dungeon extends Phaser.GameObjects.Container {
    constructor(scene, player) {
        super(scene);

        this.currentRoom = new Room(scene, player);

        this.transitioning = false;
    }

    getNextRoomOffset = (direction) => {
        switch(direction) {
            case UP:
                return {
                    x: 0,
                    y: -GAME_HEIGHT
                }
            case DOWN:
                return {
                    x: 0,
                    y: GAME_HEIGHT
                }
            case LEFT:
                return {
                    x: -GAME_WIDTH,
                    y: 0
                }
            case RIGHT:
                return {
                    x: GAME_WIDTH,
                    y: 0
                }
        }
    }

    getNextRoomPlayerPosition = (direction) => {
        switch(direction) {
            case LEFT:
                return {
                    x: GAME_WIDTH - MAP_RENDER_OFFSET_X - (TILE_WIDTH * 2),
                    y: GAME_HEIGHT/2
                }
            case RIGHT:
                return {
                    x: MAP_RENDER_OFFSET_X + TILE_WIDTH,
                    y: GAME_HEIGHT/2
                }
            case UP:
                return {
                    x: GAME_WIDTH/2,
                    y: GAME_HEIGHT - MAP_RENDER_OFFSET_Y - (TILE_WIDTH * 2)
                }
            case DOWN:
                return {
                    x: GAME_WIDTH/2,
                    y: MAP_RENDER_OFFSET_Y + TILE_WIDTH
                }
        }
    }

    goToNextRoom = (player, direction) => {
        if(this.transitioning) {
            return
        }
        this.transitioning = true;

        const roomOffset = this.getNextRoomOffset(direction);
        const nextPlayerPosition = this.getNextRoomPlayerPosition(direction);

        const nextRoom = new Room(this.scene, player, roomOffset);
        nextRoom.doorways.forEach(doorway => doorway.open());

        player.setCollideWorldBounds(false);
        this.scene.tweens.add({
            targets: player,
            x: nextPlayerPosition.x + roomOffset.x + 5,
            y: nextPlayerPosition.y + roomOffset.y + 5,
            onComplete: () => {
                player.setCollideWorldBounds();
                player.setPosition(player.x - roomOffset.x, player.y - roomOffset.y);

                nextRoom.doorways.forEach(doorway => doorway.close());
            }
        });

        this.scene.cameras.main.pan(GAME_WIDTH/2 + roomOffset.x, GAME_HEIGHT/2 + roomOffset.y, 1000, 'Linear', false, (ref, progress) => {
            if(progress === 1) {
                this.transitioning = false;

                // destroy and cleanup the previous room
                this.currentRoom.cleanup();
                this.currentRoom = nextRoom;

                // reset positions to 0
                this.currentRoom.resetPosition();
                this.scene.cameras.main.centerOn(GAME_WIDTH/2,GAME_HEIGHT/2);
            }
        });
    }

    update = () => {
        this.currentRoom.update();
    }
}

export default Dungeon;