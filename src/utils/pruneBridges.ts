import { Dungeon, Cell, Sprite } from '../models';

export const pruneBridges =
  (type: string) =>
  (d: Dungeon): Dungeon =>
    d.map((c, n) =>
      c.type === type &&
      ((n.t()?.type === 'ground' && n.b()?.type === 'ground') ||
        (n.l()?.type === 'ground' && n.r()?.type === 'ground') ||
        (n.tl()?.type === 'ground' && n.br()?.type === 'ground') ||
        (n.bl()?.type === 'ground' && n.tr()?.type === 'ground'))
        ? new Cell(new Sprite('ground'))
        : c,
    );
