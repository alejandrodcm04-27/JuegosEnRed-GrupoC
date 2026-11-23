import Phaser from 'phaser';
import { SettingsManager } from '../managers/SettingsManager.js';
import { MenuUI } from '../ui/MenuUI.js';

export class HelpScene extends Phaser.Scene {
    constructor() {
        super('HelpScene');
    }

    create() {
        const { centerX: cx, centerY: cy } = this.cameras.main;
        MenuUI.addBackground(this, true);
        MenuUI.addTitle(this, 'AYUDA Y CONTROLES');

        this.add.text(cx, cy - 230, 'OBJETIVO: Tenéis 3 vidas. Usa armas, garrafas explosivas,\nminas y potenciadores para derrotar a tu enemigo.', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const p1 = SettingsManager.controls.player1;
        const p2 = SettingsManager.controls.player2;
        const k = (code) => SettingsManager.getKeyName(code);

        const p1Lines = [
            'NULL SOUND',
            `Moverse: ${k(p1.left)} / ${k(p1.right)}`,
            `Saltar: ${k(p1.jump)}   |   Bajar: ${k(p1.down)}`,
            `Disparar: ${k(p1.shoot)}   |   Mina: ${k(p1.mine)}`
        ].join('\n');

        const p2Lines = [
            'EDGE RIOT',
            `Moverse: ${k(p2.left)} / ${k(p2.right)}`,
            `Saltar: ${k(p2.jump)}   |   Bajar: ${k(p2.down)}`,
            `Disparar: ${k(p2.shoot)}   |   Mina: ${k(p2.mine)}`
        ].join('\n');

        this.add.rectangle(cx - 250, cy - 100, 460, 150, 0x000000, 0.75).setStrokeStyle(2, 0x9F00F7);
        this.add.text(cx - 250, cy - 100, p1Lines, {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#ffffff',
            lineSpacing: 10,
            align: 'center'
        }).setOrigin(0.5);

        this.add.rectangle(cx + 250, cy - 100, 460, 150, 0x000000, 0.75).setStrokeStyle(2, 0xFF0000);
        this.add.text(cx + 250, cy - 100, p2Lines, {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#ffffff',
            lineSpacing: 10,
            align: 'center'
        }).setOrigin(0.5);

        const mechanics = [
            'MECÁNICAS Y POTENCIADORES:',
            'GARRAFAS: explotan al dispararles, tened cuidado!',
            'MINAS (tenéis 3): pulsa la tecla de mina para plantar y hacerla explotar.',
            'POTENCIADORES: por hacer...',
            'PAUSA: pulsa ESC durante la partida.'
        ].join('\n');

        this.add.rectangle(cx, cy + 120, 960, 200, 0x00000, 0.75).setStrokeStyle(2, 0x0AFF00);
        this.add.text(cx, cy + 120, mechanics, {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#ffffff',
            lineSpacing: 10
        }).setOrigin(0.5);

        MenuUI.addBackButton(this);
    }
}