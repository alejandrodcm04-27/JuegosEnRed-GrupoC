import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        

        //
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('fondo', 'assets/images/fondo.png');
        this.load.image('vida', 'assets/images/vida.png');
        this.load.image('suelo', 'assets/images/suelo.png');
        this.load.image('plataforma', 'assets/images/plataforma.png');
        this.load.image('plataforma_movil', 'assets/images/plataforma_movil.png');

        
        this.load.audio('hit', 'assets/audio/hit.mp3');
        this.load.audio('music', 'assets/audio/music.mp3');
    }

    create() {
        this.createPlaceholderTextures();
        this.scene.start('MenuScene');
    }

    createPlaceholderTextures() {
        //J1
        this.makeRectTexture('player1_tex', 24, 36, 0x0F9BD7, 0xffffff);
        //j2
        this.makeRectTexture('player2_tex', 24, 36, 0xE94560, 0xffffff);
        //Plataforma
        this.makeRectTexture('platform_tex', 160, 18, 0x2d3561, 0x0F9BD7);
        // Plataforma movil
        this.makeRectTexture('moving_platform_tex', 120, 16, 0x3b2c5c, 0xF5C518);
        // Bala normal
        this.makeRectTexture('bullet_tex', 10, 4, 0xF5C518);
        // Cohete
        this.makeRectTexture('rocket_tex', 16, 8, 0xFF5733, 0xffffff);
        // Garrafa de gasolina
        this.makeRectTexture('canister_tex', 22, 30, 0xFF5733, 0xF5C518);
        // Mina
        this.makeRectTexture('mine_tex', 14, 8, 0xE94560, 0xffffff);
        // Power-up
        this.makeRectTexture('powerup_tex', 20, 20, 0xF5C518, 0xffffff);
    }

    makeRectTexture(key, w, h, fillColor, borderColor = null) {
        if (this.textures.exists(key)) return;
        const g = this.add.graphics();
        g.fillStyle(fillColor, 1);
        g.fillRect(0, 0, w, h);
        if (borderColor !== null) {
            g.lineStyle(2, borderColor, 1);
            g.strokeRect(1, 1, w - 2, h - 2);
        }
        g.generateTexture(key, w, h);
        g.destroy();
    }
}