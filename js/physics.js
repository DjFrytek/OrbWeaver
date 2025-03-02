class PhysicsEngine {
  constructor(fps, levelData, mainPlayer, ghostPlayer) {
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
    this.ghostPlayer = ghostPlayer;
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

    while(currentTime > this.nextFrameMillis) {
      this.nextFrameMillis += this.deltaTime;
      if(currentTime - this.nextFrameMillis > this.deltaTime*4) this.nextFrameMillis = currentTime;


      if (this.started) {
        this.elapsedTime = this.updateCount * this.deltaTime;
        this.updateCount++;
      }
      this.updatePlayer(this.player);
      if(this.ghostPlayer) {
        this.updatePlayer(this.ghostPlayer, true);
      }

    }
    return true;
  }

  updatePlayer(player) {
    let direction = player.getInput(true);

    let str = direction.mag();
    str = min(str, 1);
    direction.normalize();
    direction.mult(str * player.steeringForce);

    player.velocity.add(direction);

    let collision = this.checkWallCollisions(player);
    player.isColliding = collision.isColliding;
    

    player.velocity.mult(player.drag);
    let slowedVelocity = p5.Vector.mult(player.velocity, collision.slowdownFactor);
    player.pos.add(slowedVelocity);
    player.update();
    
    if(player.isGhost) return;
    if (player.pos.x < 0 || player.pos.x > this.level.player.bounds.width || player.pos.y < 0 || player.pos.y > this.level.player.bounds.height) {
      player.die();
    }
  }

  checkWallCollisions(player) {
    let isPhysical = !player.isGhost; //Can collect checkpoints, finish line etc.
    let collision = {isColliding: false, slowdownFactor: 1}

    let nextCheckpoint;
    for(let i = this.level.objects.length-1; i >= 0; i--) {
      let obj = this.level.objects[i];

      if(obj.type == "checkpoint") {
        if(!nextCheckpoint && !obj.collected) nextCheckpoint = obj;
      }

      let distance = dist(player.pos.x, player.pos.y, obj.x, obj.y);
      if (distance < obj.r/2) {
        if(obj.type == "wall") {
          if(obj.strength != 0) collision.isColliding = true;
          collision.slowdownFactor = 1 - obj.strength;
          break;
        } else if(obj.type == "deathwall") {
          if(isPhysical) player.die();
          break;
        } else if(obj.type == "finish") {
          if(this.isCheckpointsCollected()) {
            if(isPhysical) {
              levelFinished(this.elapsedTime, !player.isPlayback);
              this.finished = true;
            } else {
              player.freeze();
            }
          }
        } else if(obj.type == "checkpoint") {
          if(isPhysical && !this.level.settings.forceCheckpointOrder || nextCheckpoint == obj) obj.collected = true;

        }
      }
    }
    return collision;
  }

  isCheckpointsCollected() {
    let objects = this.level.objects;
    for(let obj of objects) {
      if(obj.type == "checkpoint") {
        if(!obj.collected) return false;
      }
    }
    return true;
  }

  getDistToPlayer(x, y) {
    return dist(x, y, this.player.pos.x, this.player.pos.y);
  }

  getFinishTime() {
    return this.elapsedTime;
  }
}
