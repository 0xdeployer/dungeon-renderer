import { Dungeon, Cell, Sprite } from '../models';
import {
  random,
  prune,
  randomize,
  pruneBridges,
  assignVariants,
} from '../utils';

const addPlateau =
  (edgeProbability: number, plateauProbability: number) =>
  (d: Dungeon): Dungeon =>
    d.map((c, n) =>
      c.type === 'ground' &&
      n.count('surround') === 0 &&
      ((n.count(null) > 0 && random() < edgeProbability) ||
        (n.count('plateau') > 1 && random() < plateauProbability))
        ? new Cell(new Sprite('plateau'), [], [new Sprite('ground')])
        : c,
    );

export const seedPlateau =
  (probability: number) =>
  (d: Dungeon): Dungeon =>
    d.map((c, n) =>
      c.type === 'ground' && n.count('ground') === 8 && random() < probability
        ? new Cell(new Sprite('plateau'), [], [new Sprite('ground')])
        : c,
    );

export const processPlateau = (dungeon: Dungeon): Dungeon => {
  let d = dungeon.process(
    addPlateau(0.2, 0),
    addPlateau(0, 1),
    seedPlateau(0.01),
    addPlateau(0, 0.8),
    prune('plateau'),
  );
  for (let i = 0; i < Math.floor(dungeon.width / 8); i++) {
    d = d.process(seedPlateau(0.01), addPlateau(0, 0.8), prune('plateau'));
  }
  return d.process(
    pruneBridges('plateau'),
    prune('plateau'),
    prune('plateau'),
    assignVariants(
      'plateau',
      {
        ground: 'T',
        plateau: 'X',
        null: 'X',
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
        TXXTXXXX: 'tr',
        XTXXTXXX: 'br',
        XXTXXTXX: 'tl',
        XXXTXXTX: 'bl',
        XXXXTXXT: 'bl',
        TXXXXTXX: 'tl',
        XTXXXXTX: 'br',
        XXTXXXXT: 'tr',
      },
    ),
    randomize('plateau', 5),
  );
};
