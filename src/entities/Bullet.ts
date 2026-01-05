import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * 子弹类 - 豌豆射手发射的豌豆
 */
export class Bullet extends Phaser.GameObjects.Image {
  private speed: number;
  private row: number;

  constructor(scene: Phaser.Scene, x: number, y: number, row: number) {
    super(scene, x, y, 'bullet');

    this.speed = GAME_CONFIG.BULLET.SPEED;
    this.row = row;
    this.setData('row', row);

    // 设置子弹大小
    this.setDisplaySize(25, 25);

    scene.add.existing(this);
  }

  public update(_time: number, delta: number): void {
    // 向右移动
    this.x += this.speed * (delta / 1000);

    // 超出屏幕边界销毁
    if (this.x > GAME_CONFIG.WIDTH + 50) {
      this.destroy();
    }
  }

  public getRow(): number {
    return this.row;
  }
}
