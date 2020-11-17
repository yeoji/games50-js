import Phaser from 'phaser';

const GROUND = 2;
const SKY = 4;

const generateMap = (mapWidth, mapHeight) => {
    let tiles = [];
    let chasmCounter = 0;

    for (let col = 0; col < mapWidth; col++) {
        tiles[col] = [];

        // random 10% chance to spawn a chasm (chasm has to be 2 blocks wide)
        const spawnChasm = col > 2 && Phaser.Math.Between(1, 10) === 1;
        if(spawnChasm || chasmCounter === 1) {
            chasmCounter++;

            if(chasmCounter === 2) {
                chasmCounter = 0;
            }
            continue
        }

        // random 10% chance to spawn a pillar
        const spawnPillar = col > 2 && Phaser.Math.Between(1, 10) === 1;

        for (let row = 0; row < mapHeight; row++) {
            const skyHeight = spawnPillar ? 5 : 7;

            if(row < skyHeight) {
                tiles[col][row] = [{
                    id: SKY,
                    texture: 'tileset'
                }];

                if(row === (skyHeight - 1)) {
                    // random 10% chance to spawn decorative bush
                    const spawnBush = Phaser.Math.Between(1, 10) === 1;
                    if(spawnBush) {
                        tiles[col][row] = [{
                            id: Phaser.Math.Between(0, 34),
                            texture: 'bushes'
                        }];
                    }
                }
            } else {
                tiles[col][row] = [{
                    id: GROUND,
                    texture: 'tileset'
                }];
            
                if (row === skyHeight) {
                    tiles[col][row].push({
                        id: GROUND,
                        texture: 'topperset'
                    });
                } 
            }
        }
    }
    return tiles;
}

export {
    generateMap
}