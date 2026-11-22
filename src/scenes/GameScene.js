import Phaser from 'phaser';
import { Player } from '../entities/Player.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const { width, height, centerX: cx, centerY: cy } = this.cameras.main;
        this.cameras.main.fadeIn(250, 14, 16, 32);

        // Fondo (mismo que menu cmbiar)
        this.add.image(cx, cy, 'fondo_partida').setDisplaySize(width, height);

        //suelo
        this.solidPlatforms = this.physics.add.staticGroup();
        const floor = this.solidPlatforms.create(cx, height - 18, 'suelo');
        floor.setDisplaySize(width, 36).refreshBody();

        //Plataformas atraviesan
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

        // Plataforma móvil 
        this.movingPlatform = this.physics.add.image(cx, 125, 'plataforma_movil');
        this.movingPlatform.setDisplaySize(160, 36);
        this.movingPlatform.body.setImmovable(true).setAllowGravity(false);
        this.movingPlatform.setVelocityX(120);

        //Spot Jugadores
        this.player1 = new Player(this, 180, height - 90, 'player1_tex', 'player1', 1);
        this.player2 = new Player(this, width - 180, height - 90, 'player2_tex', 'player2', -1);
        this.players = [this.player1, this.player2];

        // Colisiones
        this.physics.add.collider(this.players, this.solidPlatforms);
        this.physics.add.collider(this.players, this.movingPlatform, null, (player, plat) => {
            return this.canLandOnOneWay(player, plat);
        });
        this.physics.add.collider(this.players, this.oneWayPlatforms, null, (player, plat) => {
            return this.canLandOnOneWay(player, plat);
        });

        //HUD
        this.createHUD();

        //pause con Escape
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.launch('PauseScene');
            this.scene.pause();
        });
    }

    canLandOnOneWay(player, platform) {
        if (this.time.now < player.droppingUntil) return false;
        return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 14;
    }

    createHUD() {
        const { width } = this.cameras.main;

        this.p1Hearts = [];
        this.p2Hearts = [];

        // J1
        this.add.text(28, 30, 'J1', {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#0F9BD7'
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
            color: '#E94560'
        }).setOrigin(1, 0.5);

        for (let i = 0; i < 3; i++) {
            const icon = this.add.image(width - 88 - i * 40, 30, 'vida').setDisplaySize(32, 32);
            this.p2Hearts.push(icon);
        }

        this.updateHUD();
    }

    updateHUD() {
        this.p1Hearts.forEach((icon, i) => {
            icon.setAlpha(i < this.player1.lives ? 1 : 0.2);
        });

        this.p2Hearts.forEach((icon, i) => {
            icon.setAlpha(i < this.player2.lives ? 1 : 0.2);
        });
    }

    update(time) {
        const { centerX: cx } = this.cameras.main;

        //pkat movil hacemos que se mueva con rango
        if (this.movingPlatform.x >= cx + 375) {
            this.movingPlatform.setVelocityX(-120);
        } else if (this.movingPlatform.x <= cx - 375) {
            this.movingPlatform.setVelocityX(120);
        }

        this.player1.update(time);
        this.player2.update(time);
    }
}