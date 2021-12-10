import {
  TILE_SIZE,
  SHIP_WIDTH,
  SHIP_HEIGHT,
  SHIP_SPEED,
  SHIP_TURN_GAP,
} from "./constants.js";
import { getAxisForDirection } from "./utils.js";
import GameObject from "./game-object.js";
import Bullet from "./bullet.js";
export default class Ship extends GameObject {
  constructor(args) {
    super(args);
    this.width = SHIP_WIDTH;
    this.height = SHIP_HEIGHT;
    this.speed = SHIP_SPEED;
    this.bulletSpeed = 4;
    this.bullet = null;
    this.isDestroyed = false;
  }

  get sprite() {
    return this.sprites[this.direction * 2 + this.animationFrame];
  }
  _turn(direction) {
    const prevDirection = this.direction;
    this.direction = direction;
    if (
      direction === GameObject.Direction.UP ||
      direction === GameObject.Direction.DOWN
    ) {
      if (prevDirection === GameObject.Direction.RIGHT) {
        const value = TILE_SIZE - (this.x % TILE_SIZE);
        if (value <= SHIP_TURN_GAP) {
          this.x += value;
        }
      } else if (prevDirection === GameObject.Direction.LEFT) {
        const value = this.x % TILE_SIZE;
        if (value <= SHIP_TURN_GAP) {
          this.x -= value;
        }
      }
    } else {
      if (prevDirection === GameObject.Direction.UP) {
        const value = this.y % TILE_SIZE;
        if (value <= SHIP_TURN_GAP) {
          this.y -= value;
        }
      } else if (prevDirection === GameObject.Direction.DOWN) {
        const value = TILE_SIZE - (this.y % TILE_SIZE);
        if (value <= SHIP_TURN_GAP) {
          this.y += value;
        }
      }
    }
  }
  _move(axis, value) {
      this[axis] += value * this.speed;
          this.animationFrame ^= 1;
  }
  _fire() {
    if (!this.bullet) {
      const [x, y] = this._getBulletStartingPosition();
      const bullet = new Bullet({
        x,
        y,
        ship: this,
        direction: this.direction,
        speed: this.bulletSpeed,
      });
      this.bullet = bullet;
    }
  }
  
  _getBulletStartingPosition() {
    switch (this.direction) {
      case Ship.Direction.UP:
        return [this.left + 10, this.top];
      case Ship.Direction.RIGHT:
        return [this.right - 8, this.top + 12];
      case Ship.Direction.DOWN:
        return [this.left + 10, this.bottom - 8];
      case Ship.Direction.LEFT:
        return [this.left, this.top + 12];
    }
  }
}
