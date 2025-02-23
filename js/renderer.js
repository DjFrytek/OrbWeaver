class Renderer {
  constructor(canvas, level, zoom, mainPlayer, ghostPlayer) {
    this.canvas = canvas;
    this.zoom = zoom;
    this.desiredZoom = zoom;
    this.zoomSpeed = 0.05;
    this.level = level;
    this.player = mainPlayer;
    this.ghostPlayer = ghostPlayer;

    this.colors = {
      steeringLine: color(3, 211, 252),
      playerBall: color(0, 255, 0),
      ghostBall: color(26, 216, 237),
      playerTrail: color(0, 242, 255),
      ghostTrail: color(0, 242, 255),
      bg: color(50),
      deathwall: color(250),
      finish: color(0, 255, 0, 100),
      checkpoint: color(183, 0, 255, 100),
    }
  }

  drawAll() {
    if(physicsEngine.finished) return;
    this.zoom = lerp(this.zoom, this.desiredZoom, this.zoomSpeed);
    push();
    translate(canvas.width / 2 - player.pos.x * this.zoom, canvas.height / 2 - player.pos.y * this.zoom);
    scale(this.zoom);
    background(this.colors.bg);

    this.drawLevel(this.level);
    this.drawLevelBounds(this.level);
    if(this.ghostPlayer) this.drawPlayerTrail(this.ghostPlayer);
    this.drawPlayerTrail(this.player);
    if(this.ghostPlayer) this.drawPlayer(this.ghostPlayer);
    this.drawPlayer(this.player);
    pop();
    this.drawSteeringLine(this.player);
    this.showTimer();
  }

  drawLevel(level) {
    let levelObjects = level.objects;
    push();

    let nextCheckpoint;
    for(let i = levelObjects.length-1; i >= 0; i--) {
      let obj = levelObjects[i];
      if(obj.type == "checkpoint" && !obj.collected) {
        nextCheckpoint = obj;
        break;
      }
    }

    // Draw level objects
    levelObjects.forEach(obj => {
      if(obj.type == "wall") {
        let slowdownFactor = 1 - obj.strength;
        let color = map(pow(slowdownFactor, 0.5), 0, 1, 200, 60);
        fill(color);
        noStroke();
        ellipse(obj.x, obj.y, obj.r);
      } else if(obj.type == "deathwall") {
        fill(this.colors.deathwall);
        noStroke();
        ellipse(obj.x, obj.y, obj.r);
      } else if(obj.type == "hole") {
        
      } else if(obj.type == "checkpoint") {
        if(!obj.collected && (!level.settings.forceCheckpointOrder || nextCheckpoint == obj)){
          fill(this.colors.checkpoint);
          noStroke();
          ellipse(obj.x, obj.y, obj.r-10);
          }
        
      } else if(obj.type == "finish") {
        fill(this.colors.finish);
        noStroke();
        ellipse(obj.x, obj.y, obj.r-10);
      }
      
    });
    pop();
  }

  drawPlayer(player) {
    push();
    noStroke();
    let a = 255;
    let c = this.colors.playerBall;
    let distToPlayer = 0;
    if(player.isGhost) {
      distToPlayer = physicsEngine.getDistToPlayer(player.pos.x, player.pos.y);
      a = map(distToPlayer, 0, 50, 0, 255);
      c = this.colors.ghostBall;
      c = color(c.levels[0], c.levels[1], c.levels[2], a);
    }

    if (player.isColliding) {
      fill(255, 0, 0, a);
    } else {
      fill(c);
    }
    ellipse(player.pos.x, player.pos.y, player.visualRadius * 2);
    pop();
  }

  drawPlayerTrail(player) {
    let trail = player.pastPositions;
    push();
    strokeWeight(2);
      for (let i = 1; i < trail.length; i++) {
        let c = player.isGhost ? this.colors.ghostTrail : this.colors.playerTrail;
        
        let opacity = map(i, 1, trail.length, 0, 255);
        if(player.isGhost) opacity *= 0.2;
        stroke(red(c), green(c), blue(c), opacity);
        if(trail.length > 3) line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
      }
    pop();
  }

  drawSteeringLine(player) {
    if (physicsEngine.started) {
      push();
      stroke(this.colors.steeringLine);
      let direction = player.getInput();
      let distance = direction.mag();
      distance = min(distance, this.player.maxSteeringDist);
      direction.normalize();
      direction.mult(distance);
      direction.mult(player.maxSteeringDist);

      line(canvas.width/2, canvas.height/2, canvas.width/2 + direction.x, canvas.height/2 + direction.y);
      pop();
    }
  }

  showTimer() {
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text((physicsEngine.elapsedTime / 1000).toFixed(2), width/2, 25);
    pop();
  }

 drawLevelBounds(level) {
  let bounds = level.player.bounds;
    push();
    noStroke();
    fill(this.colors.bg);
    rect(-2000, -2000, 6000, 2000);
    rect(-2000, -5, 2000, 6000);
    rect(-5, bounds.height, 6000, 2000);
    rect(bounds.width, -5, 2000, 2010);
    pop();

    push();
    noFill();
    stroke(255);
    strokeWeight(4);
    rect(0, 0, bounds.width, bounds.height);
    pop();
  }
}
