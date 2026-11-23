import Phaser from 'phaser';

const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const DEFAULT_SETTINGS = {
    musicVolume: 0.0,
    sfxVolume: 0.6,
    controls: {
        player1: {
            left: KeyCodes.A,
            right: KeyCodes.D,
            jump: KeyCodes.W,
            down: KeyCodes.S,
            shoot: KeyCodes.SPACE,
            mine: KeyCodes.Q
        },
        player2: {
            left: KeyCodes.LEFT,
            right: KeyCodes.RIGHT,
            jump: KeyCodes.UP,
            down: KeyCodes.DOWN,
            shoot: KeyCodes.ENTER,
            mine: KeyCodes.M
        }
    }
};

export const SettingsManager = {
    musicVolume: DEFAULT_SETTINGS.musicVolume,
    sfxVolume: DEFAULT_SETTINGS.sfxVolume,
    currentMusic: null,

    controls: {
        player1: { ...DEFAULT_SETTINGS.controls.player1 },
        player2: { ...DEFAULT_SETTINGS.controls.player2 }
    },

    playMusic(scene, key) {
        if (this.currentMusic && this.currentMusic.key === key) {
            return;
        }

        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.destroy();
        }

        this.currentMusic = scene.sound.add(key, {
            loop: true,
            volume: this.musicVolume
        });
        this.currentMusic.play();
    },

    resetDefaults() {
        this.musicVolume = DEFAULT_SETTINGS.musicVolume;
        this.sfxVolume = DEFAULT_SETTINGS.sfxVolume;
        this.controls.player1 = { ...DEFAULT_SETTINGS.controls.player1 };
        this.controls.player2 = { ...DEFAULT_SETTINGS.controls.player2 };
    },

    getKeyName(keyCode) {
        const found = Object.entries(KeyCodes).find(([, code]) => code === keyCode);
        return found ? found[0] : String(keyCode);
    }
};