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

  private sprite!: Phaser.GameObjects.Image;
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
    // 根据类型选择不同的僵尸图片
    const imageKey = type === ZombieType.CONEHEAD ? 'zombie_conehead' : 'zombie_normal';
    this.sprite = this.scene.add.image(0, 0, imageKey);
    this.sprite.setDisplaySize(60, 80);
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

    // 简单的行走动画
    this.sprite.y = Math.sin(_time * 0.01) * 3;
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
    this.updateHealthBar();

    // 受伤闪烁效果
    this.sprite.setTint(0xFFFFFF);
    this.scene.time.delayedCall(100, () => {
      if (this.sprite.active) {
        this.sprite.clearTint();
      }
    });

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
    this.isAttacking = attacking;
    
    // 如果前方植物死亡，恢复移动
    if (!attacking) {
      this.scene.time.delayedCall(100, () => {
        this.isAttacking = false;
      });
    }
  }

  public getRow(): number {
    return this.row;
  }
}
