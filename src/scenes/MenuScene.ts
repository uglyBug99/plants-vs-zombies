import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * 菜单场景 - 游戏主菜单
 */
export class MenuScene extends Phaser.Scene {
  private buttonContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // 添加背景图片
    const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'menu_background');
    bg.setDisplaySize(WIDTH, HEIGHT);

    // 添加游戏 Logo
    const logo = this.add.image(WIDTH / 2, HEIGHT / 3 - 20, 'game_logo');
    logo.setDisplaySize(450, 180);
    
    // Logo 浮动动画
    this.tweens.add({
      targets: logo,
      y: logo.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 添加装饰性阳光（左侧）
    const sunLeft = this.add.image(150, 150, 'sun');
    sunLeft.setDisplaySize(80, 80);
    this.tweens.add({
      targets: sunLeft,
      rotation: Math.PI * 2,
      duration: 8000,
      repeat: -1,
    });

    // 添加装饰性阳光（右侧）
    const sunRight = this.add.image(WIDTH - 150, 180, 'sun');
    sunRight.setDisplaySize(60, 60);
    this.tweens.add({
      targets: sunRight,
      rotation: -Math.PI * 2,
      duration: 6000,
      repeat: -1,
    });

    // 创建开始按钮容器
    this.buttonContainer = this.add.container(WIDTH / 2, HEIGHT / 2 + 80);

    // 添加开始按钮图片
    const startButton = this.add.image(0, 0, 'start_button');
    startButton.setDisplaySize(220, 80);
    this.buttonContainer.add(startButton);

    // 开始按钮文字
    const startButtonText = this.add.text(0, 0, '开始游戏', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#2d5a27',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true,
      },
    });
    startButtonText.setOrigin(0.5);
    this.buttonContainer.add(startButtonText);

    // 设置交互区域
    this.buttonContainer.setSize(220, 80);
    this.buttonContainer.setInteractive({ useHandCursor: true });

    // 悬停效果 - 先停止所有动画再执行新动画
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
    const subtitle = this.add.text(WIDTH / 2, HEIGHT - 80, 'TypeScript + Phaser.js 学习版', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'italic',
      stroke: '#000000',
      strokeThickness: 2,
    });
    subtitle.setOrigin(0.5);
    subtitle.setAlpha(0.8);

    // 版本信息
    const version = this.add.text(WIDTH - 15, HEIGHT - 15, 'v1.0.0', {
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    });
    version.setOrigin(1);
    version.setAlpha(0.6);

    // 添加装饰性植物（底部）
    const sunflowerDeco = this.add.image(100, HEIGHT - 100, 'sunflower');
    sunflowerDeco.setDisplaySize(80, 100);
    this.tweens.add({
      targets: sunflowerDeco,
      y: sunflowerDeco.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const peashooterDeco = this.add.image(WIDTH - 100, HEIGHT - 100, 'peashooter');
    peashooterDeco.setDisplaySize(80, 100);
    this.tweens.add({
      targets: peashooterDeco,
      y: peashooterDeco.y - 5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
