import Phaser from 'phaser';
import { MenuUI } from '../ui/MenuUI.js';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        const { width, height, centerX: cx, centerY: cy } = this.cameras.main;

        this.add.rectangle(cx, cy, width, height, 0x000000, 0.65);
        this.add.rectangle(cx, cy, 440, 290, 0x12152a, 0.95).setStrokeStyle(2, 0x0F9BD7);

        this.add.text(cx, cy - 88, 'PAUSA', {
            fontFamily: 'Courier New, monospace',
            fontSize: '40px',
            fontStyle: 'bold',
            color: '#F5C518'
        }).setOrigin(0.5);

        MenuUI.addButton(this, cx, cy - 10, 'CONTINUAR', '#0F9BD7', () => {
            this.resumeGame();
        }, 300, 48);

        MenuUI.addButton(this, cx, cy + 62, 'VOLVER AL MENÚ', '#E94560', () => {
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        }, 300, 48);

        this.input.keyboard.once('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }
}