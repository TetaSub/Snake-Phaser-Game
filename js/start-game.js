class StartScene extends Phaser.Scene {
    constructor() {
        super("startGame");
    }

    preload() {
        this.load.image("start-overlay", "./assets/start-overlay.png");
        //this.load.image("snake-alive", "./assets/snake-alive.png");
    }

    create() {      
        
        this.overlay = this.add.image(320, 240, "start-overlay");
        //this.add.image(320, 100, "snake-alive");

        // this.gameText = this.add.text(
        //     this.cameras.main.width / 2,
        //     this.cameras.main.height / 2 - 50,
        //     'Snake Game',
        //     { font: "48px Arial", fill: "#BC3B2A" }
        // );
        // this.gameText.setOrigin(0.5);
        // this.gameText.setDepth(2);


        this.instructionText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 210,
            'Use the arrow keys to move the snake and \ntry to catch as many apples as you can',
            { font: "32px VT323", fill: "#000"}
        );
        this.instructionText.setOrigin(0.5);
        this.instructionText.setDepth(2);
        
        
        this.startButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 150,
            'S T A R T',
            { font: "100px VT323", fill: "#000" }
        );
        this.startButton.setOrigin(0.5);
        this.startButton.setDepth(2);
        this.startButton.setInteractive();
    // }

    // update() {
        this.startButton.on('pointerover', () => {
            this.startButton.setStyle({ fill: '#BC3B2A' }); 
    });

    this.startButton.on('pointerout', () => {
        this.startButton.setStyle({ fill: '#BC3B2A' }); 
    });


    this.startButton.on('pointerup', () => {
        this.startButton.setScale(1);  
        this.scene.start("playGame");        
    });


    this.startButton.on('pointerdown', () => {
    this.startButton.setScale(0.9); 
    });
        
    //  keyboard input
    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey.on('down', () => {
    this.scene.start("playGame");
    });
    }          
        
}

