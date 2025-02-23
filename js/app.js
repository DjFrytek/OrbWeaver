let canvas;
let physicsEngine;
let player;
let level;
let renderer;
let zoomPersist = 1;


function setup() {
  canvas = createCanvas(600, 600);
  canvas.parent('game-canvas');
  frameRate(60);
  level = getLevelData();

  window.startLevel();
}

window.startLevel = function() {
  player = new Player(levelData.player.startPosition.x, levelData.player.startPosition.y, levelData.player);
  renderer = new Renderer(canvas, levelData, zoomPersist, player);
  physicsEngine = new PhysicsEngine(60, levelData, player);

}

function draw() {
  if (physicsEngine.update()) {
    
  }
  renderer.drawAll(player, levelData.objects);
  showFPS();
}

function showFPS() {
  push();
  fill(255);
  textSize(20);
  text(frameRate().toFixed(0), 10, 20);
  text("Zoom: " + renderer.zoom.toFixed(2), 10, 40);
  pop();
}

function levelFinished(finishTime) {
  console.log("LEVEL FINISHED! TIME: " + finishTime);
  
}

function mouseWheel(event) {
  let zoomFactor = 1.1;
  if (event.delta > 0) {
    renderer.desiredZoom /= zoomFactor;
  } else {
    renderer.desiredZoom *= zoomFactor;
  }
  renderer.desiredZoom = constrain(renderer.desiredZoom, 0.2, 5);
  if(abs(renderer.desiredZoom-1) < 0.04) renderer.desiredZoom = 1;

  zoomPersist = renderer.desiredZoom;
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    window.startLevel();
  }
}

function isMouseInsideCanvas() {
  return mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height;
}

function mousePressed() {
  if(isMouseInsideCanvas()) {
    physicsEngine.start();
  }
}
