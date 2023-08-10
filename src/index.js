
import Phaser from 'phaser';

import PlayScene from './PlayScene';
import PreloadScene from './PreloadScene';


const config = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: false,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [PreloadScene, PlayScene]
};

new Phaser.Game(config);
