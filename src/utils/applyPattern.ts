import { Dungeon, Cell } from '../models';

export const applyPattern =
  (
    target: string,
    // map of type to label char
    labels: { [type: string]: string },
    // map of label patterns clockwise from top, to variant to assign
    table: { [neighbors: string]: (c: Cell) => Cell },
    nonMatch?: (c: Cell) => Cell,
  ) =>
  (d: Dungeon): Dungeon => {
    // neighboring cells clockwise staring from top
    // T = target, X = floor or innaccessible
    return d.map((c, n) => {
      const key = n
        .all()
        .map(c => (c === null ? labels.null : labels[c.base.type]) ?? '.')
        .join('');
      const compassKey = n
        .compass()
        .map(c => (c === null ? labels.null : labels[c.base.type]) ?? '.')
        .join('');

      const tableEntry = table[key] || table[compassKey];
      if (c.base.type === target) {
        if (tableEntry !== undefined) return tableEntry(c);
        if (nonMatch !== undefined) return nonMatch(c);
      }
      return c;
    });
  };
