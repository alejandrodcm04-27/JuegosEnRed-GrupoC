import Phaser from 'phaser';
import { MenuUI } from '../ui/MenuUI.js';
import { SettingsManager } from '../managers/SettingsManager.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { centerX: cx, centerY: cy } = this.cameras.main;
        SettingsManager.playMusic(this, 'musica_menu');
        MenuUI.addBackground(this);

        const logo = this.add.image(cx, cy - 190, 'logo');
        const scale = Math.min(480 / logo.width, 300 / logo.height);
        logo.setScale(scale);
        

        const buttons = [
            { label: 'JUGAR (LOCAL 2P)', scene: 'GameScene', color: '#ffffff' },
            { label: 'ONLINE', disabled: true },
            { label: 'AJUSTES', scene: 'SettingsScene', color: '#ffffff' },
            { label: 'AYUDA / CONTROLES', scene: 'HelpScene', color: '#ffffff' },
            { label: 'CRÉDITOS', scene: 'CreditsScene', color: '#ffffff' }
        ];

        buttons.forEach((btn, idx) => {
            MenuUI.addButton(
                this,
                cx,
                cy - 25 + idx * 70,
                btn.label,
                btn.color || '#00000',
                () => MenuUI.transitionTo(this, btn.scene),
                340,
                48,
                Boolean(btn.disabled)
            );
        });
    }
}