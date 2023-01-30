import { Cell } from './Cell';
import { Dungeon } from './Dungeon';

// a utility class making it easy to inspect the neighbors of a specific dungeon
// cell
export class Neighbors {
  dungeon: Dungeon;
  x: number;
  y: number;
  constructor(dungeon: Dungeon, x: number, y: number) {
    this.dungeon = dungeon;
    this.x = x;
    this.y = y;
  }
  // top
  t(): Cell | null {
    return this.dungeon.cell(this.x, this.y - 1);
  }
  // top right
  tr(): Cell | null {
    return this.dungeon.cell(this.x + 1, this.y - 1);
  }
  // right
  r(): Cell | null {
    return this.dungeon.cell(this.x + 1, this.y);
  }
  // bottom right
  br(): Cell | null {
    return this.dungeon.cell(this.x + 1, this.y + 1);
  }
  // bottom
  b(): Cell | null {
    return this.dungeon.cell(this.x, this.y + 1);
  }
  // bottom left
  bl(): Cell | null {
    return this.dungeon.cell(this.x - 1, this.y + 1);
  }
  // left
  l(): Cell | null {
    return this.dungeon.cell(this.x - 1, this.y);
  }
  // top left
  tl(): Cell | null {
    return this.dungeon.cell(this.x - 1, this.y - 1);
  }
  // an array of compas neighboring cells
  compass(): (Cell | null)[] {
    return [this.t(), this.r(), this.b(), this.l()];
  }
  // an array of all neighboring cells
  all(): (Cell | null)[] {
    return [
      this.t(),
      this.tr(),
      this.r(),
      this.br(),
      this.b(),
      this.bl(),
      this.l(),
      this.tl(),
    ];
  }
  // count the occurance of a type in neighboring cells
  count(type: string | null): number {
    return this.all().reduce(
      (count, cell) =>
        (type === null && cell === null) || cell?.base.type === type
          ? count + 1
          : count,
      0,
    );
  }
  // count the occurance of a type in compass neighboring cells
  countCompass(type: string | null): number {
    return this.compass().reduce(
      (count, cell) =>
        (type === null && cell === null) || cell?.base.type === type
          ? count + 1
          : count,
      0,
    );
  }
}
