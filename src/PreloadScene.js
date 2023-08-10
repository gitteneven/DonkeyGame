
import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.audio('jump', 'assets/jump.m4a');
    this.load.audio('hit', 'assets/hit.m4a');
    this.load.audio('reach', 'assets/reach.m4a');

    this.load.image('ground', 'assets/ground_smaller.png');
    this.load.image('donkey-idle', 'assets/donkey_idle.png');
    this.load.image('donkey-hurt', 'assets/donkey_hurt.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('game-over', 'assets/game-over.png');
    this.load.image('cloud', 'assets/pink-cloud.png');

    this.load.spritesheet('star', 'assets/stars.png', {
      frameWidth: 9, frameHeight: 9
    });

    this.load.spritesheet('moon', 'assets/moon.png', {
      frameWidth: 20, frameHeight: 40
    });

    this.load.spritesheet('dino', 'assets/dino-run.png', {
      frameWidth: 88,
      frameHeight: 94
    })

    this.load.spritesheet('dino-down', 'assets/dino-down.png', {
      frameWidth: 118,
      frameHeight: 94
    })

    this.load.spritesheet('enemy-bird', 'assets/enemy-bird.png', {
      frameWidth: 92,
      frameHeight: 77
    })

    this.load.image('obsticle-1', 'assets/flax_small_1.png')
    this.load.image('obsticle-2', 'assets/flax_small_2.png')
    this.load.image('obsticle-3', 'assets/flax_small_3.png')
    this.load.image('obsticle-4', 'assets/flax_big_1.png')
    this.load.image('obsticle-5', 'assets/flax_big_2.png')
    this.load.image('obsticle-6', 'assets/flax_big_3.png')
  }

  create() {
    this.scene.start('PlayScene');
  }
}

export default PreloadScene;
