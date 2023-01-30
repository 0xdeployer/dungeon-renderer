import { Dungeon, Cell, Sprite } from '../models';
import {
  random,
  prune,
  randomize,
  pruneBridges,
  assignVariants,
} from '../utils';

const addSurround =
  (probability: number = 1) =>
  (d: Dungeon): Dungeon =>
    d.map((c, n) =>
      c.type === 'ground' &&
      (n.count('wall') > 0 ||
        (n.count('surround') > 1 && random() < probability))
        ? new Cell(new Sprite('surround'))
        : c,
    );

export const processSurround = (dungeon: Dungeon): Dungeon => {
  let d = dungeon.process(addSurround(1));
  for (let i = 0; i < Math.ceil(dungeon.width / 36); i++) {
    d = d.process(addSurround(0.8), prune('surround'));
  }
  return d.process(
    pruneBridges('surround'),
    prune('surround'),
    assignVariants('surround', {
      wall: 'T',
      ground: 'X',
      surround: 'T',
      null: 'T',
    }),
    randomize('surround', 4),
  );
};
