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
        this.minesLeft = 3;
        this.activeMine = null;

        //POWERUP cohete
        this.rocketsLeft = 0;

        this.moveSpeed = 300;
        this.jumpSpeed = -560;
        this.droppingUntil = 0;
        this.knockbackUntil = 0;

        //claves animacion
        this.idleKey = texture;
        this.jumpKey = playerId === 'player1' ? 'salto_1' : 'salto_2';
        this.runAnim = playerId === 'player1' ? 'p1_run' : 'p2_run';
        this.isJumping = false;
        this.jumpStartTime = 0;

        //probar valores y de base no es invulnerable
        this.lastShotTime = 0;
        this.fireCooldown = 350;
        this.invulnerable = false;

        this.setCollideWorldBounds(true);
        
        this.setDisplaySize(44, 56);
        // para girarlos sprites
        this.setFlipX(this.facing < 0);

        // Hitbox en centro del personaje
        this.body.setSize(this.width * 0.6, this.height * 0.85, true);

        //teclas base o cambiadas
        this.keys = scene.input.keyboard.addKeys(SettingsManager.controls[playerId]);
    }

    //dirección de apuntado
    getAimDirection() {
        let dirX = 0;
        let dirY = 0;

        if (this.keys.left.isDown) {
            dirX = -1;
        } else if (this.keys.right.isDown) {
            dirX = 1;
        }

        if (this.keys.jump.isDown) {
            dirY = -1;
        } else if (this.keys.down.isDown) {
            dirY = 1;
        }

        //disparan hacia donde miran si no se toca nada
        if (dirX === 0 && dirY === 0) {
            dirX = this.facing;
        }

        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        return { x: dirX / length, y: dirY / length };
    }

    //cambio de sprite
    updateAnimation() {
        if (this.isJumping) {
            this.anims.stop();
            if (this.texture.key !== this.jumpKey) {
                this.setTexture(this.jumpKey);
            }
        } else if (this.body.velocity.x !== 0) {
            this.play(this.runAnim, true);
        } else {
            this.anims.stop();
            if (this.texture.key !== this.idleKey) {
                this.setTexture(this.idleKey);
            }
        }
        this.setDisplaySize(44, 56);
    }

    update(time) {
        if (!this.active) return;

        //movimiento horizontal (no puede si knockback de explosion)
        if (time >= this.knockbackUntil) {
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
        }

        // Salto si tocamos suelo
        const onFloor = this.body.blocked.down || this.body.touching.down;

        // Al aterrizar quitamos estado de salto
        if (this.isJumping && onFloor && time > this.jumpStartTime + 100) {
            this.isJumping = false;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && onFloor) {
            this.setVelocityY(this.jumpSpeed);
            // ACTIVA LA ANIMACION DE SALTO SOLO AL SALTAR
            this.isJumping = true;
            this.jumpStartTime = time;
        }

        // bajar cuando tocamos suelo
        if (Phaser.Input.Keyboard.JustDown(this.keys.down) && onFloor) {
            this.droppingUntil = time + 220;
            this.setVelocityY(80);
        }

        //Disparar
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot) && time >= this.lastShotTime + this.fireCooldown) {
            this.lastShotTime = time;
            const dir = this.getAimDirection();
            //Si cohetes dispara cohetes sino normal
            if (this.rocketsLeft > 0) {
                this.rocketsLeft--;
                this.scene.spawnRocket(this, dir.x, dir.y);
            } else {
                this.scene.spawnBullet(this, dir.x, dir.y);
            }
        }

        // Plantar o detonar mina
        if (Phaser.Input.Keyboard.JustDown(this.keys.mine)) {
            this.scene.handleMine(this);
        }

        // Actual animaciones
        this.updateAnimation();
    }


    //recibir daño
    takeDamage() {
        if (this.invulnerable || this.lives <= 0) return false;

        this.lives--;
        this.invulnerable = true;
        this.setAlpha(0.5);

        this.scene.time.delayedCall(1000, () => {
            if (!this.active) return;
            this.invulnerable = false;
            this.setAlpha(1);
        });

        return true;
    }
}