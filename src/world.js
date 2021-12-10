import { WORLD_SIZE, TILE_SIZE } from './constants.js';
import Base from './base.js';
import MetalWall from './metal-wall.js';
import EffectWall from './effect-wall.js';
import PlayerShip from './player-ship.js';
import EnemyShip from './enemy-ship.js';
export default class World {
    static WallType = {
        METAL_WALL: 1,
        EFFECT_WALL: 2,
        SUN: 3,
        BLACK_HOLE: 4,        
    };
    static createObject(type, args) {
        switch (type) {
          case World.WallType.METAL_WALL:
            return new MetalWall(args);
          case World.WallType.EFFECT_WALL:
            return new EffectWall(args);
        }
    }
    static createWall(map) {
        const objects = [];
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
                const value = map[j][i];
                if (value) {
                    const object = World.createObject(value, {
                        x: i * TILE_SIZE,
                        y: j * TILE_SIZE
                    });
                    objects.push(object);
                }
            }
        }
        return objects;
    }
    static createEnemies(types) {
        return types.map(type => new EnemyShip({ type }));
    }
    constructor(data) {
        this.base = new Base();
        this.playerShip = new PlayerShip();
        this.enemies = World.createEnemies(data.enemies);
        this.wallType = World.createWall(data.map);
        this.enemyShipCount = 0;
        this.enemyShipTimer = 0;
        this.enemyShipPositionIndex = 0;


        this.objects = new Set([
            this.base,
            this.playerShip,
            ...this.wallType
        ]);

    }

    get width() {

        return WORLD_SIZE;
    }
    get height() {
        return WORLD_SIZE;
    }
    get top() {
        return 0;
    }
    get right() {
        return this.width;
    }
    get bottom() {
        return this.height;
    }
    get left() {
        return 0;
    }
    update(input, frameDelta) {
        const state = {
            input,
            frameDelta,
            world: this
        };

        if (this._shouldAddEnemyShip(frameDelta)) {
            this._addEnemyShip();
        }

        this.objects.forEach(object => object.update(state));
    }         
            
    

          
          
            
    

          
  
    isOutOfBorder(object) {
        return (
            object.top < this.top ||
            object.right > this.right ||
            object.bottom > this.bottom ||
            object.left < this.left
        );
    }
    hasCollision(object) {
        const collision = this.getCollision(object);
        return Boolean(collision);
    }
    getCollision(object) {
        const collisionObjects = this._getCollisionObjects(object);
        if (collisionObjects.size > 0) {
            return { objects: collisionObjects };
        }
    }
    _getCollisionObjects(object) {
        const objects = new Set();
        for (const other of this.objects) {
            if (other !== object && this._haveCollision(object, other)) {
                objects.add(other);
            }
        }
        return objects;
    }
    _haveCollision(a, b) {
        return (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );
    }

    _shouldAddEnemyShip(frameDelta) {
        this.enemyShipTimer += frameDelta;

        return this.enemyShipTimer > 1000 && this.enemyShipCount < 3;
    }

    _addEnemyShip() {
        const ship = this.enemies.shift();

        if (ship) {
            ship.setPosition(this.enemyShipPositionIndex);

            this.enemyShipCount += 1;
            this.enemyShipTimer = 0;
            this.enemyShipPositionIndex = (this.enemyShipPositionIndex + 1) % 3;

            this.objects.add(ship);
        }
    }

    _removeEnemyShip(enemyShip) {
        this.objects.delete(enemyShip);
        this.enemyShipCount -= 1;
    }
}