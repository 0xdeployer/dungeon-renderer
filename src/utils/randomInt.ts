import { random } from './random';

export const randomInt = (min: number, max: number): number =>
  min + Math.floor(random() * (max - min + 1));
