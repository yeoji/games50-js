import Phaser from 'phaser';

const BACKGROUNDS = [
    "blue_desert",
    "blue_grass",
    "blue_land",
    "blue_shroom",
    "colored_desert",
    "colored_grass",
    "colored_land",
    "colored_shroom"
]

const BACKGROUND_WIDTH = 512;

export const loadBackgrounds = (scene) => {
    BACKGROUNDS.forEach(bg => {
        scene.load.image(bg, `assets/graphics/backgrounds/${bg}.png`);
    });
}

export const renderBackground = (scene) => {
    const bg = Phaser.Math.RND.pick(BACKGROUNDS);
    scene.add.image(0,-128,bg).setOrigin(0,0);
    scene.add.image(BACKGROUND_WIDTH,-128,bg).setOrigin(0,0);
}