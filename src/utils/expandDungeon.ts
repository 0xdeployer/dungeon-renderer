import { Dungeon, Sprite, Cell } from '../models';

export const expandDungeon =
  (amount: number) =>
  (dungeon: Dungeon): Dungeon => {
    const cells = [];
    const width = amount * 2 + dungeon.width;
    const ground = new Cell(new Sprite('ground'));
    const groundRow = new Array(width).fill(ground);
    const edge = new Array(amount).fill(ground);
    for (let i = 0; i < amount; i++) {
      cells.push(groundRow);
    }
    cells.push(...dungeon.cells.map(row => [...edge, ...row, ...edge]));
    for (let i = 0; i < amount; i++) {
      cells.push(groundRow);
    }
    return new Dungeon(cells);
  };
