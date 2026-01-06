import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import { Sun } from '../entities/Sun';
import { GameScene } from '../scenes/GameScene';
import { AudioManager } from './AudioManager';

/**
 * 阳光系统 - 管理阳光的生成、收集和消耗
 */
export class SunSystem {
  private scene: Phaser.Scene;
  private sunCount: number;
  private dropTimer?: Phaser.Time.TimerEvent;
  private suns: Sun[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.sunCount = GAME_CONFIG.SUN.INITIAL;
  }

  /**
   * 获取当前阳光数量
   */
  public getSunCount(): number {
    return this.sunCount;
  }

  /**
   * 添加阳光
   */
  public addSun(amount: number): void {
    this.sunCount += amount;
  }

  /**
   * 消费阳光
   * @returns 是否成功消费
   */
  public spendSun(amount: number): boolean {
    if (this.sunCount >= amount) {
      this.sunCount -= amount;
      return true;
    }
    return false;
  }

  /**
   * 开始天降阳光
   */
  public startDropping(): void {
    this.dropTimer = this.scene.time.addEvent({
      delay: GAME_CONFIG.SUN.DROP_INTERVAL,
      callback: this.dropSun,
      callbackScope: this,
      loop: true,
    });

    // 初始掉落一个
    this.scene.time.delayedCall(2000, () => {
      this.dropSun();
    });
  }

  /**
   * 停止天降阳光
   */
  public stopDropping(): void {
    if (this.dropTimer) {
      this.dropTimer.destroy();
    }
  }

  /**
   * 掉落一个阳光
   */
  private dropSun(): void {
    const { GRID, WIDTH } = GAME_CONFIG;

    // 计算网格总宽度
    const gridTotalWidth = GRID.COL_WIDTHS.reduce((sum, w) => sum + w, 0);

    // 随机X位置（在草坪范围内）
    const minX = GRID.OFFSET_X + 50;
    const maxX = GRID.OFFSET_X + gridTotalWidth - 50;
    const x = Phaser.Math.Between(minX, maxX);

    // 随机Y目标位置
    const minY = GRID.OFFSET_Y + 50;
    const maxY = GRID.OFFSET_Y + GRID.ROWS * GRID.CELL_HEIGHT - 50;
    const targetY = Phaser.Math.Between(minY, maxY);

    // 创建阳光
    const sun = new Sun(this.scene, x, targetY);
    sun.setInteractive({ useHandCursor: true });

    // 点击收集
    sun.on('pointerdown', () => {
      this.collectSun(sun);
    });

    this.suns.push(sun);
  }

  /**
   * 收集阳光
   */
  private collectSun(sun: Sun): void {
    // 移除监听
    sun.removeInteractive();

    // 播放收集阳光音效
    AudioManager.getInstance().playClickSun();

    // 飞向阳光计数器的动画
    this.scene.tweens.add({
      targets: sun,
      x: 50,
      y: 35,
      scale: 0.5,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.addSun(GAME_CONFIG.SUN.VALUE);
        (this.scene as GameScene).collectSun(0); // 触发UI更新
        sun.destroy();

        // 从列表中移除
        const index = this.suns.indexOf(sun);
        if (index > -1) {
          this.suns.splice(index, 1);
        }
      },
    });
  }

  /**
   * 更新所有阳光
   */
  public update(time: number, delta: number): void {
    this.suns.forEach((sun) => {
      if (sun.active) {
        sun.update(time, delta);
      }
    });
  }

  /**
   * 重置阳光系统
   */
  public reset(): void {
    this.sunCount = GAME_CONFIG.SUN.INITIAL;
    this.stopDropping();
    this.suns.forEach((sun) => sun.destroy());
    this.suns = [];
  }
}
