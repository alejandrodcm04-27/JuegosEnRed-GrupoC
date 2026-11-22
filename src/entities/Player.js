import Phaser from 'phaser';
import { SettingsManager } from '../managers/SettingsManager.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, playerId, facing = 1) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.playerId = playerId;
        this.facing = facing;
        this.lives = 3;
        this.moveSpeed = 300;
        this.jumpSpeed = -560;
        this.droppingUntil = 0;

        this.setCollideWorldBounds(true);
        this.setScale(1.4);
        this.setFlipX(facing < 0);

        //teclas de ajustes o base
        this.keys = scene.input.keyboard.addKeys(SettingsManager.controls[playerId]);
    }

    update(time) {
        if (!this.active) return;

        //mov horizontal
        if (this.keys.left.isDown) {
            this.setVelocityX(-this.moveSpeed);
            this.facing = -1;
            this.setFlipX(true);
        } else if (this.keys.right.isDown) {
            this.setVelocityX(this.moveSpeed);
            this.facing = 1;
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        //salto si tocamos suelo
        const onFloor = this.body.blocked.down || this.body.touching.down;
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && onFloor) {
            this.setVelocityY(this.jumpSpeed);
        }

        //bajar
        if (Phaser.Input.Keyboard.JustDown(this.keys.down) && onFloor) {
            this.droppingUntil = time + 220;
            this.setVelocityY(80);
        }
    }
}