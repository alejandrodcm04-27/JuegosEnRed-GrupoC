import Phaser from 'phaser';
import { MenuUI } from '../ui/MenuUI.js';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        const { width, height, centerX: cx, centerY: cy } = this.cameras.main;

        this.add.rectangle(cx, cy, width, height, 0x000000, 0.75);
        this.add.rectangle(cx, cy, 440, 290, 0x000000, 0.75).setStrokeStyle(2, 0xffffff);

        this.add.text(cx, cy - 90, 'PAUSA', {
            fontFamily: 'Courier New, monospace',
            fontSize: '40px',
            fontStyle: 'bold',
            color: '#0AFF00'
        }).setOrigin(0.5);

        MenuUI.addButton(this, cx, cy - 10, 'CONTINUAR', '#9F00F7', () => {
            this.resumeGame();
        }, 300, 48);

        MenuUI.addButton(this, cx, cy + 60, 'VOLVER AL MENÚ', '#FF0000', () => {
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