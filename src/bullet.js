import { BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPRITES } from "./constants.js";
import { getAxisForDirection, getValueForDirection } from "./utils.js";
import GameObject from "./game-object.js";
import Explosion from "./explosion.js";
export default class Bullet extends GameObject {
  constructor({ ship, direction, speed, ...args }) {
    super(args);
    this.type = "bullet";
    this.width = BULLET_WIDTH;
    this.height = BULLET_HEIGHT;
    this.sprites = BULLET_SPRITES;
    this.direction = direction;
    this.speed = speed;
    this.ship = ship;
    this.explosion = null;
  }
  get sprite() {
    return this.sprites[this.direction];
  }

  get isExploding() {
    return Boolean(this.explosion);
  }

  update({ world }) {
    if (this.isExploding) {
      if (this.explosion.isDestroyed) return this._destroy(world);

      return;
    }

    const axis = getAxisForDirection(this.direction);
    const value = getValueForDirection(this.direction);

    this._move(axis, value);

    const isOutOfBorder = world.isOutOfBorder(this);
    const collision = world.getCollision(this);
    const shouldExplode = collision && this._collide(collision.objects);

    if (isOutOfBorder || shouldExplode) {
      this._explode(world);
    }
  }

  _move(axis, value) {
    this[axis] += value * this.speed;
  }

  _destroy(world) {
    this.ship.bullet = null;
    this.explosion = null;
    world.objects.delete(this);
  }

  _collide(objects) {
    let shouldExplode = false;

    for (const object of objects) {
      if (object === this.ship || object === this.explosion) continue;

      object.hit(this);
      shouldExplode = true;
    }

    return shouldExplode;
  }

  _explode(world) {
    const [x, y] = this._getExplosionStartingPosition();

    this.speed = 0;
    this.explosion = new Explosion({ x, y });

    world.objects.add(this.explosion);
  }

  _getExplosionStartingPosition() {
    switch (this.direction) {
      case GameObject.Direction.UP:
        return [this.left - 10, this.top - 12];
      case GameObject.Direction.RIGHT:
        return [this.right - 16, this.top - 12];
      case GameObject.Direction.DOWN:
        return [this.left - 10, this.bottom - 16];
      case GameObject.Direction.LEFT:
        return [this.left - 16, this.top - 12];
    }
  }
}
