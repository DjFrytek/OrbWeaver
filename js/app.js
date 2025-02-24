let canvas;
let physicsEngine;
let player;
let level;
let renderer;
let zoomPersist = 1;

let mouseHeldInsideCanvas = false;
let currentLevel;

let lastReplay;

let playbackReplay; //Input data to play
let raceGhost = false;
let ghost;

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://orbweaver.onrender.com';

function setup() {
  canvas = createCanvas(600, 600);
  canvas.parent('game-canvas');
  frameRate(60);

  window.startLevel("level1");
  resizeCanvasIfNeeded();
  window.addEventListener('resize', resizeCanvasIfNeeded);
}

window.startLevel = function(levelName = currentLevel) {
  currentLevel = levelName;
  loadLevel(levelName);
  if(!raceGhost) {
    player = new Player(level.player.startPosition.x, level.player.startPosition.y, level.player, playbackReplay);
    ghost = undefined;
  } else {
    player = new Player(level.player.startPosition.x, level.player.startPosition.y, level.player);
    ghost = new Player(level.player.startPosition.x, level.player.startPosition.y, level.player, playbackReplay, true);
  }
  renderer = new Renderer(canvas, level, zoomPersist, player, ghost);
  physicsEngine = new PhysicsEngine(60, level, player, ghost);

  if (canvas && canvas.elt) {
    canvas.elt.classList.remove("blurred");
    document.getElementById("game-canvas").classList.remove("blurred");
    document.getElementById("win-overlay").style.display = "none";
  }

  fetchReplays().then(replays => displayReplays(replays));
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

function levelFinished(finishTime, isScoreLegit) {
  if(isScoreLegit) {
    console.log("LEVEL FINISHED! TIME: " + finishTime);
    lastReplay = createReplayObject(currentLevel, physicsEngine.getFinishTime(), player.inputReplay);
    saveReplayToServer(lastReplay);
  }
  else console.log("REPLAY FINISHED! TIME: " + finishTime);
  canvas.elt.classList.add("blurred");
  document.getElementById("game-canvas").classList.add("blurred");
  document.getElementById("win-time").innerHTML = "Time: " + (physicsEngine.elapsedTime / 1000).toFixed(2);
  document.getElementById("win-overlay").style.display = "block";
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

  if (key === 'g' || key === 'G') {
    if(playbackReplay) toggleReplayRace();
  }

  if (keyCode === ESCAPE) {
    if(playbackReplay) {
      playbackReplay = undefined;
      raceGhost = false;
      window.startLevel();
    }
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

function resizeCanvasIfNeeded() {
  let gameCanvas = document.getElementById('game-canvas');
  let canvasWidth = gameCanvas.offsetWidth;
  let canvasHeight = gameCanvas.offsetHeight;
  console.log("Resizing canvas to: " + canvasWidth + "x" + canvasHeight);
  resizeCanvas(canvasWidth, canvasHeight);
}

function watchLastReplay() {
  console.log("Watch last replay");
  watchReplay(lastReplay);
}

function watchReplay(replayObject) {
  playbackReplay = replayObject.replayData;
  window.startLevel(replayObject.levelId);
}

function toggleReplayRace() {
  raceGhost = !raceGhost;
  window.startLevel();
}

function createReplayObject(levelName, finishTime, inputReplay) {
  return {id: 1, levelId: levelName, finishTime: Math.floor(finishTime), playerId: 1, replayData: inputReplay, date:getCurrentDate()};
}

async function saveReplayToServer(replayObject) {
  const url = `${apiUrl}/api/save-score`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(replayObject)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log('Replay saved:', data);
  } catch (error) {
    console.error('Failed to save replay:', error);
  }
}

function getCurrentNickname() {
  return "GUEST";
}

function getCurrentDate() {
  return Date.now();
}

async function fetchReplays() {
  const url = `${apiUrl}/api/get-highscores?levelId=` + currentLevel;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch replays:', error);
    return [];
  }
}

function displayReplays(replays) {
  const replayListDiv = document.getElementById('replay-list');
  replayListDiv.innerHTML = '';

  if (replays.length === 0) {
    replayListDiv.textContent = 'No replays found.';
    return;
  }

  const ul = document.createElement('ul');
  replays.forEach(replay => {
    const li = document.createElement('li');
    li.textContent = `Level: ${replay.levelId}, Time: ${(replay.finishTime / 1000).toFixed(2)}s`;

    const button = document.createElement('button');
    button.textContent = 'Watch Replay';
    button.onclick = function() {
      watchReplay(replay);
    };

    li.appendChild(button);
    ul.appendChild(li);
  });

  replayListDiv.appendChild(ul);
}
