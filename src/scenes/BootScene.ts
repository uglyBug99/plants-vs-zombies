import Phaser from 'phaser';

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
    // 加载图片资源（使用绝对路径从 public 目录加载）
    this.load.image('background', '/assets/images/background.png');
    this.load.image('sun', '/assets/images/sun.png');
    this.load.image('bullet', '/assets/images/bullet.png');

    // 菜单资源
    this.load.image('menu_background', '/assets/images/menu_background.png');
    this.load.image('game_logo', '/assets/images/game_logo.png');
    this.load.image('start_button', '/assets/images/start_button.png');

    // 植物
    this.load.image('sunflower', '/assets/images/sunflower.png');
    this.load.image('peashooter', '/assets/images/peashooter.png');
    this.load.image('wallnut', '/assets/images/wallnut.png');

    // 僵尸
    this.load.image('zombie_normal', '/assets/images/zombie_normal.png');
    this.load.image('zombie_conehead', '/assets/images/zombie_conehead.png');

    // 卡片
    this.load.image('card_sunflower', '/assets/images/card_sunflower.png');
    this.load.image('card_peashooter', '/assets/images/card_peashooter.png');
    this.load.image('card_wallnut', '/assets/images/card_wallnut.png');
  }

  create(): void {
    // 资源加载完成，进入菜单场景
    this.scene.start('MenuScene');
  }
}
