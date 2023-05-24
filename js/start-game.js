class StartScene extends Phaser.Scene {
    constructor() {
        super("startGame");
    }

    preload() {
        this.load.image("grass", "./assets/grass.png");
        this.load.image("snake-alive", "./assets/snake-alive.png");
    }

    create() {      
        
        this.overlay = this.add.image(320, 240, "grass");
        this.add.image(320, 100, "snake-alive");

        this.gameText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Snake Game',
            { font: "48px Arial", fill: "#fff" }
        );
        this.gameText.setOrigin(0.5);
        this.gameText.setDepth(2);


        this.instructionText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'Use the arrow keys to move the snake and \ntry to catch as many apples as you can',
            { font: "20px Arial", fill: "#27374A"}
        );
        this.instructionText.setOrigin(0.5);
        this.instructionText.setDepth(2);
        
        
        this.startButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'START',
            { font: "56px Arial", fill: "#fff" }
        );
        this.startButton.setOrigin(0.5);
        this.startButton.setDepth(2);
        this.startButton.setInteractive();
    // }

    // update() {
        this.startButton.on('pointerover', () => {
            this.startButton.setStyle({ fill: '#27374A' }); 
    });

    this.startButton.on('pointerout', () => {
        this.startButton.setStyle({ fill: '#fff' }); 
    });


    this.startButton.on('pointerup', () => {
        this.startButton.setScale(1);  
        this.scene.start("playGame");        
    });


    this.startButton.on('pointerdown', () => {
    this.startButton.setScale(0.9); 
    });
        
    }
}
