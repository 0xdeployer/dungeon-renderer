import { Dungeon, Cell, Sprite } from '../models';
import { applyPattern, random, randomInt, sparsify } from '../utils';

const avoidSurround = (d: Dungeon): Dungeon =>
  d.map((c, n) =>
    c.type === 'boulder' && n.count('surround') > 0
      ? new Cell(new Sprite('ground'))
      : c,
  );

const trimBoulders = (d: Dungeon): Dungeon => {
  let current = d;
  let changed = true;
  const ground = new Cell(new Sprite('ground'));
  while (changed) {
    changed = false;
    current = current.map((c, n) =>
      c.type === 'boulder'
        ? [
            [n.t(), n.tr(), n.r()],
            [n.r(), n.br(), n.b()],
            [n.b(), n.bl(), n.l()],
            [n.l(), n.tl(), n.t()],
          ].some(arr => arr.every(nc => nc?.type === 'boulder'))
          ? c
          : ground
        : c,
    );
  }
  return current;
};

const assignVariants = (d: Dungeon): Dungeon => {
  // copy cells
  const cells = d.cells.map(r => [...r]);

  // check if a cell is boulder by x,y coordinates
  const b = (x: number, y: number): boolean => {
    const row = cells[y];
    if (row === undefined) return false;
    const cell = row[x];
    if (cell === undefined) return false;
    return cell.type === 'boulder' && cell.variant === 'v0';
  };
  // assign a variant to a cell
  const v = (x: number, y: number, variant: string): void => {
    cells[y][x] = new Cell(
      new Sprite('boulder', variant),
      [],
      [new Cell(new Sprite('ground'))],
    );
  };

  for (let y = 0; y < d.height; y++) {
    for (let x = 0; x < d.width; x++) {
      if (b(x, y)) {
        let w = 1;
        while (b(x + w, y)) w++;
        let h = 1;
        while (b(x, y + h)) h++;

        if (w === 2 && h === 2) {
          const vn = `v${randomInt(0, 1)}_2x2`;
          v(x, y, `${vn}_tl`);
          v(x + 1, y, `${vn}_tr`);
          v(x, y + 1, `${vn}_bl`);
          v(x + 1, y + 1, `${vn}_br`);
        } else if (w > 2) {
          v(x, y, 'v0_h_tl');
          v(x, y + 1, 'v0_h_bl');
          for (let i = 1; i < w - 1; i++) {
            if (i + 3 < w && random() < 0.3) {
              v(x + i, y, 'v0_h_tr');
              v(x + i, y + 1, 'v0_h_br');
              i++;
              v(x + i, y, 'v0_h_tl');
              v(x + i, y + 1, 'v0_h_bl');
            } else {
              const vn = randomInt(0, 1);
              v(x + i, y, `v0_h_t${vn}`);
              v(x + i, y + 1, `v0_h_b${vn}`);
            }
          }
          v(x + w - 1, y, 'v0_h_tr');
          v(x + w - 1, y + 1, 'v0_h_br');
        } else {
          v(x, y, 'v0_v_tl');
          v(x + 1, y, 'v0_v_tr');
          for (let i = 1; i < h - 1; i++) {
            if (i + 3 < h && random() < 0.4) {
              v(x, y + i, 'v0_v_bl');
              v(x + 1, y + i, 'v0_v_br');
              i++;
              v(x, y + i, 'v0_v_tl');
              v(x + 1, y + i, 'v0_v_tr');
            } else {
              const vn = randomInt(0, 1);
              v(x, y + i, `v0_v_l${vn}`);
              v(x + 1, y + i, `v0_v_r${vn}`);
            }
          }
          v(x, y + h - 1, 'v0_v_bl');
          v(x + 1, y + h - 1, 'v0_v_br');
        }
      }
    }
  }
  return new Dungeon(cells);
};

export const processBoulders = (dungeon: Dungeon): Dungeon => {
  const boulder = new Cell(new Sprite('boulder'), [], [new Sprite('ground')]);
  const ground = new Cell(new Sprite('ground'));
  return dungeon.process(
    applyPattern(
      'ground',
      { null: 'N', ground: 'G', plateau: 'N' },
      {
        NGGN: () => boulder,
        NGGG: () => boulder,
        GNGG: () => boulder,
        GGNG: () => boulder,
        GGGN: () => boulder,
      },
    ),
    applyPattern(
      'ground',
      { boulder: 'B', plateau: 'B', ground: 'G' },
      {
        BGGG: () => boulder,
        GBGG: () => boulder,
        GGBG: () => boulder,
        GGGB: () => boulder,
      },
    ),
    avoidSurround,
    sparsify('boulder', ground, 0.2),
    trimBoulders,
    assignVariants,
  );
};
