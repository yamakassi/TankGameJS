import {
  ENEMY_SHIP_START_POSITIONS,
  ENEMY_SHIP_SPRITES,
  ENEMY_SHIP_SPEED,
  ENEMY_SHIP_TURN_DELAY,
} from "./constants.js";
import {
  getDirectionForKeys,
  getAxisForDirection,
  getValueForDirection,
} from "./utils.js";
import Ship from "./ship.js";

export default class EnemyShip extends Ship {
  static createRandom() {
    const random = Math.floor(Math.random() * 3);
    const [x, y] = ENEMY_SHIP_START_POSITIONS[random];
    const sprites = ENEMY_SHIP_SPRITES[0];

    return new EnemyShip({ x, y, sprites });
  }

  constructor(args) {
    super(args);

    this.type = "enemyShip";
    this.direction = Ship.Direction.DOWN;
    this.x = 0;
    this.y = 0;
    this.speed = ENEMY_SHIP_SPEED;
    this.sprites = ENEMY_SHIP_SPRITES[0];

    this.turnTimer = 0;
  }

  setPosition(positionIndex) {
    this.x = ENEMY_SHIP_START_POSITIONS[positionIndex][0];
    this.y = ENEMY_SHIP_START_POSITIONS[positionIndex][1];
  }

  update({ world, frameDelta }) {
    if (this.isDestroyed) {
      world.enemyShipCount -= 1;
      console.log(world.enemyShipCount);
      world.objects.delete(this);
    }

    const direction = this.direction;
    const axis = getAxisForDirection(direction);
    const value = getValueForDirection(direction);

    this._move(axis, value);
    

    const isOutOfBorder = world.isOutOfBorder(this);
    const hasCollision = world.hasCollision(this);

    if (isOutOfBorder || hasCollision) {
      this._move(axis, -value);

      if (this._shouldTurn(frameDelta)) {
        this._turnRandomly();
      }
    }
  }

  hit(bullet) {
    if (this.isDestroyed) return;

    this.isDestroyed = true;
  }

  _shouldTurn(frameDelta) {
    this.turnTimer += frameDelta;

    return this.turnTimer > ENEMY_SHIP_TURN_DELAY;
  }

  _turnRandomly() {
    const randomDirection = Math.floor(Math.random() * 4);

    this.turnTimer = 0;
    this._turn(randomDirection);
  }
}
