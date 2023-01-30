export class Sprite {
  type: string;
  variant: string;
  constructor(type: string, variant: string = 'v0') {
    this.type = type;
    this.variant = variant;
  }
}
