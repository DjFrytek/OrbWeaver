class Player {
  constructor(x, y, physics) {
    this.pos = createVector(x, y);
    this.visualRadius = 5;
    this.drag = physics.drag;
    this.steeringForce = physics.steeringForce;
    this.maxSteeringDist = min(width, height) / 4;
    this.velocity = createVector(0, 0);
    this.isColliding = false;

    this.pastPositions = [];
    this.maxPastPositions = 30;
  }

  getInput() {
    let direction = createVector(mouseX - canvas.width / 2, mouseY - canvas.height / 2);
    let mag = direction.mag();
    let str = map(mag, 0, this.maxSteeringDist, 0, 1);
    str = min(str, 1);
    direction.normalize();
    direction.mult(str);
    
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
