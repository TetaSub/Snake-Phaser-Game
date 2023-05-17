"use strict";

class SnakeGame extends Phaser.Scene {

    score = 0;
    scoreText;
    gameOver = false;  
    snake;
    food;
    cursors;


    preload() {        

        this.load.image('grass', 'assets/grass.png');
        this.load.spritesheet('head', 'assets/snake-head.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('body', 'assets/snake-body.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('food', 'assets/food.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        
        this.add.image(400, 300, 'grass');
    
        // Snake

        const snake = [];
        let head;

        for (let i = 0; i < 2; i++) {
            let part;
    
            if (i === 1) {
                part = this.add.image(32 + i * 16, 64, 'head');
            } else {
                part = this.add.image(32 + i * 16, 64, 'body');
            }

            part.setOrigin(0, 0);
            snake.push(part);
    
            if (i === 1) {
                head = part;
            }
        }

        let direction = 3;
        let distance = Phaser.Math.Between(4, 8);

        this.time.addEvent({
            delay: 300,
            loop: true,
            callback: () => {
                let x = head.x;
                let y = head.y;

                if (direction === 0) {
                    x = Phaser.Math.Wrap(x - 16, 0, 800);
                } else if (direction === 1) {
                    x = Phaser.Math.Wrap(x + 16, 0, 800);
                } else if (direction === 2) {
                    y = Phaser.Math.Wrap(y - 16, 0, 576);
                } else if (direction === 3) {
                    y = Phaser.Math.Wrap(y + 16, 0, 576);
                }

                Phaser.Actions.ShiftPosition(snake, x, y);

                distance--;

                if (distance === 0) {
                    if (direction <= 1) {
                        direction = Phaser.Math.Between(2, 3);
                    } else {
                        direction = Phaser.Math.Between(0, 1);
                    }

                    distance = Phaser.Math.Between(4, 12);
                }
            }
        });

        // Food
    
        this.food = this.physics.add.sprite(100, 100, 'food');
        this.physics.add.overlap(snake, this.food, this.eat, null, this);


        // Score 
        let scoreStyle = { font: '20px Arial', fill: '#fff' };
        this.scoreText = this.add.text(20, 20, 'apples: ' + this.score, scoreStyle);
        
        this.maxScore = 0;
        this.maxScoreText = this.add.text(400, 20, 'max apples: ' + this.maxScore, scoreStyle);

        
        // Current speed
        let currentSpeedStyle = { font: '20px Arial', fill: '#fff' };
        this.currentSpeed = 2;
        this.currentSpeedText = this.add.text(20, 40, 'speed: ' + this.currentSpeed + ' crawls per second', currentSpeedStyle);
    
        this.cursors = this.input.keyboard.createCursorKeys();

    };


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
        if (cursors.left.isDown) {
            this.snake.faceLeft();
        }
        else if (cursors.right.isDown) {
            this.snake.faceRight();
        }
        else if (cursors.up.isDown) {
            this.snake.faceUp();
        }
        else if (cursors.down.isDown) {
            this.snake.faceDown();
        }

        if (this.snake.update(time)) {
            //  If the snake updated, we need to check for collision against food

            this.snake.eat(this.food);
        }
    }

    eat() {
  this.food.x = Phaser.Math.Between(100, 800);
  this.food.y = Phaser.Math.Between(100, 400);
  this.score += 1;
  this.scoreText.setText('score: ' + this.score);
    };  
    
};
 

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'phaser-example',
    scene: SnakeGame
};

const game = new Phaser.Game(config);