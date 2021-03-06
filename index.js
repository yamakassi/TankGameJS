import Input from './src/input.js';
import View from './src/view.js';
import Game from './src/game.js';
import Sprite from './src/sprite.js';

    
        
          
import levels from './data/levels.js';
const canvas = document.querySelector('canvas');
const sprite = new Sprite('./image/sprite.png');

const game = new Game({
    input: new Input(),
    view: new View(canvas, sprite),
    levels
}); 
game.init().then(() => game.start());