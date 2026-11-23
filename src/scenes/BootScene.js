import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {

        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('fondo', 'assets/images/fondo.png');
        this.load.image('fondo_partida', 'assets/images/fondo_partida.png');
        this.load.image('vida', 'assets/images/vida.PNG');
        this.load.image('suelo', 'assets/images/suelo.png');
        this.load.image('plataforma', 'assets/images/plataforma.png');
        this.load.image('plataforma_movil', 'assets/images/plataforma_movil.png');

        this.load.image('jugador1', 'assets/images/jugador1.PNG');
        this.load.image('jugador2', 'assets/images/jugador2.PNG');

        this.load.image('salto_1', 'assets/images/animaciones/salto_1.png');
        this.load.image('salto_2', 'assets/images/animaciones/salto_2.PNG');
        for (let i = 1; i <= 4; i++) {
            this.load.image(`p1_run_${i}`, `assets/images/animaciones/${i}.png`);
            this.load.image(`p2_run_${i}`, `assets/images/animaciones/${i} (1).png`);
        }


        this.load.image('bala', 'assets/images/bala.PNG');
        this.load.image('garrafa', 'assets/images/garrafa.png');
        this.load.image('mina', 'assets/images/mina.PNG');

        this.load.image('misil', 'assets/images/Misil.PNG');
        this.load.image('fotomisil', 'assets/images/powerup_misil.PNG');

        //exexplosion
        for (let i = 1; i <= 16; i++) {
            this.load.image(`exp_${i}`, `assets/images/explosion/ExplisionPixelArt (${i}).png`);
        }

        //sonidos
        this.load.audio('hit', 'assets/audio/hit.mp3');
        this.load.audio('shoot', 'assets/audio/shoot.wav');
        this.load.audio('boom', 'assets/audio/boom.wav');
        this.load.audio('musica_menu', 'assets/audio/musica_menu.mp3');
        this.load.audio('musica_partida', 'assets/audio/musica_partida.mp3');
        this.load.audio('musica_fin', 'assets/audio/musica_fin.mp3');
    }

    create() {
        const frames = [];
        for (let i = 1; i <= 16; i++) {
            frames.push({ key: `exp_${i}` });
        }

        this.anims.create({
            key: 'explosion',
            frames: frames,
            frameRate: 24,
            repeat: 0
        });

        this.scene.start('MenuScene');

        this.anims.create({
            key: 'p1_run',
            frames: [
                { key: 'p1_run_1' },
                { key: 'p1_run_2' },
                { key: 'p1_run_3' },
                { key: 'p1_run_4' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2_run',
            frames: [
                { key: 'p2_run_1' },
                { key: 'p2_run_2' },
                { key: 'p2_run_3' },
                { key: 'p2_run_4' }
            ],
            frameRate: 10,
            repeat: -1
        });
    }

    
}