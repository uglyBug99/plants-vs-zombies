import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * 菜单场景 - 游戏主菜单
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // 背景色
    this.cameras.main.setBackgroundColor('#228B22');

    // 标题
    const title = this.add.text(WIDTH / 2, HEIGHT / 3, '植物大战僵尸', {
      fontSize: '64px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    title.setOrigin(0.5);

    // 副标题
    const subtitle = this.add.text(WIDTH / 2, HEIGHT / 3 + 70, 'TypeScript + Phaser.js 学习版', {
      fontSize: '20px',
      color: '#90EE90',
    });
    subtitle.setOrigin(0.5);

    // 开始按钮
    const startButton = this.add.text(WIDTH / 2, HEIGHT / 2 + 50, '开始游戏', {
      fontSize: '36px',
      color: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 30, y: 15 },
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    // 按钮悬停效果
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#66BB6A' });
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#4CAF50' });
      startButton.setScale(1);
    });

    // 点击开始游戏
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // 版本信息
    const version = this.add.text(WIDTH - 10, HEIGHT - 10, 'v1.0.0', {
      fontSize: '14px',
      color: '#666666',
    });
    version.setOrigin(1);
  }
}
