class Player {
  constructor(x, y, physics) {
    this.pos = createVector(x, y);
    this.visualRadius = 5;
    this.drag = physics.drag;
    this.steeringForce = 0.002;
    this.maxSteeringDist = 100;
    this.velocity = createVector(0, 0);
    this.isColliding = false;

    this.pastPositions = [];
    this.maxPastPositions = 30;
  }

  getInput() {
    let direction = createVector(mouseX - canvas.width / 2, mouseY - canvas.height / 2);
    return direction;
  }

  die() {
    startLevel();
  }

  update() {
    this.pastPositions.push(this.pos.copy()); // Add at the end
    if (this.pastPositions.length > this.maxPastPositions) this.pastPositions.shift(); // Remove from the beginning
  }
}
