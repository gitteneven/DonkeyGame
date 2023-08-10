
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
    this.load.image('donkey-hurt', 'assets/donkey_dead.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('game-over', 'assets/game-over.png');
    this.load.image('cloud', 'assets/cloud_2x.png');
    this.load.image('cloudFlip', 'assets/cloud_2xFlip.png');

    //aangepast door Gitte
    this.load.spritesheet('donkey', 'assets/donkey-run.png', {
      frameWidth: 264,
      frameHeight: 282
    })

    this.load.spritesheet('enemy-bird', 'assets/bird_sprite.png', {
      frameWidth: 144,
      frameHeight: 128
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
