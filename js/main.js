const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  backgroundColor: "#bfcc00",
  parent: "game-container",
  scene: [StartScene, PlayScene, EndScene],
};

const game = new Phaser.Game(config);