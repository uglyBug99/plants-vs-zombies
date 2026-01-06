import Phaser from 'phaser';
import { GAME_CONFIG, PlantType } from '../config/GameConfig';
import { Bullet } from './Bullet';
import { GameScene } from '../scenes/GameScene';

/**
 * 植物基类 - 所有植物的父类
 */
export abstract class Plant extends Phaser.GameObjects.Container {
  protected health: number;
  protected maxHealth: number;
  protected plantType: PlantType;
  protected healthBar: Phaser.GameObjects.Graphics;
  protected sprite: any; // GIF sprite

  constructor(scene: Phaser.Scene, x: number, y: number, type: PlantType, health: number, imageKey: string) {
    super(scene, x, y);

    this.plantType = type;
    this.health = health;
    this.maxHealth = health;

    // 使用GifUtils生成的动画
    this.sprite = scene.add.sprite(0, 0, imageKey + '_texture').play(imageKey);
    this.sprite.setDisplaySize(45, 55);
    this.add(this.sprite);

    // 创建血条
    this.healthBar = scene.add.graphics();
    this.add(this.healthBar);
    this.updateHealthBar();

    scene.add.existing(this);
  }

  protected updateHealthBar(): void {
    this.healthBar.clear();

    const barWidth = 50;
    const barHeight = 6;
    const y = -45;

    // 背景
    this.healthBar.fillStyle(0x333333, 1);
    this.healthBar.fillRect(-barWidth / 2, y, barWidth, barHeight);

    // 血量
    const healthPercent = this.health / this.maxHealth;
    const color = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(-barWidth / 2, y, barWidth * healthPercent, barHeight);
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
    this.updateHealthBar();

    if (this.health <= 0) {
      this.die();
    }
  }

  protected die(): void {
    // 通知网格系统该位置已空
    const row = this.getData('row');
    const col = this.getData('col');
    if (row !== undefined && col !== undefined) {
      // 销毁时清除占用状态会在 GridSystem 中处理
    }
    this.destroy();
  }

  public abstract update(time: number, delta: number): void;
}

/**
 * 向日葵 - 产出阳光
 */
export class Sunflower extends Plant {
  private lastSunTime: number = 0;
  private sunInterval: number;
  private baseSunInterval: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlantType.SUNFLOWER, GAME_CONFIG.PLANTS.SUNFLOWER.health, 'sunflower');
    this.baseSunInterval = GAME_CONFIG.PLANTS.SUNFLOWER.sunInterval;
    this.sunInterval = this.getRandomInterval();
    // 设置初始时间为当前时间，避免种下去立即产生阳光
    this.lastSunTime = scene.time.now;
  }

  /**
   * 获取随机间隔（基础间隔的50%-150%，平均值保持不变）
   */
  private getRandomInterval(): number {
    const min = this.baseSunInterval * 0.5;
    const max = this.baseSunInterval * 1.5;
    return Phaser.Math.Between(min, max);
  }

  public update(time: number, _delta: number): void {
    // 产出阳光
    if (time - this.lastSunTime > this.sunInterval) {
      this.lastSunTime = time;
      this.produceSun();
      // 每次产生阳光后重新计算下一次的随机间隔
      this.sunInterval = this.getRandomInterval();
    }
  }

  private produceSun(): void {
    const gameScene = this.scene as GameScene;

    // 创建阳光（使用图片）
    const sun = this.scene.add.sprite(this.x, this.y - 30, 'sun_texture').play('sun');
    sun.setDisplaySize(40, 40);
    sun.setInteractive({ useHandCursor: true });

    // 阳光动画
    this.scene.tweens.add({
      targets: sun,
      y: this.y - 50,
      duration: 500,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        if (sun.active) {
          sun.destroy();
        }
      },
    });

    // 点击收集
    sun.on('pointerdown', () => {
      gameScene.collectSun(GAME_CONFIG.SUN.VALUE);
      sun.destroy();
    });

    gameScene.addSun(sun as any);
  }
}

/**
 * 豌豆射手 - 发射豌豆
 */
export class Peashooter extends Plant {
  private lastFireTime: number = 0;
  private fireRate: number;
  private row: number;

  constructor(scene: Phaser.Scene, x: number, y: number, row: number) {
    super(scene, x, y, PlantType.PEASHOOTER, GAME_CONFIG.PLANTS.PEASHOOTER.health, 'peashooter');
    this.fireRate = GAME_CONFIG.PLANTS.PEASHOOTER.fireRate;
    this.row = row;
  }

  public update(time: number, _delta: number): void {
    const gameScene = this.scene as GameScene;

    // 检查该行是否有僵尸
    if (gameScene.hasZombieInRow(this.row)) {
      // 发射豌豆
      if (time - this.lastFireTime > this.fireRate) {
        this.lastFireTime = time;
        this.fire();
      }
    }
  }

  private fire(): void {
    const bullet = new Bullet(this.scene, this.x + 35, this.y, this.row);
    (this.scene as GameScene).addBullet(bullet);
  }
}

/**
 * 坚果墙 - 高生命值防御
 */
export class Wallnut extends Plant {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlantType.WALLNUT, GAME_CONFIG.PLANTS.WALLNUT.health, 'wallnut');
  }

  public update(_time: number, _delta: number): void {
    // 坚果墙不需要主动行为
  }
}
