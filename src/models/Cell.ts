import { Sprite } from './Sprite';

export class Cell {
  base: Sprite;
  baseLayers: Sprite[];
  layers: Sprite[];
  constructor(base: Sprite, layers: Sprite[] = [], baseLayers: Sprite[] = []) {
    this.base = base;
    this.layers = layers;
    this.baseLayers = baseLayers;
  }

  get type() {
    return this.base.type;
  }
  get variant() {
    return this.base.variant;
  }
}
