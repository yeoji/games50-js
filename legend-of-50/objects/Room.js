import Phaser from 'phaser';
import {
    MAP_WIDTH, MAP_HEIGHT, 
    TILE_TOP_LEFT_CORNER, TILE_BOTTOM_LEFT_CORNER, TILE_TOP_RIGHT_CORNER, TILE_BOTTOM_RIGHT_CORNER, 
    TILE_WIDTH, TILE_HEIGHT, MAP_RENDER_OFFSET_X, MAP_RENDER_OFFSET_Y, 
    TILE_LEFT_WALLS, TILE_RIGHT_WALLS, TILE_TOP_WALLS, TILE_BOTTOM_WALLS, TILE_FLOORS, LEFT, RIGHT, UP, DOWN, PLAYER_PADDING, GAME_WIDTH, GAME_HEIGHT
} from '../constants';
import Doorway from './Doorway';
import Enemy from './enemies/Enemy';
import Pot from './Pot';
import Switch from './Switch';

class Room extends Phaser.GameObjects.Container {
    constructor(scene, player, roomOffset = {x: 0, y: 0}) {
        super(scene);

        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;

        this.roomOffset = roomOffset;

        this.generateFloorAndWalls();
        this.createDoorways();
        this.generateEnemies();

        this.switch = new Switch(scene, roomOffset);
        this.generatePots();

        this.player = player;
        this.setupPlayer();

        this.scene.physics.add.collider(this.enemies, this.pots, (enemy, pot) => {
            if(pot.thrown) {
                enemy.damage(1);
                pot.destroy();
            } else {
                enemy.bumpedIntoThings();
            }
        });

        this.droppedHearts = [];

        this.scene.physics.world.setBounds(MAP_RENDER_OFFSET_X + TILE_WIDTH + roomOffset.x, MAP_RENDER_OFFSET_Y + roomOffset.y, GAME_WIDTH - (MAP_RENDER_OFFSET_X + (TILE_WIDTH * 3)), GAME_HEIGHT - MAP_RENDER_OFFSET_Y - (TILE_HEIGHT * 2));
    }

    generateFloorAndWalls = () => {
        this.tiles = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const xLoc = x * TILE_WIDTH + MAP_RENDER_OFFSET_X + this.roomOffset.x;
                const yLoc = y * TILE_HEIGHT + MAP_RENDER_OFFSET_Y + this.roomOffset.y;

                // do the room corners
                if(x === 0 && y === 0) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_TOP_LEFT_CORNER).setOrigin(0,0));
                    continue;
                } else if(x === 0 && y === this.height - 1) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_BOTTOM_LEFT_CORNER).setOrigin(0,0));
                    continue;
                } else if(x === this.width - 1 && y === 0) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_TOP_RIGHT_CORNER).setOrigin(0,0));
                    continue;
                } else if(x === this.width - 1 && y === this.height - 1) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_BOTTOM_RIGHT_CORNER).setOrigin(0,0));
                    continue;
                }

                // do the walls
                if (x === 0) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_LEFT_WALLS[Phaser.Math.Between(0, TILE_LEFT_WALLS.length - 1)]).setOrigin(0,0));
                    continue
                } else if(x === this.width - 1) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_RIGHT_WALLS[Phaser.Math.Between(0, TILE_RIGHT_WALLS.length - 1)]).setOrigin(0,0));
                    continue
                } else if(y === 0) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_TOP_WALLS[Phaser.Math.Between(0, TILE_TOP_WALLS.length - 1)]).setOrigin(0,0));
                    continue
                } else if(y === this.height - 1) {
                    this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_BOTTOM_WALLS[Phaser.Math.Between(0, TILE_BOTTOM_WALLS.length - 1)]).setOrigin(0,0));
                    continue
                }

                // do the floor
                this.tiles.push(this.scene.add.sprite(xLoc, yLoc, "tiles", TILE_FLOORS[Phaser.Math.Between(0, TILE_FLOORS.length - 1)]).setOrigin(0,0));
            }
        }
    }
    
    createDoorways = () => {
        this.doorways = [
            new Doorway(this.scene, LEFT, this.roomOffset),
            new Doorway(this.scene, RIGHT, this.roomOffset),
            new Doorway(this.scene, UP, this.roomOffset),
            new Doorway(this.scene, DOWN, this.roomOffset),
        ]
    }

    generateEnemies = () => {
        const numEnemies = Phaser.Math.Between(2, 10);

        this.enemies = [];
        for (let i = 0; i < numEnemies; i++) {
            const enemyX = Phaser.Math.Between(MAP_RENDER_OFFSET_X + TILE_WIDTH, GAME_WIDTH - MAP_RENDER_OFFSET_X - TILE_WIDTH);
            const enemyY = Phaser.Math.Between(MAP_RENDER_OFFSET_Y + TILE_HEIGHT, GAME_HEIGHT - MAP_RENDER_OFFSET_Y - TILE_HEIGHT);

            this.enemies.push(new Enemy(this.scene, enemyX + this.roomOffset.x, enemyY + this.roomOffset.y));
        }
    }

    generatePots = () => {
        const potsToGenerate = Phaser.Math.Between(0, 3);

        this.pots = [];
        for (let i = 0; i < potsToGenerate; i++) {
            this.pots.push(new Pot(this.scene, this.roomOffset));
        }
    }

    setupPlayer = () => {
        this.player.setDepth(this.depth + 1); //brings the player to the front

        this.scene.physics.add.overlap(this.player, this.switch, (player, switchObj) => {
            const playerFeet = {
                x: player.body.x + player.body.halfWidth, 
                y: player.body.y + player.body.height - PLAYER_PADDING
            };

            if(Phaser.Geom.Rectangle.Contains(switchObj.getBounds(), playerFeet.x, playerFeet.y)) {
                switchObj.activate();

                this.doorways.forEach(doorway => doorway.open());
                this.scene.sound.play('door');
            }
        }, (player, switchObj) =>  !switchObj.activated, this);

        this.scene.physics.add.collider(this.player, this.pots, null, (player, pot) => {
            return !pot.thrown;
        });
    }

    update = () => {
        this.enemies.forEach(enemy => {
            if(this.player.hitbox && Phaser.Geom.Rectangle.Overlaps(this.player.hitbox, enemy.getBounds())) {
                enemy.damage(this.player.attributes.damage);
            } else if(Phaser.Geom.Rectangle.Overlaps(this.player.getHurtbox(), enemy.getBounds())) {
                this.player.damage(enemy.attributes.damage);
            }
        });

        this.droppedHearts = [...this.droppedHearts.filter(heart => heart.active), ...this.enemies.map(enemy => enemy.droppedHeart).filter(heart => heart)];
        this.enemies = this.enemies.filter(enemy => enemy.attributes.health > 0);

        this.droppedHearts.forEach(heart => {
            if(Phaser.Geom.Rectangle.Overlaps(this.player.getHurtbox(), heart.getBounds())) {
                this.player.heal(2);
                this.scene.sound.play('heart');
                heart.destroy();
            }
        });

        this.pots.forEach(pot => {
            if(Phaser.Geom.Rectangle.Overlaps(this.player.getBounds(), pot.getBounds())) {
                const pickUpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
                if(Phaser.Input.Keyboard.JustDown(pickUpKey)) {
                    this.player.pickUp(pot);
                }
            }
        })
    }

    resetPosition = () => {
        this.scene.physics.world.setBounds(MAP_RENDER_OFFSET_X + TILE_WIDTH, MAP_RENDER_OFFSET_Y, GAME_WIDTH - (MAP_RENDER_OFFSET_X + (TILE_WIDTH * 3)), GAME_HEIGHT - MAP_RENDER_OFFSET_Y - (TILE_HEIGHT * 2));

        this.tiles.forEach(tile => tile.setPosition(tile.x - this.roomOffset.x, tile.y - this.roomOffset.y));
        this.enemies.forEach(enemy => enemy.setPosition(enemy.x - this.roomOffset.x, enemy.y - this.roomOffset.y));
        this.doorways.forEach(doorway => doorway.resetPosition());
        this.switch.setPosition(this.switch.x - this.roomOffset.x, this.switch.y - this.roomOffset.y);
        this.pots.forEach(pot => pot.setPosition(pot.x - this.roomOffset.x, pot.y - this.roomOffset.y))
    }

    cleanup = () => {
        this.tiles.forEach(tile => tile.destroy());
        this.doorways.forEach(doorway => doorway.destroy());
        this.enemies.forEach(enemy => enemy.die());
        this.switch.destroy();
    }
}

export default Room;