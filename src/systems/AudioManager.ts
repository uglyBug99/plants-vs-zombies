import Phaser from 'phaser';

/**
 * 音频管理器 - 统一管理游戏音效和背景音乐
 */
export class AudioManager {
    private static instance: AudioManager;
    private scene: Phaser.Scene | null = null;
    private bgm: Phaser.Sound.BaseSound | null = null;
    private isMuted: boolean = false;

    // 音效键名常量
    public static readonly SOUNDS = {
        BGM: 'bgm',
        TAP: 'tap',
        CLICK_SUN: 'clickSun',
        READY_SET_PLANT: 'readysetplant',
        ZOMBIE_COMING: 'zombieComing',
        HUGE_WAVE: 'hugeWave',
        FINAL_WAVE: 'finalWave',
        ZOMBIE_EAT: 'zombieEat',
        PLANT_HIT: 'plantHit',
        CHERRY_BOMB: 'cherryBomb',
        EXPLOSION: 'explosion',
        GAME_OVER: 'gameOver',
        GAME_WIN: 'gameWin',
    } as const;

    private constructor() { }

    /**
     * 获取单例实例
     */
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * 设置当前场景
     */
    public setScene(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    /**
     * 播放背景音乐
     */
    public playBGM(loop: boolean = true): void {
        if (!this.scene || this.isMuted) return;

        // 如果已有BGM在播放，先停止
        this.stopBGM();

        try {
            this.bgm = this.scene.sound.add(AudioManager.SOUNDS.BGM, {
                loop: loop,
                volume: 0.5,
            });
            this.bgm.play();
        } catch (error) {
            console.warn('无法播放背景音乐:', error);
        }
    }

    /**
     * 停止背景音乐
     */
    public stopBGM(): void {
        if (this.bgm) {
            this.bgm.stop();
            this.bgm.destroy();
            this.bgm = null;
        }
    }

    /**
     * 暂停背景音乐
     */
    public pauseBGM(): void {
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.pause();
        }
    }

    /**
     * 恢复背景音乐
     */
    public resumeBGM(): void {
        if (this.bgm && this.bgm.isPaused) {
            this.bgm.resume();
        }
    }

    /**
     * 播放音效
     */
    public playSound(key: string, volume: number = 1): void {
        if (!this.scene || this.isMuted) return;

        try {
            this.scene.sound.play(key, { volume });
        } catch (error) {
            console.warn(`无法播放音效 ${key}:`, error);
        }
    }

    /**
     * 播放点击音效
     */
    public playTap(): void {
        this.playSound(AudioManager.SOUNDS.TAP, 0.6);
    }

    /**
     * 播放收集阳光音效
     */
    public playClickSun(): void {
        this.playSound(AudioManager.SOUNDS.CLICK_SUN, 0.7);
    }

    /**
     * 播放游戏开始音效
     */
    public playReadySetPlant(): void {
        this.playSound(AudioManager.SOUNDS.READY_SET_PLANT, 0.8);
    }

    /**
     * 播放僵尸来袭警报
     */
    public playZombieComing(): void {
        this.playSound(AudioManager.SOUNDS.ZOMBIE_COMING, 0.8);
    }

    /**
     * 播放大波僵尸警报
     */
    public playHugeWave(): void {
        this.playSound(AudioManager.SOUNDS.HUGE_WAVE, 0.9);
    }

    /**
     * 播放最后一波警报
     */
    public playFinalWave(): void {
        this.playSound(AudioManager.SOUNDS.FINAL_WAVE, 0.9);
    }

    /**
     * 播放僵尸啃咬音效
     */
    public playZombieEat(): void {
        this.playSound(AudioManager.SOUNDS.ZOMBIE_EAT, 0.5);
    }

    /**
     * 播放豌豆命中音效
     */
    public playPlantHit(): void {
        this.playSound(AudioManager.SOUNDS.PLANT_HIT, 0.6);
    }

    /**
     * 播放樱桃炸弹爆炸音效
     */
    public playCherryBomb(): void {
        this.playSound(AudioManager.SOUNDS.CHERRY_BOMB, 0.9);
    }

    /**
     * 播放通用爆炸音效
     */
    public playExplosion(): void {
        this.playSound(AudioManager.SOUNDS.EXPLOSION, 0.8);
    }

    /**
     * 播放游戏失败音效
     */
    public playGameOver(): void {
        this.stopBGM();
        this.playSound(AudioManager.SOUNDS.GAME_OVER, 1);
    }

    /**
     * 播放游戏胜利音效
     */
    public playGameWin(): void {
        this.stopBGM();
        this.playSound(AudioManager.SOUNDS.GAME_WIN, 1);
    }

    /**
     * 设置静音状态
     */
    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        if (muted) {
            this.stopBGM();
        }
    }

    /**
     * 获取静音状态
     */
    public getMuted(): boolean {
        return this.isMuted;
    }

    /**
     * 切换静音状态
     */
    public toggleMute(): boolean {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }
}
