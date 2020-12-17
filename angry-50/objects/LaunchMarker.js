import Phaser from 'phaser';
import Alien, {CIRCLE_ALIEN} from './Alien';

class LaunchMarker extends Phaser.GameObjects.Zone {
    constructor(scene) {
        super(scene, 90, scene.game.config.height - 100);

        this.baseX = this.x;
        this.baseY = this.y;

        this.shiftedX = this.baseX;
        this.shiftedY = this.baseY;

        this.trajectory = [];

        this.launched = false;

        this.alien = new Alien(scene, this.x, this.y, CIRCLE_ALIEN);
        this.alien.setStatic(true);

        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => { 
            if(!this.launched) {
                this.aiming = true 
            }
        });
        this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handleAiming, this)
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.launchAlien, this)
    }

    update() {
        if(this.launched) {
            return;
        }

        this.alien.setPosition(this.shiftedX, this.shiftedY);
    }

    resetLaunchMarker() {
        this.launched = false;
        this.alien.destroy();

        this.alien = new Alien(this.scene, this.x, this.y, CIRCLE_ALIEN);
        this.alien.setStatic(true);
    }

    handleAiming(pointer) {
        if(!this.aiming) {
            return
        }
        this.removeTrajectory();

        this.shiftedX = Math.min(this.baseX + 30, Math.max(pointer.x, this.baseX - 30));
        this.shiftedY = Math.min(this.baseY + 30, Math.max(pointer.y, this.baseY - 30));

        const impulseX = (this.baseX - this.shiftedX) * 10;
        const impulseY = (this.baseY - this.shiftedY) * 10;

        const gravY = 300;

        // http://www.iforce2d.net/b2dtut/projected-trajectory
        for (let i = 1; i <= 90; i++) {
            const tick = 1/this.scene.game.loop.actualFps;

            const trajX = this.shiftedX + i * tick * impulseX;
            const trajY = this.shiftedY + i * tick * impulseY + 0.5 * (i * i + i) * gravY * tick * tick;

            if (i % 5 === 0) {
                this.trajectory.push(this.scene.add.circle(trajX, trajY, 3, 0xff50ff, ((255 / 12) * i)/255));
            }
        }
    }

    launchAlien() {
        if(!this.aiming) {
            return;
        }

        this.aiming = false;
        this.launched = true;

        this.removeTrajectory();

        this.alien.setStatic(false);
        this.alien.setVelocity((this.baseX - this.shiftedX) / 2.8, (this.baseY - this.shiftedY) / 2.8);
    }

    removeTrajectory() {
        this.trajectory.forEach(traj => traj.destroy());
    }
}

export default LaunchMarker;