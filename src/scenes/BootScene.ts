import Phaser from 'phaser';
import { GifUtils } from '../utils/GifUtils';

/**
 * 启动场景 - 负责加载游戏资源
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // 显示加载进度
    this.createLoadingBar();

    // 加载游戏资源
    this.loadAssets();
  }

  private createLoadingBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 加载文字
    const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
      fontSize: '24px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    // 进度条背景
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x222222, 0.8);
    progressBg.fillRect(width / 2 - 160, height / 2, 320, 30);

    // 进度条
    const progressBar = this.add.graphics();

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 + 5, 310 * value, 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBg.destroy();
      loadingText.destroy();
    });
  }

  private loadAssets(): void {
    const basePath = '/assets/Image';
    const musicPath = '/assets/Music';

    // 背景资源
    this.load.image('background', `${basePath}/BackgroundImage/yard.jpg`);
    this.load.image('menu_background', `${basePath}/BackgroundImage/menu.png`);
    this.load.image('start_button', `${basePath}/BackgroundImage/start.png`);
    this.load.image('game_logo', `${basePath}/BackgroundImage/IconImage.png`);
    this.load.image('game_title', `${basePath}/BackgroundImage/title.png`);
    this.load.image('sun_board', `${basePath}/BackgroundImage/sunBoard.png`);

    // GIFs will be loaded in create() via GifUtils

    // 子弹
    this.load.image('bullet', `${basePath}/BulletImage/PeaBullet.png`);

    // 植物 (GIF loaded in create)
    // (this.load as any).rexGif('peashooter', `${basePath}/PlantImage/Peashooter.gif`);
    // (this.load as any).rexGif('wallnut', `${basePath}/PlantImage/WallNut.gif`);

    // 植物卡片
    this.load.image('card_sunflower', `${basePath}/PlantCardImage/SunflowerCard.jpg`);
    this.load.image('card_peashooter', `${basePath}/PlantCardImage/PeashooterCard.gif`);
    this.load.image('card_wallnut', `${basePath}/PlantCardImage/WallNutCard.png`);

    // 僵尸 (GIF loaded in create)
    // (this.load as any).rexGif('zombie_normal', `${basePath}/ZombieImage/NormalZombieImage/ZombieAdvanceImage.gif`);
    // (this.load as any).rexGif('zombie_normal_attack', `${basePath}/ZombieImage/NormalZombieImage/ZombieAttackImage.gif`);
    // (this.load as any).rexGif('zombie_conehead', `${basePath}/ZombieImage/ConeheadZombie/ConeheadZombie.gif`);
    // (this.load as any).rexGif('zombie_conehead_attack', `${basePath}/ZombieImage/ConeheadZombie/ConeheadZombieAttack.gif`);

    // 音频资源
    this.load.audio('bgm', `${musicPath}/bgm.wav`);
    this.load.audio('tap', `${musicPath}/tap.wav`);
    this.load.audio('clickSun', `${musicPath}/clickSun.wav`);
    this.load.audio('readysetplant', `${musicPath}/readysetplant.wav`);
    this.load.audio('zombieComing', `${musicPath}/zombieComing.wav`);
    this.load.audio('hugeWave', `${musicPath}/hugeWave.wav`);
    this.load.audio('finalWave', `${musicPath}/finalWave.wav`);
    this.load.audio('zombieEat', `${musicPath}/zombieEat.wav`);
    this.load.audio('plantHit', `${musicPath}/plantHit.wav`);
    this.load.audio('cherryBomb', `${musicPath}/CherryBomb.wav`);
    this.load.audio('explosion', `${musicPath}/explosion.wav`);
    this.load.audio('gameOver', `${musicPath}/gameOver.wav`);
    this.load.audio('gameWin', `${musicPath}/gameWin.wav`);
  }

  async create(): Promise<void> {
    // Manually load GIFs
    const basePath = '/assets/Image';

    // Show a loading text for GIFs because create is after preload
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const gifLoadingText = this.add.text(width / 2, height / 2, '处理动画中...', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    try {
      await Promise.all([
        GifUtils.loadGif(this, 'sun', `${basePath}/BackgroundImage/Sun.gif`),
        GifUtils.loadGif(this, 'sunflower', `${basePath}/PlantImage/SunFlower.gif`),
        GifUtils.loadGif(this, 'peashooter', `${basePath}/PlantImage/Peashooter.gif`),
        GifUtils.loadGif(this, 'wallnut', `${basePath}/PlantImage/WallNut.gif`),
        GifUtils.loadGif(this, 'zombie_normal', `${basePath}/ZombieImage/NormalZombieImage/ZombieAdvanceImage.gif`),
        GifUtils.loadGif(this, 'zombie_normal_attack', `${basePath}/ZombieImage/NormalZombieImage/ZombieAttackImage.gif`),
        GifUtils.loadGif(this, 'zombie_conehead', `${basePath}/ZombieImage/ConeheadZombie/ConeheadZombie.gif`),
        GifUtils.loadGif(this, 'zombie_conehead_attack', `${basePath}/ZombieImage/ConeheadZombie/ConeheadZombieAttack.gif`),
      ]);
    } catch (e) {
      console.error('GIF loading failed', e);
    }

    gifLoadingText.destroy();

    // 资源加载完成，进入菜单场景
    this.scene.start('MenuScene');
  }
}
