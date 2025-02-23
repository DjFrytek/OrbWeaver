let canvas;
let physicsEngine;
let player;
let level;
let renderer;
let zoomPersist = 1;

let mouseHeldInsideCanvas = false;
let currentLevel;


function setup() {
  canvas = createCanvas(600, 600);
  canvas.parent('game-canvas');
  frameRate(60);

  window.startLevel("level2");
}

window.startLevel = function(levelName = currentLevel) {
  currentLevel = levelName;
  loadLevel(levelName);
  player = new Player(level.player.startPosition.x, level.player.startPosition.y, level.player);
  renderer = new Renderer(canvas, level, zoomPersist, player);
  physicsEngine = new PhysicsEngine(60, level, player);

}

function loadLevel(levelName) {
  console.log("loading: " + levelName);
  level = JSON.parse(JSON.stringify(getLevelData(levelName)));
}

function draw() {
  if (physicsEngine.update()) {
    
  }
  renderer.drawAll(player, level.objects);
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
    mouseHeldInsideCanvas = true;
  }
}

function mouseReleased() {
  mouseHeldInsideCanvas = false;
}