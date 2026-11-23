import Phaser from 'phaser';
import { MenuUI } from '../ui/MenuUI.js';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        const { centerX: cx, centerY: cy } = this.cameras.main;
        MenuUI.addBackground(this, true);
        MenuUI.addTitle(this, 'CRÉDITOS');

        const lines = [
            'ONE MORE SHOT',
            '',
            'Juegos en Red - Diseño y Desarrollo de Videojuegos (URJC)',
            '',
            'EQUIPO - GRUPO C',
            '',
            'Alejandro Del Campo  (@alejandrodcm04-27)',
            'Hugo Rivera          (@Forni8)',
            'Jesús Mañas          (@whitelyon21)',
            '',
            'RECURSOS',
            '',
            'Hecho con Phaser 3 y Webpack',
            'Arte Pixel Art hecho con Procreate, Photopea y Blender',
            'Audio: Recursos libres obtenidos de Pixabay',
            'Licencia: Apache 2.0'
        ].join('\n');

        this.add.rectangle(cx, cy, 860, 440, 0x000000, 0.75).setStrokeStyle(2, 0x0AFF00);
        this.add.text(cx, cy, lines, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        MenuUI.addBackButton(this);
    }
}