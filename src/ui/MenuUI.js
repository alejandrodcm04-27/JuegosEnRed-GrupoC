import Phaser from 'phaser';

export const MenuUI = {
    addBackground(scene, darken = false) {
        const { width, height, centerX: cx, centerY: cy } = scene.cameras.main;
        scene.cameras.main.fadeIn(250, 14, 16, 32);

        if (scene.textures.exists('fondo') && scene.textures.get('fondo').key !== '__MISSING') {
            scene.add.image(cx, cy, 'fondo').setDisplaySize(width, height);
        } else {
            scene.add.rectangle(cx, cy, width, height, 0x1B1F3B);
        }

        // Capa oscura suave en submenús para que el texto se lea bien sobre el fondo
        if (darken) {
            scene.add.rectangle(cx, cy, width, height, 0x0e1020, 0.9);
        }
    },

    addTitle(scene, text) {
        const { centerX: cx } = scene.cameras.main;
        return scene.add.text(cx, 56, text, {
            fontFamily: 'Courier New, monospace',
            fontSize: '42px',
            fontStyle: 'bold',
            color: '#F5C518'
        }).setOrigin(0.5);
    },

    addButton(scene, x, y, text, baseColor, onClick, w = 340, h = 50) {
        const colorInt = Phaser.Display.Color.HexStringToColor(baseColor).color;

        const bg = scene.add.rectangle(x, y, w, h, 0x12152a, 0.88)
            .setStrokeStyle(2, colorInt)
            .setInteractive({ useHandCursor: true });

        const label = scene.add.text(x, y, text, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            fontStyle: 'bold',
            color: baseColor
        }).setOrigin(0.5);

        bg.on('pointerover', () => {
            bg.setFillStyle(0x23294f, 0.95);
            bg.setStrokeStyle(2, 0xF5C518);
            label.setColor('#F5C518');
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x12152a, 0.88);
            bg.setStrokeStyle(2, colorInt);
            label.setColor(baseColor);
        });

        bg.on('pointerdown', onClick);
        return { bg, label };
    },

    addBackButton(scene, targetScene = 'MenuScene', xOffset = 0) {
        const { centerX: cx, height } = scene.cameras.main;
        const btn = scene.add.text(cx + xOffset, height - 52, '< VOLVER AL MENÚ >', {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#0F9BD7'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#F5C518'));
        btn.on('pointerout', () => btn.setColor('#0F9BD7'));
        btn.on('pointerdown', () => this.transitionTo(scene, targetScene));
        return btn;
    },

    transitionTo(scene, targetScene) {
        scene.cameras.main.fadeOut(220, 14, 16, 32);
        scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            scene.scene.start(targetScene);
        });
    }
};