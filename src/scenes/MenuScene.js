import Phaser from 'phaser';
import { MenuUI } from '../ui/MenuUI.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { centerX: cx, centerY: cy } = this.cameras.main;
        MenuUI.addBackground(this);

        if (this.textures.exists('logo') && this.textures.get('logo').key !== '__MISSING') {
            const logo = this.add.image(cx, cy - 190, 'logo');
            const scale = Math.min(480 / logo.width, 190 / logo.height);
            logo.setScale(scale);
        } else {
            this.add.text(cx, cy - 190, 'ONE MORE SHOT', {
                fontFamily: 'Courier New, monospace',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#0F9BD7',
                stroke: '#E94560',
                strokeThickness: 5
            }).setOrigin(0.5);
        }

        const buttons = [
            { label: 'JUGAR (LOCAL 2P)', scene: 'GameScene', color: '#0F9BD7' },
            { label: 'JUGAR ONLINE', disabled: true },
            { label: 'AJUSTES', scene: 'SettingsScene', color: '#ffffff' },
            { label: 'AYUDA / CONTROLES', scene: 'HelpScene', color: '#ffffff' },
            { label: 'CRÉDITOS', scene: 'CreditsScene', color: '#ffffff' }
        ];

        buttons.forEach((btn, idx) => {
            MenuUI.addButton(
                this,
                cx,
                cy - 20 + idx * 64,
                btn.label,
                btn.color || '#6c759c',
                () => MenuUI.transitionTo(this, btn.scene),
                340,
                48,
                Boolean(btn.disabled)
            );
        });
    }
}