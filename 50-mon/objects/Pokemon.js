export const FRONT_FACING = 'front';
export const BACK_FACING = 'back';

class Pokemon {
    constructor(attributes, level = 1) {
        this.attributes = attributes;
        this.level = level;
    }

    createBattleSprite(scene, x, y, facing = FRONT_FACING) {
        const {name} = this.attributes;

        return scene.add.sprite(x, y, 'pokemon', `${name}-${facing}`.toLowerCase());
    }
}

export default Pokemon;