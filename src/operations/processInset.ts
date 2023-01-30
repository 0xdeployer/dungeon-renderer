import { Dungeon, Cell, Sprite } from '../models';
import { applyPattern, assignVariants } from '../utils';

// draw edge of floor next to wells
const addInsetFill = (d: Dungeon): Dungeon => {
  const cell = () => new Cell(new Sprite('insetFill', 'v0'));
  return applyPattern(
    'floor',
    { floor: 'X', wall: 'T', point: 'X', door: 'X', insetFill: 'T' },
    {
      XTXT: cell,
      TXTX: cell,
      XTTT: cell,
      TXTT: cell,
      TTXT: cell,
      TTTX: cell,
      TTTT: cell,
    },
  )(d);
};

// draw edge of floor next to wells
const addInset = (d: Dungeon): Dungeon =>
  d.map((c, n) =>
    c.type === 'floor' && n.count('wall') + n.count('insetFill') > 0
      ? new Cell(new Sprite('inset'))
      : c,
  );

export const processInset = (dungeon: Dungeon): Dungeon =>
  dungeon.process(
    addInsetFill,
    addInsetFill,
    addInset,
    assignVariants(
      'inset',
      {
        wall: 'T',
        floor: 'X',
        inset: 'X',
        door: 'X',
        point: 'X',
        insetFill: 'T',
      },
      {
        TXXX: 't',
        TTXX: 'tr',
        XTXX: 'r',
        XTTX: 'br',
        XXTX: 'b',
        XXTT: 'bl',
        XXXT: 'l',
        TXXT: 'tl',
        XTXXXXXX: 'ctl',
        XXXTXXXX: 'cbr',
        XXXXXTXX: 'cbl',
        XXXXXXXT: 'ctr',
      },
    ),
  );
