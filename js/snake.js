//  Direction consts
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

export class Snake extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene);
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
    // Update headPosition  
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
      this.scene.handleGameOver();
        //return false;
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

    // For every 5 items of food eaten, the snake speed is increased
    if (this.speed > 20 && food.total % 5 === 0) {
      if (food.total >= 20) {
          this.speed -= 20;
        } else {
          this.speed -= 50;
        }
      this.scene.displayedSpeed ++;
      this.scene.displayedSpeedText.setText(
        "speed: " + this.scene.displayedSpeed + " crawls/sec"
      );
      }
    //this.scene.setMaxScore();
    return true;
  }
  return false;
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