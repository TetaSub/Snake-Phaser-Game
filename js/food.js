export class Food extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene);

    this.setTexture("food");
    this.setPosition(x * 16, y * 16);
    this.setOrigin(0);

    this.total = 0;   

    this.scene.children.add(this);
    
  }

  eat() {
    this.total++;     
    this.scene.score ++;
    this.scene.scoreText.setText("apples: " + this.scene.score);     
    
    const shine = this.postFX.addShine();  
    return shine;
  }
}