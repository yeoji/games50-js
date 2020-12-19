import BattleSprite from './BattleSprite';

export const FRONT_FACING = 'front';
export const BACK_FACING = 'back';

class Pokemon {
    constructor(attributes, level = 1) {
        this.attributes = attributes;
        this.level = level;

        this.HP = attributes.baseHP;
        this.attack = attributes.baseAttack;
        this.defense = attributes.baseDefense;
        this.speed = attributes.baseSpeed;
        
        this.calculateStats();

        this.currentHP = this.HP;
        this.currentExp = 0;
        this.expToLevel = this.level * this.level * 5 * 0.75;
    }

    calculateStats() {
        for (let i = 0; i < this.level; i++) {
            this.levelUpStats();
        }
    }

    levelUp() {
        this.level++;
        this.currentExp -= this.expToLevel;
        
        return this.levelUpStats();
    }

    /**
        Takes the IV (individual value) for each stat into consideration and rolls
        the dice 3 times to see if that number is less than or equal to the IV (capped at 5).
        The dice is capped at 6 just so no stat ever increases by 3 each time, but
        higher IVs will on average give higher stat increases per level. Returns all of
        the increases so they can be displayed in the TakeTurnState on level up.
    */
    levelUpStats() {
        let hpIncrease = 0;
        for (let i = 0; i < 3; i++) {
            if(Phaser.Math.Between(1, 6) <= this.attributes.HPIV) {
                this.HP++;
                hpIncrease++;
            }
        }

        let attackIncrease = 0;
        for (let i = 0; i < 3; i++) {
            if(Phaser.Math.Between(1, 6) <= this.attributes.attackIV) {
                this.attack++;
                attackIncrease++;
            }
        }

        let defenseIncrease = 0;
        for (let i = 0; i < 3; i++) {
            if(Phaser.Math.Between(1, 6) <= this.attributes.defenseIV) {
                this.defense++;
                defenseIncrease++;
            }
        }

        let speedIncrease = 0;
        for (let i = 0; i < 3; i++) {
            if(Phaser.Math.Between(1, 6) <= this.attributes.speedIV) {
                this.speed++;
                speedIncrease++;
            }
        }

        return [hpIncrease, attackIncrease, defenseIncrease, speedIncrease];
    }

    createBattleSprite(scene, x, y, facing = FRONT_FACING) {
        const {name} = this.attributes;

        return new BattleSprite(scene, x, y, `${name}-${facing}`.toLowerCase());
    }
}

export default Pokemon;