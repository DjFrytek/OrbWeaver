class PhysicsEngine {
  constructor(fps, levelData, mainPlayer) {
    this.fps = fps;
    this.deltaTime = 1000 / fps;
    this.updateCount = 0;
    this.elapsedTime = 0;
    this.started = false;
    this.finished = false;
    this.nextFrameMillis = millis();
    this.testmilis;
    this.level = levelData;

    this.player = mainPlayer;
  }

  start() {
    if(this.started || this.finished) return;
    console.log("start!");
    this.started = true;
    this.testmilis = millis();
  }

  update() {
    if(!this.started || this.finished) return false;
    let currentTime = millis();

    if(currentTime < this.nextFrameMillis) return false;

    this.nextFrameMillis += this.deltaTime;
    if(currentTime - this.nextFrameMillis > this.deltaTime*4) this.nextFrameMillis = currentTime;


    if (this.started) {
      this.elapsedTime = this.updateCount * this.deltaTime;
      this.updateCount++;
    }
    this.updatePlayer(this.player);

    return true;
  }

  updatePlayer(player) {

    if (mouseIsPressed && mouseHeldInsideCanvas) {
      let direction = player.getInput();

      let distance = direction.mag();
      let limitedDistance = min(distance, player.maxSteeringDist);
      direction.normalize();
      direction.mult(limitedDistance * player.steeringForce);

      player.velocity.add(direction);
    }

    let collision = this.checkWallCollisions(player);
    player.isColliding = collision.isColliding;
    

    player.velocity.mult(player.drag);
    let slowedVelocity = p5.Vector.mult(player.velocity, collision.slowdownFactor);
    player.pos.add(slowedVelocity);
    player.update();
    
    if (player.pos.x < 0 || player.pos.x > this.level.player.bounds.width || player.pos.y < 0 || player.pos.y > this.level.player.bounds.height) {
      player.die();
    }
  }

  checkWallCollisions(player) {
    let collision = {isColliding: false, slowdownFactor: 1}
    for(let i = this.level.objects.length-1; i >= 0; i--) {
      let obj = this.level.objects[i];

      let distance = dist(player.pos.x, player.pos.y, obj.x, obj.y);
      if (distance < obj.r/2) {
        if(obj.type == "wall") {
          collision.isColliding = true;
          collision.slowdownFactor = 1 - obj.strength;
          break;
        } else if(obj.type == "deathwall") {
          player.die();
          break;
        } else if(obj.type == "finish") {
          this.finished = true;
          levelFinished(this.elapsedTime);
        }
      }
    }
    return collision;
  }
}
