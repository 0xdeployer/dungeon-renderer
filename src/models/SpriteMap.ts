import { Sprite } from './Sprite';

export class SpriteMap {
  map: {
    [type: string]: { [variant: string]: [x: number, y: number] };
  };
  constructor(map: {
    [type: string]: { [variant: string]: [x: number, y: number] };
  }) {
    this.map = map;
  }

  coordinates(sprite: Sprite): [x: number, y: number] {
    if (!this.map[sprite.type])
      throw new Error(`no sprite mapped for type ${sprite.type}`);
    if (!this.map[sprite.type][sprite.variant])
      throw new Error(
        `no sprite mapped for type ${sprite.type}, variant ${sprite.variant}`,
      );
    return this.map[sprite.type][sprite.variant];
  }
}
