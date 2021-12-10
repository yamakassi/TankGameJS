import World from "./world.js";

export default class Game {
  constructor({ input, view, levels }) {
    this.input = input;
    this.view = view;
    this.levels = levels;
    this.player1 = null;
    
    this.world = null;
    this.worldIndex = 0;
    this.frames = 0;
    this.lastFrame = 0;

    this.loop = this.loop.bind(this);
  }

  async init() {
    this.view.init();
  }

  start() {
    this.world = new World(this.levels[this.worldIndex]);

    requestAnimationFrame(this.loop);
  }

  loop(currentFrame) {
    const frameDelta = currentFrame - this.lastFrame;

    this.world.update(this.input, frameDelta);
    this.view.update(this.world);
    this.frames = 0;

    this.lastFrame = currentFrame;

    requestAnimationFrame(this.loop);
  }
}
