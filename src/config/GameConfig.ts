// 游戏配置常量
export const GAME_CONFIG = {
  // 画布尺寸
  WIDTH: 1000,
  HEIGHT: 600,

  // 网格配置
  GRID: {
    ROWS: 5,
    COLS: 9,
    CELL_WIDTH: 80,
    CELL_HEIGHT: 100,
    OFFSET_X: 250, // 草坪起始X坐标
    OFFSET_Y: 80, // 草坪起始Y坐标
  },

  // 阳光配置
  SUN: {
    INITIAL: 50,
    DROP_INTERVAL: 10000, // 天降阳光间隔（毫秒）
    VALUE: 25,
    FALL_SPEED: 50,
  },

  // 植物配置
  PLANTS: {
    SUNFLOWER: {
      name: "向日葵",
      cost: 50,
      health: 100,
      sunInterval: 24000, // 产出阳光间隔
    },
    PEASHOOTER: {
      name: "豌豆射手",
      cost: 100,
      health: 100,
      fireRate: 1500, // 发射间隔
      damage: 20,
    },
    WALLNUT: {
      name: "坚果墙",
      cost: 50,
      health: 400,
    },
  },

  // 僵尸配置
  ZOMBIES: {
    NORMAL: {
      name: "普通僵尸",
      health: 100,
      speed: 20,
      damage: 20,
    },
    CONEHEAD: {
      name: "路障僵尸",
      health: 200,
      speed: 20,
      damage: 20,
    },
  },

  // 子弹配置
  BULLET: {
    SPEED: 300,
    DAMAGE: 20,
  },
};

// 游戏状态枚举
export enum GameState {
  MENU = "menu",
  PLAYING = "playing",
  PAUSED = "paused",
  WIN = "win",
  LOSE = "lose",
}

// 植物类型枚举
export enum PlantType {
  SUNFLOWER = "sunflower",
  PEASHOOTER = "peashooter",
  WALLNUT = "wallnut",
}

// 僵尸类型枚举
export enum ZombieType {
  NORMAL = "normal",
  CONEHEAD = "conehead",
}
