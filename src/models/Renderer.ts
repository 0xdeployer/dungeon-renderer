import { createWriteStream } from 'fs';
import { Canvas, createCanvas, Image, loadImage } from 'canvas';
import { Dungeon } from './Dungeon';
import { SpriteMap } from './SpriteMap';

// size of dungeon cell in pixels
const CELL_SIZE = 8;

// load sprite sheets
const promisedImages = [];
for (let i = 1; i <= 7; i++)
  promisedImages.push(loadImage(`./sprites/0${i}.png`));

export class Renderer {
  dungeon: Dungeon;
  spriteMap: SpriteMap;
  canvas: Canvas;
  image: Promise<Image>;
  constructor(dungeon: Dungeon, spriteMap: SpriteMap, spriteSheet: number) {
    this.dungeon = dungeon;
    this.spriteMap = spriteMap;
    this.canvas = createCanvas(
      dungeon.width * CELL_SIZE,
      dungeon.height * CELL_SIZE,
    );
    this.image = promisedImages[spriteSheet];
  }

  // draw dungeon to canvas
  async draw(): Promise<void> {
    const image = await this.image;
    const ctx = this.canvas.getContext('2d');

    this.dungeon.forEach((cell, _neighbors, x, y) => {
      [...cell.baseLayers, cell.base, ...cell.layers].forEach(sprite => {
        const [sx, sy] = this.spriteMap.coordinates(sprite);
        ctx.drawImage(
          image,
          sx * CELL_SIZE,
          sy * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
        );
      });
    });
  }

  // draw dungeon to canvas
  async textOutput(): Promise<any> {
    const image = await this.image;
    const ctx = this.canvas.getContext('2d');
    const output = [];
    this.dungeon.forEach((cell, _neighbors, x, y) => {
      [...cell.baseLayers, cell.base, ...cell.layers].forEach(sprite => {
        const [sx, sy] = this.spriteMap.coordinates(sprite);
        output[y] ||= [];
        output[y][x] = {
          sprite,
          sx,
          sy,
          x,
          y,
        };

        // ctx.drawImage(
        //   image,
        //   sx * CELL_SIZE,
        //   sy * CELL_SIZE,
        //   CELL_SIZE,
        //   CELL_SIZE,
        //   x * CELL_SIZE,
        //   y * CELL_SIZE,
        //   CELL_SIZE,
        //   CELL_SIZE,
        // );
      });
    });
    return output;
  }

  // draw dungeon to canvas and write to png file at path
  async render(path: string): Promise<any> {
    await this.draw();
    return new Promise(resolve => {
      // const out = createWriteStream(path);
      resolve(this.canvas.toBuffer('image/png'));
      const stream = this.canvas.createPNGStream();
      // stream.pipe(out);
      // out.on('finish', resolve);
    });
  }
}
