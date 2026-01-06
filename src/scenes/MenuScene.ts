import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import { AudioManager } from '../systems/AudioManager';

/**
 * 菜单场景 - 游戏主菜单
 */
export class MenuScene extends Phaser.Scene {
  private buttonContainer!: Phaser.GameObjects.Container;
  private audioManager!: AudioManager;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // 初始化音频管理器并播放背景音乐
    this.audioManager = AudioManager.getInstance();
    this.audioManager.setScene(this);
    this.audioManager.playBGM();

    // 添加背景图片
    const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'menu_background');
    bg.setDisplaySize(WIDTH, HEIGHT);

    // 添加游戏标题图片（放在左侧空白区域）
    const title = this.add.image(250, HEIGHT - 100, 'game_title');
    title.setDisplaySize(500, 300);

    // 标题浮动动画
    this.tweens.add({
      targets: title,
      y: title.y - 8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 创建开始按钮（冒险模式）- 用户调整的位置
    this.buttonContainer = this.add.container(WIDTH / 2 + 200, HEIGHT / 2 - 150);

    // 添加开始按钮图片（冒险模式图片已包含文字）
    const startButton = this.add.image(0, 0, 'start_button');
    startButton.setScale(0.9);
    this.buttonContainer.add(startButton);

    // 设置交互区域
    this.buttonContainer.setSize(startButton.width * 0.9, startButton.height * 0.9);
    this.buttonContainer.setInteractive({ useHandCursor: true });

    // 悬停效果
    this.buttonContainer.on('pointerover', () => {
      this.tweens.killTweensOf(this.buttonContainer);
      this.tweens.add({
        targets: this.buttonContainer,
        scale: 1.1,
        duration: 150,
        ease: 'Power2',
      });
    });

    this.buttonContainer.on('pointerout', () => {
      this.tweens.killTweensOf(this.buttonContainer);
      this.tweens.add({
        targets: this.buttonContainer,
        scale: 1,
        duration: 150,
        ease: 'Power2',
      });
    });

    // 点击开始游戏
    this.buttonContainer.on('pointerdown', () => {
      this.audioManager.playTap();
      this.tweens.killTweensOf(this.buttonContainer);
      this.tweens.add({
        targets: this.buttonContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        },
      });
    });

    // 副标题 - 学习版说明（小字放在底部）
    const subtitle = this.add.text(WIDTH / 2, HEIGHT - 40, 'TypeScript + Phaser.js 学习版', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'italic',
      stroke: '#000000',
      strokeThickness: 2,
    });
    subtitle.setOrigin(0.5);
    subtitle.setAlpha(0.6);

    // 版本信息
    const version = this.add.text(WIDTH - 10, HEIGHT - 10, 'v1.0.0', {
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    });
    version.setOrigin(1);
    version.setAlpha(0.5);
  }
}
