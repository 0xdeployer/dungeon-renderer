import { Dungeon, Cell, Sprite } from '../models';
import { assignVariants } from '../utils';

const addWalls = (d: Dungeon): Dungeon =>
  d.map((c, n) =>
    (c.type === 'ground' &&
      n.count('floor') + n.count('point') + n.count('door') > 0) ||
    (['floor', 'door', 'point'].includes(c.type) && n.count(null) > 0)
      ? new Cell(new Sprite('wall'))
      : c,
  );

export const processWalls = (dungeon: Dungeon): Dungeon =>
  dungeon.process(
    addWalls,
    assignVariants(
      'wall',
      {
        wall: 'T',
        door: 'X',
        point: 'X',
        floor: 'X',
        ground: 'X',
        null: 'X',
      },
      {
        XXXX: 'XXXX',
        TXXX: 'TXXX',
        XTXX: 'XTXX',
        XXTX: 'XXTX',
        XXXT: 'XXXT',
        XXTT: 'XXTT',
        XTXT: 'XTXT',
        XTTX: 'XTTX',
        TXXT: 'TXXT',
        TXTX: 'TXTX',
        TTXX: 'TTXX',
        XTTT: 'XTTT',
        TXTT: 'TXTT',
        TTXT: 'TTXT',
        TTTX: 'TTTX',
        TTTT: 'TTTT',
      },
    ),
  );
