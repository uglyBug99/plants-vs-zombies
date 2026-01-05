# 🌻 Plants vs. Zombies

> A classic tower defense game built with **TypeScript** and **Phaser.js 3** for learning purposes

![Version](https://img.shields.io/badge/version-1.0.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Phaser](https://img.shields.io/badge/Phaser-3.90-purple)
![Vite](https://img.shields.io/badge/Vite-7.2-yellow)

English | [中文](./README.md)

## 📖 Introduction

This is a web-based clone of the classic "Plants vs. Zombies" game, designed as a learning project for TypeScript and the Phaser.js game development framework. The project implements core gameplay mechanics including:

- 🌻 Plant sunflowers to produce sun
- 🌱 Plant peashooters to attack zombies
- 🥜 Plant wall-nuts to defend against zombies
- 🧟 Multiple zombie wave attacks
- ☀️ Sun resource collection and management system

## 🎮 How to Play

### Basic Controls

1. **Collect Sun** - Click on suns falling from the sky or produced by sunflowers
2. **Select Plant** - Click on plant cards at the top to select a plant
3. **Place Plant** - Click on a lawn grid cell to place the selected plant
4. **Defend Your Home** - Prevent zombies from reaching the left side of the screen

### Plants

| Plant |    Name    | Sun Cost | Health | Ability                                                  |
| :---: | :--------: | :------: | :----: | :------------------------------------------------------- |
|  🌻   | Sunflower  |    50    |  100   | Produces 25 sun every 24 seconds                         |
|  🌱   | Peashooter |   100    |  100   | Shoots peas at zombies in the same row every 1.5 seconds |
|  🥜   |  Wall-nut  |    50    |  400   | High health, blocks zombies                              |

### Zombies

| Zombie |      Name       | Health | Speed | Damage |
| :----: | :-------------: | :----: | :---: | :----: |
|   🧟   | Regular Zombie  |  100   |  20   |   20   |
|   🧟‍♂️   | Conehead Zombie |  200   |  20   |   20   |

## 🏗️ Project Structure

```
pvz-game/
├── public/                      # Static assets directory
│   └── assets/
│       └── images/              # Game image assets
│           ├── background.png       # Game background
│           ├── sun.png              # Sun
│           ├── bullet.png           # Pea bullet
│           ├── sunflower.png        # Sunflower
│           ├── peashooter.png       # Peashooter
│           ├── wallnut.png          # Wall-nut
│           ├── zombie_normal.png    # Regular zombie
│           ├── zombie_conehead.png  # Conehead zombie
│           ├── card_sunflower.png   # Sunflower card
│           ├── card_peashooter.png  # Peashooter card
│           └── card_wallnut.png     # Wall-nut card
├── src/                         # Source code directory
│   ├── config/                  # Configuration files
│   │   └── GameConfig.ts            # Game constants and enums
│   ├── entities/                # Game entities
│   │   ├── Plant.ts                 # Plant base class and subclasses
│   │   ├── Zombie.ts                # Zombie class
│   │   ├── Bullet.ts                # Bullet class
│   │   └── Sun.ts                   # Sun class
│   ├── scenes/                  # Phaser scenes
│   │   ├── BootScene.ts             # Boot scene (asset loading)
│   │   ├── MenuScene.ts             # Menu scene
│   │   └── GameScene.ts             # Main game scene
│   ├── systems/                 # Game systems
│   │   ├── GridSystem.ts            # Grid management system
│   │   └── SunSystem.ts             # Sun resource system
│   ├── main.ts                  # Game entry point
│   └── style.css                # Global styles
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── README.md                    # Chinese documentation
└── README_EN.md                 # English documentation
```

## 🛠️ Tech Stack

| Technology | Version | Description                            |
| :--------: | :-----: | :------------------------------------- |
| TypeScript |  5.9.3  | Type-safe JavaScript superset          |
| Phaser.js  | 3.90.0  | Powerful 2D game development framework |
|    Vite    |  7.2.4  | Next-generation frontend build tool    |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0
- **npm** >= 9.0 or **pnpm** >= 8.0

### Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm
pnpm install
```

### Start Development Server

```bash
npm run dev
```

After starting, visit [http://localhost:5173](http://localhost:5173) to play the game.

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📐 Core Architecture

### Scene System

The game uses Phaser's scene system for state management:

```
BootScene → MenuScene → GameScene
    ↓           ↓           ↓
Asset Loading  Main Menu   Core Game Logic
```

### Entity Inheritance

```
Phaser.GameObjects.Container
        ├── Plant (Abstract Base Class)
        │     ├── Sunflower
        │     ├── Peashooter
        │     └── Wallnut
        └── Zombie

Phaser.GameObjects.Image
        ├── Bullet
        └── Sun
```

### System Modules

|   System   | File                    | Responsibility                                                         |
| :--------: | :---------------------- | :--------------------------------------------------------------------- |
| GridSystem | `systems/GridSystem.ts` | Manages 5×9 game grid, handles plant placement and collision detection |
| SunSystem  | `systems/SunSystem.ts`  | Manages sun generation, collection, and consumption                    |

## ⚙️ Configuration

All game parameters are configured in `src/config/GameConfig.ts` for easy balance adjustments:

```typescript
export const GAME_CONFIG = {
  // Canvas dimensions
  WIDTH: 1000,
  HEIGHT: 600,

  // Grid configuration
  GRID: {
    ROWS: 5, // Number of rows
    COLS: 9, // Number of columns
    CELL_WIDTH: 80,
    CELL_HEIGHT: 100,
  },

  // Sun configuration
  SUN: {
    INITIAL: 50, // Starting sun
    DROP_INTERVAL: 10000, // Sky sun drop interval
    VALUE: 25, // Sun value
  },

  // Plant configuration...
  // Zombie configuration...
};
```

## 🎯 Game Flow

```
┌─────────────┐
│  BootScene  │  Load all game assets
└─────┬───────┘
      ↓
┌─────────────┐
│  MenuScene  │  Display game title and start button
└─────┬───────┘
      ↓ Click "Start Game"
┌─────────────┐
│  GameScene  │
│  ┌───────┐  │  1. Initialize systems (Grid, Sun)
│  │ init  │  │  2. Draw background and grid
│  └───┬───┘  │  3. Create UI (toolbar, cards)
│      ↓      │
│  ┌───────┐  │  4. Start sky sun drops
│  │ start │  │  5. Start zombie waves after 5s delay
│  └───┬───┘  │
│      ↓      │
│  ┌───────┐  │  6. Update plants, zombies, bullets each frame
│  │update │←─│  7. Collision detection
│  └───┬───┘  │  8. Check game over conditions
│      ↓      │
│  ┌───────┐  │
│  │gameOver│  │  Win / Lose → Show result → Restart
│  └───────┘  │
└─────────────┘
```

## 🔧 Development Guide

### Adding New Plants

1. Add plant configuration in `GameConfig.ts`:

```typescript
PLANTS: {
  // ...
  NEW_PLANT: {
    name: "New Plant",
    cost: 75,
    health: 150,
    // Other properties...
  },
}
```

2. Add type to `PlantType` enum:

```typescript
export enum PlantType {
  // ...
  NEW_PLANT = "new_plant",
}
```

3. Create new plant class in `entities/Plant.ts`:

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
    // Plant behavior logic
  }
}
```

4. Register plant card and placement logic in `GameScene.ts`.

### Adding New Zombies

Similar process to adding plants, refer to `entities/Zombie.ts` implementation.

## 📝 TODO

- [ ] Add more plant types (Snow Pea, Torchwood, etc.)
- [ ] Add more zombie types (Buckethead Zombie, Pole Vaulting Zombie, etc.)
- [ ] Implement plant card cooldown system
- [ ] Add sound effects and background music
- [ ] Implement level selection system
- [ ] Add shovel tool to remove plants
- [ ] Optimize mobile touch support
- [ ] Add game pause functionality

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes only. "Plants vs. Zombies" is a registered trademark of PopCap Games / EA.

---

<p align="center">
  Made with ❤️ using TypeScript + Phaser.js
</p>
