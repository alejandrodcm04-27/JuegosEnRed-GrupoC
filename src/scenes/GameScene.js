import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { SettingsManager } from '../managers/SettingsManager.js';
import { MenuUI } from '../ui/MenuUI.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const { width, height, centerX: cx, centerY: cy } = this.cameras.main;
        this.cameras.main.fadeIn(250);
        this.matchOver = false;
        SettingsManager.playMusic(this, 'musica_partida');

        // Fondo
        this.add.image(cx, cy, 'fondo_partida').setDisplaySize(width, height);
        this.add.rectangle(cx, cy, width, height, 0x000000, 0.75);

        //suelo
        this.solidPlatforms = this.physics.add.staticGroup();
        const floor = this.solidPlatforms.create(cx, height - 18, 'suelo');
        floor.setDisplaySize(width, 36).refreshBody();

        //Plataformas
        this.oneWayPlatforms = this.physics.add.staticGroup();
        const layout = [
            { x: 240, y: 525, w: 250 },
            { x: width - 240, y: 525, w: 250 },
            { x: cx, y: 425, w: 250 },
            { x: 200, y: 325, w: 250 },
            { x: width - 200, y: 325, w: 250 },
            { x: cx, y: 225, w: 250 },
            { x: cx, y: 600, w: 250 }
        ];

        layout.forEach((p) => {
            const plat = this.oneWayPlatforms.create(p.x, p.y, 'plataforma');
            plat.setDisplaySize(p.w, 40).refreshBody();
        });

        // Plataforma movil
        this.movingPlatform = this.physics.add.image(cx, 125, 'plataforma_movil');
        this.movingPlatform.setDisplaySize(160, 36);
        this.movingPlatform.body.setImmovable(true).setAllowGravity(false);
        this.movingPlatform.setVelocityX(120);

        //Garrafas
        this.canisters = this.physics.add.group();
        const canistersLayout = [
            { x: 240, y: 485 },
            { x: width - 240, y: 485 },
            { x: cx, y: 185 },
            { x: cx, y: 560 }
        ];

        canistersLayout.forEach((c) => {
            const canister = this.canisters.create(c.x, c.y, 'garrafa');
            canister.setDisplaySize(30, 40);
            canister.body.setAllowGravity(false);
            canister.body.setImmovable(true);
        });

        //spawn jugadores
        this.player1 = new Player(this, 180, height - 90, 'jugador1', 'player1', 1);
        this.player2 = new Player(this, width - 180, height - 90, 'jugador2', 'player2', -1);
        this.players = [this.player1, this.player2];

        
        this.bullets = this.physics.add.group();
        this.mines = this.physics.add.group();

        this.rockets = this.physics.add.group();
        this.powerups = this.physics.add.group();

        //posiciones del powerip
        this.powerupSpots = [
            { x: 200, y: 230 },
            { x: width - 200, y: 230 },
            { x: cx, y: 330 },
            { x: 170, y: 430 },
            { x: width - 170, y: 430 },
            { x: width - 225, y: 50 },
            { x: 225, y: 50 }
        ];

        //uno empieza activo y luego cada 20s sale otrodw
        this.spawnPowerup();
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => this.spawnPowerup()
        });

        // Colisiones de jugadores
        this.physics.add.collider(this.players, this.solidPlatforms);
        this.physics.add.collider(this.players, this.movingPlatform, null, (player, plat) => {
            return this.canLandOnOneWay(player, plat);
        });
        this.physics.add.collider(this.players, this.oneWayPlatforms, null, (player, plat) => {
            return this.canLandOnOneWay(player, plat);
        });

        //minas con escenario
        this.physics.add.collider(this.mines, this.solidPlatforms);
        this.physics.add.collider(this.mines, this.oneWayPlatforms);
        this.physics.add.collider(this.mines, this.movingPlatform);

        //si bala choca con jugador o con minas/garrafas
        this.physics.add.overlap(this.players, this.bullets, (player, bullet) => {
            this.onBulletHitPlayer(player, bullet);
        });
        this.physics.add.overlap(this.bullets, this.canisters, (bullet, canister) => {
            if (this.matchOver) return;
            bullet.destroy();
            this.explodeCanister(canister);
        });
        this.physics.add.overlap(this.bullets, this.mines, (bullet, mine) => {
            if (this.matchOver) return;
            bullet.destroy();
            this.explodeMine(mine);
        });


        //Powerup cohete 2 balas
        this.physics.add.overlap(this.players, this.powerups, (player, powerup) => {
            if (this.matchOver) return;
            powerup.destroy();
            player.rocketsLeft = 2;
        });
        // Impacto cohetes con cosas como arriba
        this.physics.add.overlap(this.players, this.rockets, (player, rocket) => {
            if (rocket.owner === player || this.matchOver) return;
            this.explodeRocket(rocket);
        });
        this.physics.add.collider(this.rockets, this.solidPlatforms, (rocket) => {
            this.explodeRocket(rocket);
        });
        this.physics.add.overlap(this.rockets, this.canisters, (rocket, canister) => {
            if (this.matchOver) return;
            this.explodeRocket(rocket);
            this.explodeCanister(canister);
        });
        this.physics.add.overlap(this.rockets, this.mines, (rocket, mine) => {
            if (this.matchOver) return;
            this.explodeRocket(rocket);
            this.explodeMine(mine);
        });

        // HUD
        this.createHUD();

        //pausar con Escape
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.matchOver) return;
            this.scene.launch('PauseScene');
            this.scene.pause();
        });
    }

    explodeCanister(canister) {
        if (!canister.active || this.matchOver) return;
        const { x, y } = canister;
        canister.destroy();
        this.createExplosion(x, y, 140);//240 radio exp
    }

    handleMine(player) {
        if (this.matchOver) return;

        //Si tienes mina plantada la detonas
        if (player.activeMine && player.activeMine.active) {
            this.explodeMine(player.activeMine);
            return;
        }

        // Site quedan minas planta una
        if (player.minesLeft > 0) {
            player.minesLeft--;
            const mine = this.mines.create(player.x, player.y + 12, 'mina');
            mine.setDisplaySize(24, 12);
            mine.owner = player;
            mine.setCollideWorldBounds(true);

            player.activeMine = mine;
        }
    }

    explodeMine(mine) {
        if (!mine.active || this.matchOver) return;
        const { x, y, owner } = mine;

        if (owner && owner.activeMine === mine) {
            owner.activeMine = null;
        }

        mine.destroy();
        this.createExplosion(x, y, 120);//menor que garrafa
    }

    createExplosion(x, y, radius) {

        //animacion explosion y camera shake
        const exp = this.add.sprite(x, y, 'exp_1');
        exp.setScale(radius / 300);//probar 
        exp.play('explosion');
        exp.once('animationcomplete', () => exp.destroy());

        this.cameras.main.shake(180, 0.010);//probar esto a subirlo
        this.sound.play('boom', { volume: SettingsManager.sfxVolume });

        //Daño y empuje a player de explosiones
        this.players.forEach((player) => {
            const dist = Phaser.Math.Distance.Between(x, y, player.x, player.y);
            if (dist <= radius) {
                const angle = Math.atan2(player.y - y, player.x - x);
                player.knockbackUntil = this.time.now + 220;
                player.setVelocity(
                    Math.cos(angle) * 420,
                    Math.min(Math.sin(angle) * 420, -260)
                );
                this.damagePlayer(player, false);
            }
        });

        // Reaccion en cadena con otras garrafas o minas cercanas
        this.canisters.getChildren().slice().forEach((c) => {
            if (c.active && Phaser.Math.Distance.Between(x, y, c.x, c.y) <= radius) {
                this.time.delayedCall(120, () => this.explodeCanister(c));
            }
        });

        this.mines.getChildren().slice().forEach((m) => {
            if (m.active && Phaser.Math.Distance.Between(x, y, m.x, m.y) <= radius) {
                this.time.delayedCall(120, () => this.explodeMine(m));
            }
        });
    }

    //velocidad y de donde sale la bala, abajo tamaño
    spawnBullet(shooter, dirX, dirY) {
        const speed = 750;
        const bullet = this.bullets.create(
            shooter.x + dirX * 25,
            shooter.y + dirY * 25,
            'bala'
        );
        bullet.owner = shooter;
        bullet.setDisplaySize(10, 5);
        bullet.body.setAllowGravity(false);
        bullet.setVelocity(dirX * speed, dirY * speed);
        bullet.setRotation(Math.atan2(dirY, dirX)); //bala diagonal

        this.sound.play('shoot', { volume: SettingsManager.sfxVolume });
    }

    // Spawn powerup
    spawnPowerup() {
        if (this.matchOver) return;
        if (this.powerups.countActive(true) > 0) return;

        const spot = Phaser.Utils.Array.GetRandom(this.powerupSpots);
        const powerup = this.powerups.create(spot.x, spot.y, 'fotomisil');
        powerup.setDisplaySize(36, 36);
        powerup.body.setAllowGravity(false);
    }

    // disparo cohete
    spawnRocket(shooter, dirX, dirY) {
        const speed = 1000;
        const rocket = this.rockets.create(
            shooter.x + dirX * 20,
            shooter.y + dirY * 20,
            'misil'
        );
        rocket.owner = shooter;
        rocket.setDisplaySize(32, 16);
        rocket.body.setAllowGravity(false);
        rocket.setVelocity(dirX * speed, dirY * speed);
        rocket.setRotation(Math.atan2(dirY, dirX));

        this.sound.play('shoot', { volume: SettingsManager.sfxVolume });
    }

    //explosion y poder cambiar radio
    explodeRocket(rocket) {
        if (!rocket.active || this.matchOver) return;
        const { x, y } = rocket;
        rocket.destroy();
        this.createExplosion(x, y, 150);
    }

    //destruir bala al dar a player
    onBulletHitPlayer(player, bullet) {
        if (bullet.owner === player || this.matchOver) return;
        bullet.destroy();
        this.damagePlayer(player, true);
    }

    //hacer daño y si vidas 0 sacar menu
    damagePlayer(player, playHitSound = true) {
        if (this.matchOver) return;

        if (player.takeDamage()) {
            if (playHitSound) {
                this.sound.play('hit', { volume: SettingsManager.sfxVolume });
            }
            this.updateHUD();

            if (player.lives <= 0) {
                const winner = player === this.player1 ? 'JUGADOR 2' : 'JUGADOR 1';
                this.endMatch(winner);
            }
        }
    }

    canLandOnOneWay(player, platform) {
        if (this.time.now < player.droppingUntil) return false;
        return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 10;
    }

    //menu al acabar partida
    endMatch(winner) {
        this.matchOver = true;
        this.physics.pause();
        SettingsManager.playMusic(this, 'musica_fin');

        const { width, height, centerX: cx, centerY: cy } = this.cameras.main;

        this.add.rectangle(cx, cy, width, height, 0x000000, 0.75);
        this.add.rectangle(cx, cy, 450, 300, 0x000000, 0.75).setStrokeStyle(2, 0x0AFF00);

        this.add.text(cx, cy - 80, `¡GANA ${winner}!`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '38px',
            fontStyle: 'bold',
            color: '#0AFF00'
        }).setOrigin(0.5);

        MenuUI.addButton(this, cx, cy, 'REVANCHA', '#9F00F7', () => {
            this.scene.restart();
        }, 300, 48);

        MenuUI.addButton(this, cx, cy + 70, 'VOLVER AL MENÚ', '#FF0000', () => {
            MenuUI.transitionTo(this, 'MenuScene');
        }, 300, 48);
    }

    //hud co nvidas
    createHUD() {
        const { width } = this.cameras.main;

        this.p1Hearts = [];
        this.p2Hearts = [];

        //J1
        this.add.text(28, 30, 'J1', {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#9F00F7'
        }).setOrigin(0, 0.5);

        for (let i = 0; i < 3; i++) {
            const icon = this.add.image(88 + i * 40, 30, 'vida').setDisplaySize(32, 32);
            this.p1Hearts.push(icon);
        }

        // J2
        this.add.text(width - 28, 30, 'J2', {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#FF0000'
        }).setOrigin(1, 0.5);

        for (let i = 0; i < 3; i++) {
            const icon = this.add.image(width - 88 - i * 40, 30, 'vida').setDisplaySize(32, 32);
            this.p2Hearts.push(icon);
        }

        this.updateHUD();
    }

    //actualizar vidas, el 02 es el aplfa de la vida cuando la pierde
    updateHUD() {
        this.p1Hearts.forEach((icon, i) => {
            icon.setAlpha(i < this.player1.lives ? 1 : 0.2);
        });

        this.p2Hearts.forEach((icon, i) => {
            icon.setAlpha(i < this.player2.lives ? 1 : 0.2);
        });
    }

    update(time) {
        if (this.matchOver) return;

        const { width, height, centerX: cx } = this.cameras.main;

        // Plat movil hacemos que se mueva con rango
        if (this.movingPlatform.x >= cx + 375) {
            this.movingPlatform.setVelocityX(-120);
        } else if (this.movingPlatform.x <= cx - 375) {
            this.movingPlatform.setVelocityX(120);
        }

        this.player1.update(time);
        this.player2.update(time);
    }
}