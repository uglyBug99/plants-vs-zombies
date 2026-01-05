import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * 阳光类 - 天降阳光和植物产出的阳光
 */
export class Sun extends Phaser.GameObjects.Image {
  private targetY: number;
  private falling: boolean = true;

  constructor(scene: Phaser.Scene, x: number, targetY: number) {
    // 从屏幕顶部开始，使用阳光图片
    super(scene, x, -20, 'sun');

    this.targetY = targetY;
    
    // 设置大小
    this.setDisplaySize(45, 45);

    scene.add.existing(this);
  }

  public update(_time: number, delta: number): void {
    if (this.falling) {
      // 下落
      this.y += GAME_CONFIG.SUN.FALL_SPEED * (delta / 1000);

      // 到达目标位置后停止
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.falling = false;
        this.startIdleAnimation();
      }
    }

    // 旋转动画
    this.rotation += 0.02;
  }

  private startIdleAnimation(): void {
    // 上下浮动动画
    this.scene.tweens.add({
      targets: this,
      y: this.targetY - 10,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 5秒后自动消失
    this.scene.time.delayedCall(5000, () => {
      if (this.active) {
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.destroy();
          },
        });
      }
    });
  }

  public isFalling(): boolean {
    return this.falling;
  }
}
