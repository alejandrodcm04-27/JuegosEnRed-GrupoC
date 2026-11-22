import Phaser from 'phaser';
import { SettingsManager } from '../managers/SettingsManager.js';
import { MenuUI } from '../ui/MenuUI.js';

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
        this.listeningFor = null;
    }

    create() {
        const { centerX: cx, centerY: cy, height } = this.cameras.main;
        MenuUI.addBackground(this, true);
        MenuUI.addTitle(this, 'AJUSTES');

        // --- VOLUMEN ---
        this.volumeTexts = {};
        this.createVolumeControl(cx, cy - 220, 'Volumen Música', 'musicVolume');
        this.createVolumeControl(cx, cy - 170, 'Volumen Efectos', 'sfxVolume');

        // --- CONTROLES ---
        const actions = [
            { key: 'left', label: 'Izquierda' },
            { key: 'right', label: 'Derecha' },
            { key: 'jump', label: 'Saltar' },
            { key: 'down', label: 'Bajar plat.' },
            { key: 'shoot', label: 'Disparar' },
            { key: 'mine', label: 'Mina' }
        ];

        this.keyButtons = [];
        this.createPlayerKeyColumn(cx - 270, cy - 100, 'JUGADOR 1', '#0F9BD7', 'player1', actions);
        this.createPlayerKeyColumn(cx + 270, cy - 100, 'JUGADOR 2', '#E94560', 'player2', actions);

        this.input.keyboard.on('keydown', (event) => {
            if (!this.listeningFor) return;

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
                this.cancelListening();
                return;
            }

            const { playerId, actionKey, labelObj } = this.listeningFor;
            SettingsManager.controls[playerId][actionKey] = event.keyCode;
            labelObj.setText(`[ ${SettingsManager.getKeyName(event.keyCode)} ]`);
            labelObj.setColor('#ffffff');
            this.listeningFor = null;
        });

        // --- BOTONES INFERIORES ---
        const resetBtn = this.add.text(cx - 210, height - 52, '[ RESTABLECER POR DEFECTO ]', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#E94560'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', () => resetBtn.setColor('#F5C518'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#E94560'));
        resetBtn.on('pointerdown', () => this.resetAllSettings());

        const backBtn = MenuUI.addBackButton(this, 'MenuScene', 210);
        backBtn.on('pointerdown', () => {
            this.listeningFor = null;
        });
    }

    createVolumeControl(cx, y, label, prop) {
        this.add.text(cx - 230, y, label, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        const valueText = this.add.text(cx + 110, y, `${Math.round(SettingsManager[prop] * 100)}%`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#F5C518'
        }).setOrigin(0.5);

        this.volumeTexts[prop] = valueText;

        const updateVol = (delta) => {
            const next = Phaser.Math.Clamp(Math.round((SettingsManager[prop] + delta) * 10) / 10, 0, 1);
            SettingsManager[prop] = next;
            valueText.setText(`${Math.round(next * 100)}%`);
            if (prop === 'musicVolume') this.applyMusicVolume(next);
        };

        this.createSmallBtn(cx + 35, y, '-', () => updateVol(-0.1));
        this.createSmallBtn(cx + 185, y, '+', () => updateVol(0.1));
    }

    applyMusicVolume(volume) {
        this.sound.sounds.forEach((s) => {
            if (s.loop) s.setVolume(volume);
        });
    }

    createSmallBtn(x, y, text, onClick) {
        const btn = this.add.text(x, y, `[ ${text} ]`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#0F9BD7'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#F5C518'));
        btn.on('pointerout', () => btn.setColor('#0F9BD7'));
        btn.on('pointerdown', onClick);
    }

    createPlayerKeyColumn(x, startY, title, color, playerId, actions) {
        this.add.text(x, startY, title, {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            color
        }).setOrigin(0.5);

        actions.forEach((act, idx) => {
            const rowY = startY + 46 + idx * 42;

            this.add.text(x - 190, rowY, act.label, {
                fontFamily: 'Courier New, monospace',
                fontSize: '18px',
                color: '#d8def7'
            }).setOrigin(0, 0.5);

            const keyCode = SettingsManager.controls[playerId][act.key];
            const keyBtn = this.add.text(x + 110, rowY, `[ ${SettingsManager.getKeyName(keyCode)} ]`, {
                fontFamily: 'Courier New, monospace',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            keyBtn.on('pointerover', () => {
                if (!this.listeningFor) keyBtn.setColor('#F5C518');
            });
            keyBtn.on('pointerout', () => {
                if (!this.listeningFor || this.listeningFor.labelObj !== keyBtn) keyBtn.setColor('#ffffff');
            });
            keyBtn.on('pointerdown', () => {
                if (this.listeningFor) this.cancelListening();
                this.listeningFor = { playerId, actionKey: act.key, labelObj: keyBtn };
                keyBtn.setText('[ PULSA TECLA ]');
                keyBtn.setColor('#F5C518');
            });

            this.keyButtons.push({ playerId, actionKey: act.key, labelObj: keyBtn });
        });
    }

    resetAllSettings() {
        this.listeningFor = null;
        SettingsManager.resetDefaults();

        this.volumeTexts.musicVolume.setText(`${Math.round(SettingsManager.musicVolume * 100)}%`);
        this.volumeTexts.sfxVolume.setText(`${Math.round(SettingsManager.sfxVolume * 100)}%`);
        this.applyMusicVolume(SettingsManager.musicVolume);

        this.keyButtons.forEach(({ playerId, actionKey, labelObj }) => {
            const keyCode = SettingsManager.controls[playerId][actionKey];
            labelObj.setText(`[ ${SettingsManager.getKeyName(keyCode)} ]`);
            labelObj.setColor('#ffffff');
        });
    }

    cancelListening() {
        if (!this.listeningFor) return;
        const { playerId, actionKey, labelObj } = this.listeningFor;
        const current = SettingsManager.controls[playerId][actionKey];
        labelObj.setText(`[ ${SettingsManager.getKeyName(current)} ]`);
        labelObj.setColor('#ffffff');
        this.listeningFor = null;
    }
}