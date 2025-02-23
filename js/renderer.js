class Renderer {
  constructor(canvas, level, zoom, mainPlayer) {
    this.canvas = canvas;
    this.zoom = zoom;
    this.desiredZoom = zoom;
    this.zoomSpeed = 0.05;
    this.level = level;
    this.player = mainPlayer;

    this.colors = {
      playerBall: color(0, 255, 0),
      bg: color(50),
      deathwall: color(250),
      finish: color(0, 255, 0, 100),
    }
  }

  drawAll() {
    this.zoom = lerp(this.zoom, this.desiredZoom, this.zoomSpeed);
    push();
    translate(canvas.width / 2 - player.pos.x * this.zoom, canvas.height / 2 - player.pos.y * this.zoom);
    scale(this.zoom);
    background(this.colors.bg);

    this.drawLevel(this.level.objects);
    this.drawLevelBounds(this.level);
    this.drawPlayerTrail(this.player);
    this.drawPlayer(this.player);
    pop();
    this.drawSteeringLine(this.player);
    this.showTimer();
  }

  drawLevel(levelObjects) {
    push();
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
    if (player.isColliding) {
      fill(255, 0, 0);
    } else {
      fill(this.colors.playerBall);
    }
    ellipse(player.pos.x, player.pos.y, player.visualRadius * 2);
    pop();
  }

  drawPlayerTrail(player) {
    let trail = player.pastPositions;
    push();
    strokeWeight(2);
      for (let i = 1; i < trail.length; i++) {
        let opacity = map(i, 1, trail.length, 0, 255);
        stroke(0, 242, 255, opacity);
        if(trail.length > 3) line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
      }
    pop();
  }

  drawSteeringLine(player) {
    if (mouseIsPressed && physicsEngine.started && isMouseInsideCanvas()) {
      push();
      stroke(3, 211, 252);
      let direction = createVector(mouseX - canvas.width / 2, mouseY - canvas.height / 2);
      let distance = direction.mag();
      let limitedDistance = min(distance, this.player.maxSteeringDist);
      direction.normalize();
      direction.mult(limitedDistance);

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
