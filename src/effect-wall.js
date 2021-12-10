import { EFFECT_WALL_SPRITES } from "./constants.js";
import Wall from "./wall.js";

export default class EffectWall extends Wall {
  constructor(args) {
    super(args);

    this.sprites = EFFECT_WALL_SPRITES;
  }
}
