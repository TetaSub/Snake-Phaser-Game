class EndScene extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    preload() {
        this.load.image("grass", "./assets/grass.png");
        this.load.image("snake-dead", "./assets/snake-dead.png");
    }

    create() {
        this.overlay = this.add.image(320, 240, "grass");
        this.add.image(320, 100, "snake-dead");

        // game over Text
        this.gameOverText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 50,
                'Game Over',
                { font: "48px Arial", fill: "#27374A" }
            );
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setDepth(2);        

        // score text
        const { score, maxScore } = this.scene.settings.data;
        this.scoreText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 20,
                'You catched ' + score + ' apples',
                { font: "36px Arial", fill: "#fff" }
            );
        this.scoreText.setOrigin(0.5);
        this.scoreText.setDepth(2);

        if (score >= maxScore) {
            this.winText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 70,
                'Congrts! You set the record!',
                { font: "36px Arial", fill: "#fff" }
            );
            this.winText.setOrigin(0.5);
            this.winText.setDepth(2);            
        }       
               
        

        // start again button
            this.startAgainButton = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 150,
                'START AGAIN',
                { font: "48px Arial", fill: "#fff" }
            );
            this.startAgainButton.setOrigin(0.5);
            this.startAgainButton.setDepth(2);
            this.startAgainButton.setInteractive();
        // }

        // update() {
        
            this.startAgainButton.on('pointerover', () => {
                this.startAgainButton.setStyle({ fill: '#27374A' });
            });

            this.startAgainButton.on('pointerout', () => {
                this.startAgainButton.setStyle({ fill: '#fff' });
            });


            this.startAgainButton.on('pointerup', () => {
                this.startAgainButton.setScale(1);
                this.scene.start("playGame");
            });


            this.startAgainButton.on('pointerdown', () => {
                this.startAgainButton.setScale(0.9);
            });
        }

    }

    