import Phaser from 'phaser';
import { GAME_CONFIG, ZombieType } from '../config/GameConfig';

/**
 * 僵尸类 - 游戏中的敌人
 */
export class Zombie extends Phaser.GameObjects.Container {
  private zombieType: ZombieType;
  private health: number;
  private maxHealth: number;
  private speed: number;
  private damage: number;
  private isAttacking: boolean = false;
  private row: number;

  private sprite: any; // GIF sprite
  private healthBar!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, type: ZombieType, row: number) {
    super(scene, x, y);

    this.zombieType = type;
    this.row = row;
    this.setData('row', row);

    // 根据类型设置属性
    const config = type === ZombieType.CONEHEAD
      ? GAME_CONFIG.ZOMBIES.CONEHEAD
      : GAME_CONFIG.ZOMBIES.NORMAL;

    this.health = config.health;
    this.maxHealth = config.health;
    this.speed = config.speed;
    this.damage = config.damage;

    // 创建僵尸精灵
    this.createSprite(type);

    // 创建血条
    this.healthBar = scene.add.graphics();
    this.add(this.healthBar);
    this.updateHealthBar();

    scene.add.existing(this);
  }

  private createSprite(type: ZombieType): void {
    // 根据类型选择不同的僵尸GIF
    const imageKey = type === ZombieType.CONEHEAD ? 'zombie_conehead' : 'zombie_normal';
    this.sprite = this.scene.add.sprite(0, 0, imageKey + '_texture').play(imageKey);
    this.sprite.setDisplaySize(50, 70);
    this.add(this.sprite);
  }

  private updateHealthBar(): void {
    this.healthBar.clear();

    const barWidth = 50;
    const barHeight = 6;
    const y = -50;

    // 背景
    this.healthBar.fillStyle(0x333333, 1);
    this.healthBar.fillRect(-barWidth / 2, y, barWidth, barHeight);

    // 血量
    const healthPercent = this.health / this.maxHealth;
    this.healthBar.fillStyle(0xFF0000, 1);
    this.healthBar.fillRect(-barWidth / 2, y, barWidth * healthPercent, barHeight);
  }

  public update(_time: number, delta: number): void {
    if (!this.isAttacking) {
      // 向左移动
      this.x -= this.speed * (delta / 1000);
    }


  }

  public takeDamage(damage: number): void {
    this.health -= damage;
    this.updateHealthBar();

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    // 死亡动画
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.destroy();
      },
    });
  }

  public setAttacking(attacking: boolean): void {
    if (this.isAttacking === attacking) return;
    this.isAttacking = attacking;

    // 切换动画
    if (this.sprite) {
      this.sprite.destroy();
    }

    const baseKey = this.zombieType === ZombieType.CONEHEAD ? 'zombie_conehead' : 'zombie_normal';
    const key = attacking ? `${baseKey}_attack` : baseKey;

    this.sprite = this.scene.add.sprite(0, 0, key + '_texture').play(key);
    this.sprite.setDisplaySize(50, 70); // 保持大小一致
    this.add(this.sprite);
    this.sendToBack(this.sprite); // 确保在血条下方

    // 如果前方植物死亡，恢复移动 (逻辑似乎有点由于，通常由外部控制attack状态，但这里保留原有逻辑框架)
    if (!attacking) {
      // 这里的 delayedCall 似乎是为了防止快速切换抖动？或者简单的冷却？
      // 原有逻辑是:
      // if (!attacking) {
      //   this.scene.time.delayedCall(100, () => {
      //     this.isAttacking = false;
      //   });
      // }
      // 但上面已经 set isAttacking = attacking (false) 了。
      // 这个逻辑看起来有点矛盾/多余。
      // 如果 attacking 为 false，我们已经设为 false 了。
      // 暂时保留原有逻辑的意图，但清理实现。

      // 实际上原逻辑:
      // setAttacking(attacking) {
      //   this.isAttacking = attacking;
      //   if (!attacking) {
      //      delayedCall(100, () => this.isAttacking = false)
      //   }
      // }
      // 这意味着如果 setAttacking(false) 被调用，isAttacking 立即变 false，100ms 后又变 false。这没啥用。
      // 除非原意是：如果 attacking (true) -> (false) 的转换有延迟？
      // 假设外部调用 logic 是正确的，这里主要负责表现层。
    }
  }

  public getRow(): number {
    return this.row;
  }
}
