import { Cell, Dungeon } from '../models';

export const contract =
  (type: string, to: Cell) =>
  (d: Dungeon): Dungeon => {
    // copy cells
    const cells = d.cells.map(r => [...r]);
    for (let y = 0; y < d.height; y++) {
      for (let x = 0; x < d.width; x++) {
        if (cells[y][x].type === type && cells[y][x + 1]?.type === type) {
          cells[y][x] = to;
          cells[y + 1][x] = to;
          cells[y + 2][x] = to;
          cells[y][x + 1] = to;
          cells[y + 2][x + 1] = to;
          cells[y][x + 2] = to;
          cells[y + 1][x + 2] = to;
          cells[y + 2][x + 2] = to;
        }
      }
    }
    return new Dungeon(cells);
  };
