import { Dungeon, Cell, Sprite } from '../models';

export const prune =
  (type: string) =>
  (d: Dungeon): Dungeon =>
    d.map((c, n) =>
      c.type === type && n.countCompass('ground') >= 3
        ? new Cell(new Sprite('ground'))
        : c,
    );
