import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    const { height, width } = this.game.config;
    const offsetHeightDino = this.game.config.offsetHeightDino;
    this.gameSpeed = 6;
    this.isGameRunning = false;
    this.respawnTime = 0;
    this.score = 0;

    this.jumpSound = this.sound.add('jump', {volume: 0.2});
    this.hitSound = this.sound.add('hit', {volume: 0.2});
    this.reachSound = this.sound.add('reach', {volume:0.2})

    this.startTrigger = this.physics.add.sprite(0, height - offsetHeightDino*3, 'restart').setOrigin(0, 1).setImmovable();
    // this.ground = this.add.tileSprite(0, height, 10, 0, 'ground').setOrigin(0, 1);
    // this.ground = this.add.tileSprite(0, height, 0, height, 'ground').setOrigin(0, 1).setScale(1 ,1);
    this.ground = this.add.tileSprite(0, height, 0, offsetHeightDino, 'ground').setOrigin(0, 1);
    this.dino = this.physics.add.sprite(0, height-height*.3, 'donkey-idle')
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .setBodySize(88, 184)
      .setDepth(1)
      .setOrigin(0, 1);

    this.dino.body.offset.y = offsetHeightDino;

    this.scoreText = this.add.text(width-25, 0, "0", {fill: "#000000", font: '700 48px Highgate', resolution: 0})
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add.text(0, 0, "0", {fill: "#000000", font: '900 48px Highgate', resolution: 0})
      .setOrigin(1, 0)
      .setAlpha(0);

      this.environment = this.add.group();
      this.environment.addMultiple([
        this.add.image(width / 2.7, 275, 'cloud'),
        this.add.image((width / 1.5), 150, 'cloudFlip'),
        this.add.image(width , 230, 'cloud'),
      ]);
      this.environment.setAlpha(0);

    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0);
    this.gameOverText = this.add.text(-225, -25, "WAT EEN TOPSCORE!", {fill: "#000000", font: '700 48px Highgate', resolution: 0});
    this.restart = this.add.image(0, 80, 'restart').setInteractive();
    this.gameOverScreen.add([
      this.gameOverText,  this.restart
    ])

    this.obstacles = this.physics.add.group();

    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(this.dino, this.obstacles, () => {
      this.highScoreText.x = this.scoreText.x - this.scoreText.width - 100;

      const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 3);
      const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

      this.highScoreText.setText('HI ' + newScore);
      this.highScoreText.setAlpha(1);

      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();
      this.donkey.setTexture('donkey-hurt');
      this.respawnTime = 0;
      this.gameSpeed = 10;
      this.gameOverScreen.setAlpha(1);
      this.score = 0;
      this.hitSound.play();
    }, null, this);
  }

  initStartTrigger() {
    const { width, height } = this.game.config;
    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      if (this.startTrigger.y === height - this.game.config.offsetHeightDino) {
        this.startTrigger.body.reset(0, height - this.game.config.offsetHeightDino*3);
        console.log('not restarting game');
        return;
      }

      this.startTrigger.disableBody(true, true);

      const startEvent =  this.time.addEvent({
        delay: 1000/60,
        loop: true,
        callbackScope: this,
        callback: () => {
          this.donkey.setVelocityX(80);
          this.donkey.play('donkey-run', 1);

          // if (this.ground.width < width) {
          //   this.ground.width += 17 * 2;
          // }

          this.ground.width = width;
          this.isGameRunning = true;
          this.dino.setVelocityX(0);
          this.scoreText.setAlpha(1);
          this.environment.setAlpha(1); 
          startEvent.remove();

          // if (this.ground.width >= 2400) {
          // }
        }
      });
    }, null, this)
  }

  initAnims() {
    this.anims.create({
      key: 'donkey-run',
      frames: this.anims.generateFrameNumbers('donkey', {start: 1, end: 5}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'donkey-down-anim',
      frames: this.anims.generateFrameNumbers('donkey-down', {start: 0, end: 1}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'enemy-donkey-fly',
      frames: this.anims.generateFrameNumbers('enemy-bird', {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    })
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000/10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) { return; }

        this.score++;
        this.gameSpeed += 0.01

        if (this.score % 100 === 0) {
          this.reachSound.play();

          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true
          })
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 2 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(''));
      }
    })
  }

  handleInputs() {
    const offsetHeightDino = this.game.config.offsetHeightDino;

    this.restart.on('pointerdown', () => {
      this.dino.setVelocityY(0);
      this.dino.body.height = offsetHeightDino + 92;
      this.dino.body.offset.y = offsetHeightDino;
      this.physics.resume();
      this.obstacles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    })

    this.input.keyboard.on('keydown_SPACE', () => {
      console.log('pressing space');
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) { console.log( 'din o is on floor.'); return; }
      console.log('passed test');
      this.jumpSound.play();
      this.dino.body.height = offsetHeightDino + 92;
      this.dino.body.offset.y = offsetHeightDino;
      this.dino.setVelocityY(-1600); 
      this.dino.setTexture('dino', 0);
    })

    this.input.keyboard.on('keydown_DOWN', () => {
      if (!this.donkey.body.onFloor() || !this.isGameRunning) { return; }

      this.dino.body.height = offsetHeightDino + 58;
      this.dino.body.offset.y = offsetHeightDino + 34;
    })

    this.input.keyboard.on('keyup_DOWN', () => {
      if ((this.score !== 0 && !this.isGameRunning)) { return; }

      this.dino.body.height = offsetHeightDino + 92;
      this.dino.body.offset.y = offsetHeightDino;
    })
  }

  placeObsticle() {
    const offsetHeightDino = this.game.config.offsetHeightDino;
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;
    if (obsticleNum > 6) {
      const enemyHeight = [20, 50];
      obsticle = this.obstacles.create(this.game.config.width + distance, this.game.config.height - offsetHeightDino - enemyHeight[Math.floor(Math.random() * 2)], `enemy-bird`)
        .setOrigin(0, 1)
        obsticle.play('enemy-donkey-fly', 1);
      obsticle.body.height = obsticle.body.height / 1.5;
    } else {
      obsticle = this.obstacles.create(this.game.config.width + distance, this.game.config.height - offsetHeightDino * 2, `obsticle-${obsticleNum}`)
        .setOrigin(0, 1);

      obsticle.body.offset.y = offsetHeightDino * 2;
    }

    obsticle.setImmovable();
  }

  update(time, delta) {
    if (!this.isGameRunning) { return; }

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), - 0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obstacles.getChildren().forEach(obsticle => {
      if (obsticle.getBounds().right < 0) {
        this.obstacles.killAndHide(obsticle);
      }
    }) 

    this.environment.getChildren().forEach(env => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    })

  }
}

export default PlayScene;
