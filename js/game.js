"use strict";

//  Direction consts
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

class Food extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene);

    this.setTexture("food");
    this.setPosition(x * 16, y * 16);
    this.setOrigin(0);

    this.total = 0;

    scene.children.add(this);
  }

  eat() {
    this.total++;
  }
}

class Snake {
  constructor(scene, x, y) {
    this.headPosition = new Phaser.Geom.Point(x, y);
    this.body = scene.add.group();
    this.alive = true;
    this.speed = 300;
    this.moveTime = 0;
    this.tail = new Phaser.Geom.Point(x, y);
    this.heading = RIGHT;
    this.direction = RIGHT;

    this.snakeParts = [];

    for (let i = 0; i < 2; i++) {
      let part;

      if (i === 0) {
        part = scene.add.image(32 + i * 16, 64, "head");
        part.setOrigin(0, 0);
        this.body.add(part);
        this.head = part;
        this.snakeParts.push(part);
      } else {
        part = scene.add.image(32 + i * 16, 64, "body");
        part.setOrigin(0, 0);
        this.body.add(part);
        this.snakeParts.push(part);
      }
    }
  }

  update(time) {
    if (time >= this.moveTime) {
      return this.move(time);
    }
  }

  faceLeft() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = LEFT;
    }
  }

  faceRight() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = RIGHT;
    }
  }

  faceUp() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = UP;
    }
  }

  faceDown() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = DOWN;
    }
  }

  move(time) {
    /**
     * Based on the heading property (which is the direction the pgroup pressed)
     * we update the headPosition value accordingly.
     *
     * The Math.wrap call allow the snake to wrap around the screen, so when
     * it goes off any of the sides it re-appears on the other.
     */
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
        break;

      case RIGHT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
        break;

      case UP:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
        break;

      case DOWN:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
        break;
    }

    this.direction = this.heading;

    //  Update the body segments and place the last coordinate into this.tail
    Phaser.Actions.ShiftPosition(
      this.body.getChildren(),
      this.headPosition.x * 16,
      this.headPosition.y * 16,
      1,
      this.tail
    );

    //  Check to see if any of the body pieces have the same x/y as the head
    //  If they do, the head ran into the body

    let hitBody = Phaser.Actions.GetFirst(
      this.body.getChildren(),
      { x: this.head.x, y: this.head.y },
      1
    );

    if (hitBody) {
      console.log("dead");

      this.alive = false;

      return false;
    } else {
      //  Update the timer ready for the next movement
      this.moveTime = time + this.speed;

      return true;
    }
  }

  grow() {
    let newPart = this.body.create(this.tail.x, this.tail.y, "body");

    newPart.setOrigin(0);
  }

  collideWithFood(food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.grow();

      food.eat();

      //  For every 5 items of food eaten we'll increase the snake speed a little
      if (this.speed > 20 && food.total % 5 === 0) {
        this.speed -= 5;
      }

      return true;
    } else {
      return false;
    }
  }

  updateGrid(grid) {
    //  Remove all body pieces from valid positions list
    this.body.children.each(function (segment) {
      let bx = segment.x / 16;
      let by = segment.y / 16;

      grid[by][bx] = false;
    });

    return grid;
  }
}

class Scene extends Phaser.Scene {
  score = 0;
  scoreText;
  gameOver = false;
  snake;
  food;
  cursors;

  preload() {
    this.load.image("grass", "assets/grass.png");
    this.load.spritesheet("head", "assets/snake-head.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("body", "assets/snake-body.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("food", "assets/food.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    this.add.image(400, 300, "grass");

    this.food = new Food(this, 3, 4);

    this.snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Score
    let scoreStyle = { font: "20px Arial", fill: "#fff" };
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "apples: " + this.score, scoreStyle);

    this.maxScore = 0;
    this.maxScoreText = this.add.text(
      400,
      20,
      "max apples: " + this.maxScore,
      scoreStyle
    );

    // Current speed
    let currentSpeedStyle = { font: "20px Arial", fill: "#fff" };
    this.currentSpeed = 2;
    this.currentSpeedText = this.add.text(
      20,
      40,
      "speed: " + this.currentSpeed + " crawls per second",
      currentSpeedStyle
    );
  }

  update(time, delta) {
    if (!this.snake.alive) {
      return;
    }

    // /**
    // * Check which key is pressed, and then change the direction the snake
    // * is heading based on that. The checks ensure you don't double-back
    // * on yourself, for example if you're moving to the right and you press
    // * the LEFT cursor, it ignores it, because the only valid directions you
    // * can move in at that time is up and down.
    // */
    if (this.cursors.left.isDown) {
      this.snake.faceLeft();
    } else if (this.cursors.right.isDown) {
      this.snake.faceRight();
    } else if (this.cursors.up.isDown) {
      this.snake.faceUp();
    } else if (this.cursors.down.isDown) {
      this.snake.faceDown();
    }

    if (this.snake.update(time)) {
      //  If the snake updated, we need to check for collision against food
      if (this.snake.collideWithFood(this.food)) {
        this.repositionFood();
      }
    }
  }

  repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    let testGrid = [];

    for (let y = 0; y < 30; y++) {
      testGrid[y] = [];

      for (let x = 0; x < 40; x++) {
        testGrid[y][x] = true;
      }
    }

    this.snake.updateGrid(testGrid);

    //  Purge out false positions
    let validLocations = [];

    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 40; x++) {
        if (testGrid[y][x] === true) {
          //  Is this position valid for food? If so, add it here ...
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      //  Use the RNG to pick a random food position
      let pos = Phaser.Math.RND.pick(validLocations);

      //  And place it
      this.food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: 640,
  height: 480,
  backgroundColor: "#bfcc00",
  parent: "phaser-example",
  scene: Scene,
};

const game = new Phaser.Game(config);
