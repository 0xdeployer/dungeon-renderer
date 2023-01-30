import { readFileSync } from 'fs';
import { Cell, Dungeon, Sprite } from '../models';

const spritesMapper = {
  X: 'ground',
  D: 'point',
  p: 'door',
  ' ': 'floor',
};

export const loadDungeon = (id: number): Dungeon => {
  let fileContent = readFileSync(`./dungeons/${id}.txt`).toString();
  let splitBy = -1 === fileContent.indexOf('\r\n') ? '\n' : '\r\n';
  return new Dungeon(
    fileContent.split(splitBy).map(row =>
      row.split('').map(c => {
        if (!{}.hasOwnProperty.call(spritesMapper, c)) {
          throw new Error('unrecognized char');
        }
        return new Cell(new Sprite(spritesMapper[c], 'v0'));
      }),
    ),
  );
};
