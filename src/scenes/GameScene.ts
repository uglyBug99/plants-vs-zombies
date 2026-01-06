import Phaser from 'phaser';
import { GAME_CONFIG, PlantType, ZombieType } from '../config/GameConfig';
import { GridSystem } from '../systems/GridSystem';
import { SunSystem } from '../systems/SunSystem';
import { AudioManager } from '../systems/AudioManager';
import { Plant, Sunflower, Peashooter, Wallnut } from '../entities/Plant';
import { Zombie } from '../entities/Zombie';
import { Bullet } from '../entities/Bullet';

/**
 * 游戏主场景 - 核心游戏逻辑
 */
export class GameScene extends Phaser.Scene {
  // 系统
  private gridSystem!: GridSystem;
  private sunSystem!: SunSystem;
  private audioManager!: AudioManager;

  // 游戏对象组
  private plants!: Phaser.GameObjects.Group;
  private zombies!: Phaser.GameObjects.Group;
  private bullets!: Phaser.GameObjects.Group;
  private suns!: Phaser.GameObjects.Group;

  // UI
  private sunCountText!: Phaser.GameObjects.Text;
  private selectedPlant: PlantType | null = null;
  private plantCards: Map<PlantType, Phaser.GameObjects.Container> = new Map();

  // 波次管理
  private waveTimer!: Phaser.Time.TimerEvent;
  private currentWave: number = 0;
  private zombiesRemaining: number = 0;

  // 音效控制
  private isPlayingEatSound: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // 初始化系统
    this.initSystems();

    // 创建游戏对象组
    this.createGroups();

    // 绘制游戏界面
    this.drawBackground();
    this.drawGrid();
    this.createUI();

    // 启动游戏循环
    this.startGame();
  }

  private initSystems(): void {
    this.gridSystem = new GridSystem();
    this.sunSystem = new SunSystem(this);
    this.audioManager = AudioManager.getInstance();
    this.audioManager.setScene(this);
  }

  /**
   * 获取指定列的X起始坐标
   */
  private getColX(col: number): number {
    const { GRID } = GAME_CONFIG;
    let x = GRID.OFFSET_X;
    for (let i = 0; i < col; i++) {
      x += GRID.COL_WIDTHS[i];
    }
    return x;
  }

  /**
   * 获取指定列的中心X坐标
   */
  private getColCenterX(col: number): number {
    return this.getColX(col) + GAME_CONFIG.GRID.COL_WIDTHS[col] / 2;
  }

  /**
   * 获取网格总宽度
   */
  private getGridTotalWidth(): number {
    return GAME_CONFIG.GRID.COL_WIDTHS.reduce((sum, w) => sum + w, 0);
  }

  private createGroups(): void {
    this.plants = this.add.group();
    this.zombies = this.add.group();
    this.bullets = this.add.group();
    this.suns = this.add.group();
  }

  private drawBackground(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // 添加背景图片
    const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'background');
    bg.setDisplaySize(WIDTH, HEIGHT);
  }

  private drawGrid(): void {
    // 使网格可点击以放置植物
    const { GRID } = GAME_CONFIG;

    for (let row = 0; row < GRID.ROWS; row++) {
      for (let col = 0; col < GRID.COLS; col++) {
        const x = this.getColCenterX(col);
        const y = GRID.OFFSET_Y + row * GRID.CELL_HEIGHT + GRID.CELL_HEIGHT / 2;
        const colWidth = GRID.COL_WIDTHS[col];

        const zone = this.add.zone(x, y, colWidth, GRID.CELL_HEIGHT);
        zone.setInteractive({ useHandCursor: true });
        zone.setData('row', row);
        zone.setData('col', col);

        zone.on('pointerdown', () => {
          this.onCellClick(row, col);
        });
      }
    }
  }

  private createUI(): void {
    const { WIDTH } = GAME_CONFIG;

    // 顶部工具栏背景
    const toolbar = this.add.graphics();
    toolbar.fillStyle(0x5D4037, 1);
    toolbar.fillRect(0, 0, WIDTH, 70);

    // 阳光计数（使用图片图标）
    const sunIcon = this.add.image(50, 35, 'sun');
    sunIcon.setDisplaySize(40, 40);
    this.sunCountText = this.add.text(80, 25, `${GAME_CONFIG.SUN.INITIAL}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    // 植物卡片
    this.createPlantCards();
  }

  private createPlantCards(): void {
    const plants = [
      { type: PlantType.SUNFLOWER, name: '向日葵', cost: GAME_CONFIG.PLANTS.SUNFLOWER.cost, cardKey: 'card_sunflower' },
      { type: PlantType.PEASHOOTER, name: '豌豆射手', cost: GAME_CONFIG.PLANTS.PEASHOOTER.cost, cardKey: 'card_peashooter' },
      { type: PlantType.WALLNUT, name: '坚果墙', cost: GAME_CONFIG.PLANTS.WALLNUT.cost, cardKey: 'card_wallnut' },
    ];

    plants.forEach((plant, index) => {
      const x = 180 + index * 100;
      const y = 35;

      // 卡片背景
      const cardBg = this.add.graphics();
      cardBg.fillStyle(0x8D6E63, 1);
      cardBg.fillRoundedRect(-40, -30, 80, 60, 8);

      // 植物卡片图标（使用图片）
      const icon = this.add.image(0, -5, plant.cardKey);
      icon.setDisplaySize(50, 40);

      // 消耗阳光
      const costText = this.add.text(0, 20, `${plant.cost}`, {
        fontSize: '14px',
        color: '#FFD700',
      });
      costText.setOrigin(0.5);

      // 组合成容器
      const container = this.add.container(x, y, [cardBg, icon, costText]);
      container.setSize(80, 60);
      container.setInteractive({ useHandCursor: true });
      container.setData('plantType', plant.type);

      // 选中效果
      container.on('pointerdown', () => {
        this.selectPlant(plant.type);
      });

      this.plantCards.set(plant.type, container);
    });
  }

  private selectPlant(type: PlantType): void {
    // 取消之前的选中
    this.plantCards.forEach((card) => {
      card.setAlpha(1);
    });

    // 检查阳光是否足够
    const config = this.getPlantConfig(type);
    if (this.sunSystem.getSunCount() < config.cost) {
      return;
    }

    // 选中新植物
    this.selectedPlant = type;
    const card = this.plantCards.get(type);
    if (card) {
      card.setAlpha(0.7);
    }
  }

  private getPlantConfig(type: PlantType) {
    switch (type) {
      case PlantType.SUNFLOWER:
        return GAME_CONFIG.PLANTS.SUNFLOWER;
      case PlantType.PEASHOOTER:
        return GAME_CONFIG.PLANTS.PEASHOOTER;
      case PlantType.WALLNUT:
        return GAME_CONFIG.PLANTS.WALLNUT;
    }
  }

  private onCellClick(row: number, col: number): void {
    if (!this.selectedPlant) return;
    if (this.gridSystem.isOccupied(row, col)) return;

    const config = this.getPlantConfig(this.selectedPlant);
    if (!this.sunSystem.spendSun(config.cost)) return;

    // 播放放置植物音效
    this.audioManager.playTap();

    // 放置植物
    this.placePlant(this.selectedPlant, row, col);

    // 取消选中
    this.plantCards.forEach((card) => card.setAlpha(1));
    this.selectedPlant = null;

    // 更新阳光显示
    this.updateSunDisplay();
  }

  private placePlant(type: PlantType, row: number, col: number): void {
    const { GRID } = GAME_CONFIG;
    const x = this.getColCenterX(col);
    const y = GRID.OFFSET_Y + row * GRID.CELL_HEIGHT + GRID.CELL_HEIGHT / 2;

    let plant: Plant;

    switch (type) {
      case PlantType.SUNFLOWER:
        plant = new Sunflower(this, x, y);
        break;
      case PlantType.PEASHOOTER:
        plant = new Peashooter(this, x, y, row);
        break;
      case PlantType.WALLNUT:
        plant = new Wallnut(this, x, y);
        break;
    }

    this.plants.add(plant);
    this.gridSystem.setOccupied(row, col, true);
    plant.setData('row', row);
    plant.setData('col', col);
  }

  private startGame(): void {
    // 播放背景音乐
    this.audioManager.playBGM();

    // 播放游戏开始音效
    this.audioManager.playReadySetPlant();

    // 开始天降阳光
    this.sunSystem.startDropping();

    // 延迟开始僵尸波次
    this.time.delayedCall(5000, () => {
      this.startWave();
    });
  }

  private startWave(): void {
    this.currentWave++;
    const zombieCount = 3 + this.currentWave * 2;
    this.zombiesRemaining = zombieCount;

    // 播放僵尸来袭警报
    if (this.currentWave === 1) {
      this.audioManager.playZombieComing();
    } else if (this.currentWave >= 5) {
      this.audioManager.playFinalWave();
    } else if (this.currentWave >= 3) {
      this.audioManager.playHugeWave();
    } else {
      this.audioManager.playZombieComing();
    }

    // 间隔生成僵尸
    let spawned = 0;
    this.waveTimer = this.time.addEvent({
      delay: 3000,
      callback: () => {
        spawned++;
        const row = Phaser.Math.Between(0, GAME_CONFIG.GRID.ROWS - 1);
        const type = spawned % 3 === 0 ? ZombieType.CONEHEAD : ZombieType.NORMAL;
        this.spawnZombie(type, row);

        if (spawned >= zombieCount) {
          this.waveTimer.destroy();
        }
      },
      repeat: zombieCount - 1,
    });
  }

  private spawnZombie(type: ZombieType, row: number): void {
    const { GRID, WIDTH } = GAME_CONFIG;
    const x = WIDTH + 50; // 从画面最右边进入
    const y = GRID.OFFSET_Y + row * GRID.CELL_HEIGHT + GRID.CELL_HEIGHT / 2;

    const zombie = new Zombie(this, x, y, type, row);
    this.zombies.add(zombie);
  }

  update(time: number, delta: number): void {
    // 更新所有植物
    this.plants.getChildren().forEach((plant) => {
      (plant as Plant).update(time, delta);
    });

    // 更新所有僵尸
    this.zombies.getChildren().forEach((zombie) => {
      (zombie as Zombie).update(time, delta);
    });

    // 更新所有子弹
    this.bullets.getChildren().forEach((bullet) => {
      (bullet as Bullet).update(time, delta);
    });

    // 碰撞检测
    this.checkCollisions();

    // 检查游戏结束条件
    this.checkGameOver();

    // 更新阳光显示
    this.updateSunDisplay();
  }

  private checkCollisions(): void {
    // 子弹与僵尸碰撞
    this.bullets.getChildren().forEach((bulletObj) => {
      const bullet = bulletObj as Bullet;

      this.zombies.getChildren().forEach((zombieObj) => {
        const zombie = zombieObj as Zombie;

        if (bullet.getData('row') === zombie.getData('row')) {
          const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, zombie.x, zombie.y);
          if (distance < 40) {
            zombie.takeDamage(GAME_CONFIG.BULLET.DAMAGE);
            this.audioManager.playPlantHit();
            bullet.destroy();
          }
        }
      });
    });

    // 僵尸与植物碰撞
    let isZombieEating = false;
    this.zombies.getChildren().forEach((zombieObj) => {
      const zombie = zombieObj as Zombie;
      const zombieRow = zombie.getData('row');

      this.plants.getChildren().forEach((plantObj) => {
        const plant = plantObj as Plant;
        const plantRow = plant.getData('row');

        if (zombieRow === plantRow && Math.abs(zombie.x - plant.x) < 40) {
          zombie.setAttacking(true);
          plant.takeDamage(GAME_CONFIG.ZOMBIES.NORMAL.damage * 0.016); // 每帧伤害
          isZombieEating = true;
        }
      });
    });

    // 播放僵尸啃咬音效（使用标志位避免重复播放）
    if (isZombieEating && !this.isPlayingEatSound) {
      this.isPlayingEatSound = true;
      this.audioManager.playZombieEat();
      // 1秒后才能再次播放
      this.time.delayedCall(1000, () => {
        this.isPlayingEatSound = false;
      });
    }
  }

  private checkGameOver(): void {
    // 检查是否有僵尸到达左边界
    this.zombies.getChildren().forEach((zombieObj) => {
      const zombie = zombieObj as Zombie;
      if (zombie.x < 50) {
        this.gameOver(false);
      }
    });
  }

  private gameOver(win: boolean): void {
    this.scene.pause();

    // 播放游戏结束音效
    if (win) {
      this.audioManager.playGameWin();
    } else {
      this.audioManager.playGameOver();
    }

    const { WIDTH, HEIGHT } = GAME_CONFIG;
    const text = win ? '胜利！' : '游戏结束';
    const color = win ? '#00FF00' : '#FF0000';

    const gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, text, {
      fontSize: '64px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    gameOverText.setOrigin(0.5);

    // 重新开始按钮
    const restartButton = this.add.text(WIDTH / 2, HEIGHT / 2 + 80, '重新开始', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 },
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.audioManager.playTap();
      this.scene.restart();
    });
  }

  private updateSunDisplay(): void {
    this.sunCountText.setText(`${this.sunSystem.getSunCount()}`);
  }

  // 公共方法供其他类调用
  public addBullet(bullet: Bullet): void {
    this.bullets.add(bullet);
  }

  public addSun(sun: Phaser.GameObjects.Arc): void {
    this.suns.add(sun);
  }

  public collectSun(amount: number): void {
    this.sunSystem.addSun(amount);
    this.updateSunDisplay();
  }

  public hasZombieInRow(row: number): boolean {
    return this.zombies.getChildren().some((zombie) => {
      return (zombie as Zombie).getData('row') === row;
    });
  }
}
