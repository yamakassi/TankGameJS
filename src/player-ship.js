import {
  Keys,
  PLAYER1_SHIP_POSITION,
  PLAYER1_SHIP_SPRITES,
  SHIP_SPEED,
} from "./constants.js";
import {
  getDirectionForKeys,
  getAxisForDirection,
  getValueForDirection,
} from "./utils.js";
import Ship from "./ship.js";
export default class PlayerShip extends Ship {
  constructor(args) {
    super(args);

    this.type = "playerShip";
    this.x = PLAYER1_SHIP_POSITION[0];
    this.y = PLAYER1_SHIP_POSITION[1];
    this.direction = Ship.Direction.UP;

    this.speed = SHIP_SPEED;
    this.sprites = PLAYER1_SHIP_SPRITES;
  }
  update({ input, frameDelta, world }) {
    if (input.has(Keys.UP, Keys.RIGHT, Keys.DOWN, Keys.LEFT)) {
      const direction = getDirectionForKeys(input.keys);
      const axis = getAxisForDirection(direction);
      const value = getValueForDirection(direction);
      this._turn(direction);
      this._move(axis, value);
     
      const isOutOfBorder = world.isOutOfBorder(this);
      const hasCollision = world.hasCollision(this);
      if (isOutOfBorder || hasCollision) {
        this._move(axis, -value);
      }
    }
    
    
    
    
    if (input.keys.has(Keys.SPACE)) {
      this._fire();
      if (this.bullet) {
        world.objects.add(this.bullet);
      }
    }
  }
}
