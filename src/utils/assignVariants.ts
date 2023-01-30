import { Cell, Dungeon, Sprite } from '../models';
import { applyPattern } from './applyPattern';

const DEFAULT_TABLE = {
  XTXT: 't',
  XXTT: 'tr',
  TXTX: 'r',
  TXXT: 'br',
  TTXX: 'bl',
  XTTX: 'tl',
  TTTX: 'l',
  TXTT: 'r',
  TTXT: 'b',
  XTTT: 't',
};

export const assignVariants =
  (
    target: string,
    // map of type to label char
    labels: { [type: string]: string },
    // map of label patterns clockwise from top, to variant to assign
    table: { [neighbors: string]: string } = DEFAULT_TABLE,
  ) =>
  (d: Dungeon): Dungeon => {
    // neighboring cells clockwise staring from top
    // T = target, X = floor or innaccessible
    return applyPattern(
      target,
      labels,
      Object.entries(table).reduce(
        (memo, [pattern, variant]) => (
          (memo[pattern] = c => {
            return new Cell(
              new Sprite(target, variant),
              c.layers,
              c.baseLayers,
            );
          }),
          memo
        ),
        {},
      ),
    )(d);
  };
