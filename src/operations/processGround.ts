import { Dungeon, Sprite, Cell } from '../models';
import { random, randomize, randomInt } from '../utils';

const addRocks = (d: Dungeon): Dungeon =>
  d.map(c => {
    if (
      (c.type === 'surround' && random() < 0.02) ||
      (c.type === 'ground' && random() < 0.01)
    )
      return new Cell(c.base, [
        ...c.layers,
        new Sprite('rock', `v${randomInt(0, 2)}`),
      ]);
    return c;
  });

export const processGround = (d: Dungeon): Dungeon =>
  d.process(randomize('ground', 5), addRocks);
