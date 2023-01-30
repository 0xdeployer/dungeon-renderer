import { Cell, Dungeon } from '../models';
import { random } from './random';

export const sparsify =
  (type: string, to: Cell, probability: number) =>
  (d: Dungeon): Dungeon =>
    d.map(c => (c.type === type && random() < probability ? to : c));
