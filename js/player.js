class Player {
  constructor(x, y, physics, replay) {
    this.pos = createVector(x, y);
    this.visualRadius = 5;
    this.drag = physics.drag;
    this.steeringForce = physics.steeringForce;
    this.maxSteeringDist = min(width, height) / 4;
    this.velocity = createVector(0, 0);
    this.isColliding = false;

    this.pastPositions = [];
    this.maxPastPositions = 30;

    this.recordInput = replay == undefined; //Whether to record the input
    this.isPlayback = replay != undefined; //Whether is controlled by player or the replay
    this.inputReplay = []; //If controlled by player record the input here, if playback get the input from here
    if(this.isPlayback) this.inputReplay = replay;
    this.playbackIndex = 0; //Which input should be read next
  }

  getInput(advancePlayback = false) {
    if(this.isPlayback) {
      let i = min(this.playbackIndex, this.inputReplay.length-1);
      let inp = this.inputReplay[i];
      let dir = createVector(inp.x, inp.y); 
      if(advancePlayback) this.playbackIndex++;
      return dir;
    }

    let direction = createVector(0, 0);
    if (mouseIsPressed && mouseHeldInsideCanvas) {
      direction = createVector(mouseX - canvas.width / 2, mouseY - canvas.height / 2);
      let mag = direction.mag();
      let str = map(mag, 0, this.maxSteeringDist, 0, 1);
      str = min(str, 1);
      direction.normalize();
      direction.mult(str);      
    }

    this.inputReplay.push({x: direction.x, y: direction.y});
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
