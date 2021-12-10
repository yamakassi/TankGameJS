import { NUMBER_OF_UNITS, UNIT_SIZE, TILE_SIZE } from "./constants.js";
export default class View {
  constructor(canvas, sprite) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.sprite = sprite;
  }

  async init() {
    await this.sprite.load();
  }

  update(world) {
    this.clearScreen();
    this.renderStage(world);
   
  }

  renderStage(world) {
    for (const object of world.objects) {
      const { x, y, width, height, sprite } = object;

      if (!sprite) return;

      this.context.drawImage(
        this.sprite.image,
        ...sprite,

        x,
        y,
        width,
        height
      );
      if (object.debug) {
        this.context.strokeStyle = "#ff0000";
        this.context.lineWidth = 2;
        this.context.strokeRect(x + 1, y + 1, width - 2, height - 2);
        object.debug = false;
      }
    }
  }
  
  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
