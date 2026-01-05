# 🌻 植物大战僵尸 (Plants vs. Zombies)

> 一个使用 **TypeScript** 和 **Phaser.js 3** 构建的经典塔防游戏学习项目

![Version](https://img.shields.io/badge/version-1.0.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Phaser](https://img.shields.io/badge/Phaser-3.90-purple)
![Vite](https://img.shields.io/badge/Vite-7.2-yellow)

[English](./README_EN.md) | 中文

## 📖 项目简介

这是一个仿《植物大战僵尸》的 Web 游戏项目，旨在学习 TypeScript 与 Phaser.js 游戏开发框架。项目实现了游戏的核心玩法，包括：

- 🌻 种植向日葵产出阳光
- 🌱 种植豌豆射手攻击僵尸
- 🥜 种植坚果墙抵御僵尸
- 🧟 不同类型的僵尸波次进攻
- ☀️ 阳光资源收集与管理系统

## 🎮 游戏玩法

### 基本操作

1. **收集阳光** - 点击从天空掉落或向日葵产出的阳光
2. **选择植物** - 点击顶部的植物卡片选中想要种植的植物
3. **种植植物** - 在草坪格子上点击放置选中的植物
4. **防守家园** - 阻止僵尸到达屏幕左侧

### 植物介绍

| 植物 |   名称   | 阳光消耗 | 生命值 | 特性                            |
| :--: | :------: | :------: | :----: | :------------------------------ |
|  🌻  |  向日葵  |    50    |  100   | 每 24 秒产出 25 点阳光          |
|  🌱  | 豌豆射手 |   100    |  100   | 每 1.5 秒向同一行的僵尸发射豌豆 |
|  🥜  |  坚果墙  |    50    |  400   | 高生命值，用于阻挡僵尸          |

### 僵尸介绍

| 僵尸 |   名称   | 生命值 | 速度 | 伤害 |
| :--: | :------: | :----: | :--: | :--: |
|  🧟  | 普通僵尸 |  100   |  20  |  20  |
|  🧟‍♂️  | 路障僵尸 |  200   |  20  |  20  |

## 🏗️ 项目结构

```
pvz-game/
├── public/                      # 静态资源目录
│   └── assets/
│       └── images/              # 游戏图片资源
│           ├── background.png       # 游戏背景
│           ├── sun.png              # 阳光
│           ├── bullet.png           # 豌豆子弹
│           ├── sunflower.png        # 向日葵
│           ├── peashooter.png       # 豌豆射手
│           ├── wallnut.png          # 坚果墙
│           ├── zombie_normal.png    # 普通僵尸
│           ├── zombie_conehead.png  # 路障僵尸
│           ├── card_sunflower.png   # 向日葵卡片
│           ├── card_peashooter.png  # 豌豆射手卡片
│           └── card_wallnut.png     # 坚果墙卡片
├── src/                         # 源代码目录
│   ├── config/                  # 配置文件
│   │   └── GameConfig.ts            # 游戏配置常量与枚举
│   ├── entities/                # 游戏实体
│   │   ├── Plant.ts                 # 植物基类及子类
│   │   ├── Zombie.ts                # 僵尸类
│   │   ├── Bullet.ts                # 子弹类
│   │   └── Sun.ts                   # 阳光类
│   ├── scenes/                  # Phaser 场景
│   │   ├── BootScene.ts             # 启动场景（资源加载）
│   │   ├── MenuScene.ts             # 菜单场景
│   │   └── GameScene.ts             # 游戏主场景
│   ├── systems/                 # 游戏系统
│   │   ├── GridSystem.ts            # 网格管理系统
│   │   └── SunSystem.ts             # 阳光资源系统
│   ├── main.ts                  # 游戏入口
│   └── style.css                # 全局样式
├── index.html                   # HTML 入口
├── package.json                 # 项目依赖配置
├── tsconfig.json                # TypeScript 配置
├── README.md                    # 中文说明文档
└── README_EN.md                 # 英文说明文档
```

## 🛠️ 技术栈

|    技术    |  版本  | 说明                       |
| :--------: | :----: | :------------------------- |
| TypeScript | 5.9.3  | 类型安全的 JavaScript 超集 |
| Phaser.js  | 3.90.0 | 强大的 2D 游戏开发框架     |
|    Vite    | 7.2.4  | 下一代前端构建工具         |

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0 或 **pnpm** >= 8.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 [http://localhost:5173](http://localhost:5173) 即可开始游戏。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览构建产物

```bash
npm run preview
```

## 📐 核心架构

### 场景系统 (Scenes)

游戏采用 Phaser 的场景系统进行状态管理：

```
BootScene → MenuScene → GameScene
    ↓           ↓           ↓
 资源加载    主菜单显示    核心游戏逻辑
```

### 实体继承关系

```
Phaser.GameObjects.Container
        ├── Plant (抽象基类)
        │     ├── Sunflower (向日葵)
        │     ├── Peashooter (豌豆射手)
        │     └── Wallnut (坚果墙)
        └── Zombie (僵尸)

Phaser.GameObjects.Image
        ├── Bullet (子弹)
        └── Sun (阳光)
```

### 系统模块

|    系统    | 文件                    | 职责                                        |
| :--------: | :---------------------- | :------------------------------------------ |
| GridSystem | `systems/GridSystem.ts` | 管理 5×9 的游戏网格，处理植物放置与碰撞检测 |
| SunSystem  | `systems/SunSystem.ts`  | 管理阳光资源的生成、收集与消耗              |

## ⚙️ 配置说明

所有游戏参数均在 `src/config/GameConfig.ts` 中配置，方便调整游戏平衡性：

```typescript
export const GAME_CONFIG = {
  // 画布尺寸
  WIDTH: 1000,
  HEIGHT: 600,

  // 网格配置
  GRID: {
    ROWS: 5, // 行数
    COLS: 9, // 列数
    CELL_WIDTH: 80,
    CELL_HEIGHT: 100,
  },

  // 阳光配置
  SUN: {
    INITIAL: 50, // 初始阳光
    DROP_INTERVAL: 10000, // 天降阳光间隔
    VALUE: 25, // 每个阳光价值
  },

  // 植物配置...
  // 僵尸配置...
};
```

## 🎯 游戏流程

```
┌─────────────┐
│  BootScene  │  加载所有游戏资源
└─────┬───────┘
      ↓
┌─────────────┐
│  MenuScene  │  显示游戏标题和开始按钮
└─────┬───────┘
      ↓ 点击"开始游戏"
┌─────────────┐
│  GameScene  │
│  ┌───────┐  │  1. 初始化系统 (Grid, Sun)
│  │ init  │  │  2. 绘制背景和网格
│  └───┬───┘  │  3. 创建 UI (工具栏、卡片)
│      ↓      │
│  ┌───────┐  │  4. 开始天降阳光
│  │ start │  │  5. 延迟 5 秒后开始僵尸波次
│  └───┬───┘  │
│      ↓      │
│  ┌───────┐  │  6. 每帧更新植物、僵尸、子弹
│  │update │←─│  7. 碰撞检测
│  └───┬───┘  │  8. 检查游戏结束条件
│      ↓      │
│  ┌───────┐  │
│  │gameOver│  │  胜利 / 失败 → 显示结果 → 重新开始
│  └───────┘  │
└─────────────┘
```

## 🔧 开发指南

### 添加新植物

1. 在 `GameConfig.ts` 中添加植物配置：

```typescript
PLANTS: {
  // ...
  NEW_PLANT: {
    name: "新植物",
    cost: 75,
    health: 150,
    // 其他属性...
  },
}
```

2. 在 `PlantType` 枚举中添加类型：

```typescript
export enum PlantType {
  // ...
  NEW_PLANT = "new_plant",
}
```

3. 在 `entities/Plant.ts` 中创建新植物类：

```typescript
export class NewPlant extends Plant {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      PlantType.NEW_PLANT,
      GAME_CONFIG.PLANTS.NEW_PLANT.health,
      "new_plant"
    );
  }

  public update(time: number, delta: number): void {
    // 植物行为逻辑
  }
}
```

4. 在 `GameScene.ts` 中注册植物卡片和放置逻辑。

### 添加新僵尸

流程与添加植物类似，参考 `entities/Zombie.ts` 的实现。

## 📝 待办事项

- [ ] 添加更多植物类型（寒冰射手、火炬树桩等）
- [ ] 添加更多僵尸类型（铁桶僵尸、撑杆僵尸等）
- [ ] 实现植物卡片冷却系统
- [ ] 添加音效和背景音乐
- [ ] 实现关卡选择系统
- [ ] 添加铲子工具移除植物
- [ ] 优化移动端触控支持
- [ ] 添加游戏暂停功能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目仅供学习交流使用。《植物大战僵尸》是 PopCap Games / EA 的注册商标。

---

<p align="center">
  Made with ❤️ using TypeScript + Phaser.js
</p>
