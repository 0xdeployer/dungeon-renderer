import { Dungeon, Cell, Sprite } from '../models';
import { randomInt } from '../utils';

export const randomize =
  (base: string, count: number) =>
  (d: Dungeon): Dungeon =>
    d.map(c =>
      c.type === base && c.variant === 'v0'
        ? new Cell(new Sprite(base, `v${randomInt(0, count)}`))
        : c,
    );
