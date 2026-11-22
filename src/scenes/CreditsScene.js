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
            'Juegos en Red · Grado en Diseño y Desarrollo de Videojuegos (URJC)',
            '',
            'EQUIPO DE DESARROLLO — GRUPO C',
            'Alejandro Del Campo  (@alejandrodcm04-27)',
            'Hugo Rivera          (@Forni8)',
            'Jesús Mañas          (@whitelyon21)',
            '',
            'RECURSOS',
            'Motor: Phaser 3 + Webpack 5',
            'Arte Pixel Art hecho con: Aseprite',
            'Audio: Recursos libres obtenidos de Pixabay',
            'Licencia del proyecto: Apache 2.0'
        ].join('\n');

        this.add.rectangle(cx, cy, 860, 440, 0x12152a, 0.9).setStrokeStyle(2, 0x0F9BD7, 0.8);
        this.add.text(cx, cy, lines, {
            fontFamily: 'Courier New, monospace',
            fontSize: '19px',
            color: '#ffffff',
            lineSpacing: 10,
            align: 'center'
        }).setOrigin(0.5);

        MenuUI.addBackButton(this);
    }
}