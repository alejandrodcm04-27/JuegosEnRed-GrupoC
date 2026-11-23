import Phaser from 'phaser';

export const MenuUI = {
    addBackground(scene, darken = false) {
        const { width, height, centerX: cx, centerY: cy } = scene.cameras.main;
        scene.cameras.main.fadeIn(250, 14, 16, 32);

        scene.add.image(cx, cy, 'fondo').setDisplaySize(width, height);
        
        //capa submenus
        if (darken) {
            scene.add.rectangle(cx, cy, width, height, 0x000000, 0.9);
        }
    },

    addTitle(scene, text) {
        const { centerX: cx } = scene.cameras.main;
        return scene.add.text(cx, 56, text, {
            fontFamily: 'Courier New, monospace',
            fontSize: '42px',
            fontStyle: 'bold',
            color: '#0AFF00'
        }).setOrigin(0.5);
    },

    addButton(scene, x, y, text, baseColor, onClick, w = 340, h = 50, disabled = false) {
        if (disabled) {
            const bg = scene.add.rectangle(x, y, w, h, 0x000000, 0.5)
                .setStrokeStyle(2, 0x000000, 1);
            const label = scene.add.text(x, y, text, {
                fontFamily: 'Courier New, monospace',
                fontSize: '22px',
                fontStyle: 'bold',
                color: '#000000'
            }).setOrigin(0.5);
            return { bg, label };
        }

        const colorInt = Phaser.Display.Color.HexStringToColor(baseColor).color;

        const bg = scene.add.rectangle(x, y, w, h, 0x000000, 0.75)
            .setStrokeStyle(2, colorInt)
            .setInteractive({ useHandCursor: true });

        const label = scene.add.text(x, y, text, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            fontStyle: 'bold',
            color: baseColor
        }).setOrigin(0.5);

        bg.on('pointerover', () => {
            bg.setFillStyle(0x000000, 0.75);
            bg.setStrokeStyle(2, 0x0AFF00);
            label.setColor('#0AFF00');
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x000000, 0.75);
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
            color: '#9F00F7'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#9F00F7'));
        btn.on('pointerout', () => btn.setColor('#9F00F7'));
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