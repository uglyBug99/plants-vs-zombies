import { GAME_CONFIG } from '../config/GameConfig';

/**
 * 网格系统 - 管理草坪格子的占用状态
 */
export class GridSystem {
  private grid: boolean[][];

  constructor() {
    const { ROWS, COLS } = GAME_CONFIG.GRID;
    
    // 初始化网格，全部为空
    this.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
  }

  /**
   * 检查指定格子是否被占用
   */
  public isOccupied(row: number, col: number): boolean {
    if (!this.isValidPosition(row, col)) return true;
    return this.grid[row][col];
  }

  /**
   * 设置格子占用状态
   */
  public setOccupied(row: number, col: number, occupied: boolean): void {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = occupied;
    }
  }

  /**
   * 检查位置是否有效
   */
  private isValidPosition(row: number, col: number): boolean {
    const { ROWS, COLS } = GAME_CONFIG.GRID;
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
  }

  /**
   * 获取格子的世界坐标
   */
  public getCellPosition(row: number, col: number): { x: number; y: number } {
    const { OFFSET_X, OFFSET_Y, CELL_WIDTH, CELL_HEIGHT } = GAME_CONFIG.GRID;
    return {
      x: OFFSET_X + col * CELL_WIDTH + CELL_WIDTH / 2,
      y: OFFSET_Y + row * CELL_HEIGHT + CELL_HEIGHT / 2,
    };
  }

  /**
   * 根据世界坐标获取格子位置
   */
  public getGridPosition(worldX: number, worldY: number): { row: number; col: number } | null {
    const { OFFSET_X, OFFSET_Y, CELL_WIDTH, CELL_HEIGHT, ROWS, COLS } = GAME_CONFIG.GRID;

    const col = Math.floor((worldX - OFFSET_X) / CELL_WIDTH);
    const row = Math.floor((worldY - OFFSET_Y) / CELL_HEIGHT);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      return { row, col };
    }
    return null;
  }

  /**
   * 重置网格
   */
  public reset(): void {
    const { ROWS, COLS } = GAME_CONFIG.GRID;
    this.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
  }

  /**
   * 获取指定行的所有空位
   */
  public getEmptyCellsInRow(row: number): number[] {
    const emptyCols: number[] = [];
    const { COLS } = GAME_CONFIG.GRID;

    for (let col = 0; col < COLS; col++) {
      if (!this.grid[row][col]) {
        emptyCols.push(col);
      }
    }
    return emptyCols;
  }
}
