"use strict";

import { Food } from "./food.js";
import { Snake } from "./snake.js";


// Storage key
const STORAGE_KEY = 'maxScore';

export class PlayScene extends Phaser.Scene {
  constructor() {
        super("playGame");
    }
    score = 0;
    scoreText;
    maxScoreText;
    gameOver = false;
    snake;
    food;
    cursors;
    record;
    eatSound;
    gameOverSound;

    preload() {
        this.load.image("grass", "./assets/new-grass.png");
        this.load.spritesheet("head", "assets/snake-head.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("body", "./assets/snake-body.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("food", "./assets/food.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
      this.load.image("close-icon", "./assets/close-icon.png")

      // Audio
      this.load.audio("eatSound", "./assets/eat-sound.mp3");
      this.load.audio("gameOverSound", "./assets/gameover-sound.mp3")
    }

    create() {
      this.add.image(400, 300, "grass");
      const closeButton = this.add.image(620, 20, "close-icon").setInteractive();
          closeButton.on("pointerup", () => {
            this.handleGameOver();
      });
      this.food = new Food(this, 5, 6);
      this.snake = new Snake(this, 10, 10);

      this.eatSound = this.sound.add("eatSound", { loop: false });
      this.gameOverSound = this.sound.add("gameOverSound", { loop: false });      

        //  Keyboard controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.gameOver = false;

        // Score
        let textStyle = { font: "32px VT323", fill: "#27374A" };
        this.score = 0;
        this.scoreText = this.add.text(20, 10, "apples: " + this.score, textStyle);

        this.maxScore = 0;
        this.getMaxScore();
        this.maxScoreText = this.add.text(
            400,
            10,
            "max apples: " + this.maxScore,
            textStyle
        );

        // Current speed        
        this.displayedSpeed = 1;
        this.displayedSpeedText = this.add.text(
            20,
            40,
            "speed: " + this.displayedSpeed + " crawl/sec",
            textStyle
      );   
     
    }

  update(time, delta) {   
       
      if (this.gameOver) {        
            return;
        }

        // Prevent moving in oposite direction when pressing key
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
                this.eatSound.play();
                this.repositionFood();
            }
      }

    if (this.snake.alive === false) {
      this.handleGameOver();
      }
    }

    repositionFood() {
        //  First create an array that assumes all positions are valid for the new piece of food
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

        for (let y = 4; y < 30; y++) {
            for (let x = 0; x < 40; x++) {
                if (testGrid[y][x] === true) {
                    //  Is this position valid for food? If so, add it here ...
                    validLocations.push({ x: x, y: y });
                }
            }
        }

        if (validLocations.length > 0) {
            //  pick and set a random food position
            let pos = Phaser.Math.RND.pick(validLocations);
            this.food.setPosition(pos.x * 16, pos.y * 16);
            return true;
        } else {
            return false;
        }
      
  }

  setRecord() {    
      if (this.score > this.maxScore) {
        this.record = this.score;
        return this.record;   
    }    
  }
  
  setMaxScore() {
      if (this.score > this.maxScore) {        
        this.maxScore = this.score;        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.maxScore));
      }
  }    

    getMaxScore() {
        const storedMaxScore = localStorage.getItem(STORAGE_KEY);
        if (storedMaxScore) {            
            this.maxScore = JSON.parse(storedMaxScore);            
        }
    }

    handleGameOver() {
        this.gameOver = true;
        this.snake.alive = false; 
        this.setRecord();
        this.setMaxScore();
      this.gameOverSound.play();
      setTimeout(() => {
        this.scene.start("gameOver",
        { score: this.score, record: this.record }
        );
      }, 3000);         
    }
}


