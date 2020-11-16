import Phaser from 'phaser';

const GROUND = 2;
const SKY = 4;

const generateLevel = (mapWidth, mapHeight) => {
    let tiles = [];

    for (let col = 0; col < mapWidth; col++) {
        tiles[col] = [];

        // random 10% chance to spawn a chasm
        const spawnChasm = Phaser.Math.Between(1, 10) === 1;
        if(spawnChasm) {
            continue
        }

        // random 10% chance to spawn a pillar
        const spawnPillar = Phaser.Math.Between(1, 10) === 1;

        for (let row = 0; row < mapHeight; row++) {
            const skyHeight = spawnPillar ? 5 : 7;

            if(row < skyHeight) {
                tiles[col][row] = {
                    id: SKY,
                    hasTopper: false
                };
            } else {
                tiles[col][row] = {
                    id: GROUND,
                    hasTopper: false
                };
            
                if (row === skyHeight) {
                    tiles[col][row].hasTopper = true;
                } 
            }
        }
    }
    return tiles;
}

export {
    generateLevel
}