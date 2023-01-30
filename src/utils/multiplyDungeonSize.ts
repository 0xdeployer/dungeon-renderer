import { Dungeon } from '../models';

export const multiplyDungeonSize =
  (multiplier: number) =>
  (dungeon: Dungeon): Dungeon => {
    const cells = [];
    dungeon.cells.forEach(row => {
      const multipliedRow = row.reduce((memo, cell) => {
        for (let i = 0; i < multiplier; i++) {
          memo.push(cell);
        }
        return memo;
      }, []);
      for (let i = 0; i < multiplier; i++) {
        cells.push(multipliedRow);
      }
    });
    return new Dungeon(cells);
  };
