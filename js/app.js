let canvas;
let physicsEngine;
let player;
let currentLevel;
let renderer;
let zoomPersist = 1;

let mouseHeldInsideCanvas = false;

let lastReplay;

let playbackReplay; //Input data to play
let raceGhost = false;
let ghost;

let canvasWasClickedLast = false;
let needRefreshReplays = false;

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://orbweaver.onrender.com';

function setup() {
  canvas = createCanvas(600, 600);
  canvas.parent('game-canvas');
  frameRate(60);

  window.startLevel("level1");
  resizeCanvasIfNeeded();
  
  let canvasContainer = document.getElementById('canvas-container');
  const resizeObserver = new ResizeObserver(entries => {
    resizeCanvasIfNeeded();
  });

  resizeObserver.observe(canvasContainer);

  showLevelSelectionOverlay();

  disableRightClick();
}

function draw() {
  if (physicsEngine.update()) {
    
  }
  renderer.drawAll(player, currentLevel.objects);
  showFPS();
}

window.startLevel = function(levelName = currentLevel.name, loadFromName = true) {
  let sameLevel = levelName == currentLevel?.name;
  if(!sameLevel) {
    playbackReplay = undefined;
    raceGhost = false;
  }
  let shouldFetchReplays = !sameLevel || needRefreshReplays;
  needRefreshReplays=false;

  if(loadFromName) loadLevel(levelName);
  console.log("current", currentLevel.name);
  if(!raceGhost) {
    player = new Player(currentLevel.player.startPosition.x, currentLevel.player.startPosition.y, currentLevel.player, playbackReplay);
    ghost = undefined;
  } else {
    player = new Player(currentLevel.player.startPosition.x, currentLevel.player.startPosition.y, currentLevel.player);
    ghost = new Player(currentLevel.player.startPosition.x, currentLevel.player.startPosition.y, currentLevel.player, playbackReplay, true);
  }
  renderer = new Renderer(canvas, currentLevel, zoomPersist, player, ghost);
  physicsEngine = new PhysicsEngine(60, currentLevel, player, ghost);

  hideDarkOverlay();
  hideLevelFinishOverlay();
  hideLevelSelectionOverlay();
  showLevelRankings();
  hideGlobalRanking();
  canvas.elt.classList.remove("blurred");

  if(shouldFetchReplays) fetchReplays().then(replays => displayReplays(replays));
}

function loadLevel(levelName) {
  console.log("loading: " + levelName);
  currentLevel = JSON.parse(JSON.stringify(getLevelData(levelName)));
}

async function levelFinished(finishTime, isScoreLegit) {
  showDarkOverlay();
  showLevelFinishOverlay();

  document.getElementById("level-finish-time").textContent = (finishTime / 1000).toFixed(2);

  document.getElementById("watch-replay-button").onclick = () => {watchLastReplay()};
  document.getElementById("restart-level-button").onclick = () => {window.startLevel()};
  document.getElementById("watch-replay-again-button").onclick = () => {window.startLevel()};
  document.getElementById("quit-replay-button").onclick = () => {stopWatchingReplay()};
  document.getElementById("go-to-level-selection-button").onclick = () => {showLevelSelectionOverlay()};

  let finishOverlayEl = document.getElementById("level-finish-overlay");
  
  if(isPlayingReplay()) {
    finishOverlayEl.classList.add("replayFinished");
    finishOverlayEl.classList.remove("playerFinished");
  } else {
    finishOverlayEl.classList.add("playerFinished");
    finishOverlayEl.classList.remove("replayFinished");
  }

  if(isScoreLegit) {
    console.log("LEVEL FINISHED! TIME: " + finishTime);
    lastReplay = await createReplayObject(currentLevel.name, physicsEngine.getFinishTime(), player.inputReplay);

    saveReplayToServer(lastReplay);
  }
  else console.log("REPLAY FINISHED! TIME: " + finishTime);

}

function mouseWheel(event) {
  if(!isMouseInsideCanvas()) return;
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
  if(!isCanvasFocused()) return;
  if (key === 'r' || key === 'R') {
    window.startLevel();
  }

  if (key === 'g' || key === 'G') {
    if(playbackReplay) toggleReplayRace();
  }

  if (keyCode === ESCAPE) {
    if(playbackReplay) {
      stopWatchingReplay();
    } else {
      showLevelSelectionOverlay();
    }
  }
}

function isMouseInsideCanvas() {
  return mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height;
}

function mousePressed() {
  if(isMouseInsideCanvas()) {
    canvasWasClickedLast = true;
    physicsEngine.start();
    mouseHeldInsideCanvas = true;
  }
  else canvasWasClickedLast = false;
}

function mouseReleased() {
  mouseHeldInsideCanvas = false;
}

function watchLastReplay() {
  console.log("Watch last replay");
  raceGhost = false;
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

async function createReplayObject(levelName, finishTime, inputReplay) {
  const token = getItem('supabase.auth.token');
  return { levelId: levelName, finishTime: Math.floor(finishTime), token, replayData: inputReplay, date:getCurrentDate()};
}

async function saveReplayToServer(replayObject) {
  const url = apiUrl + '/api/save-score';
  const token = replayObject.token;
  if(!token) {
    console.log("Not logged in, replay wont be saved");
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(replayObject)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 200 || response.status === 201) {
      needRefreshReplays = true;
    }

    const data = await response.text();
    console.log('Replay saved:', data);
  } catch (error) {
    console.error('Failed to save replay:', error);
  }
}

async function fetchReplays() {
  console.log("fetching replays for " + currentLevel.name);
  const url = `${apiUrl}/api/get-highscores?levelId=` + currentLevel.name;

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

async function displayReplays(replays) {
  const userReplayInfoDiv = document.getElementById('user-replay-container');

  const token = localStorage.getItem('supabase.auth.token');
  
  if (token) {
    try {
      const response = await fetch(`${apiUrl}/api/get-my-ranking-on-level?levelId=${currentLevel.name}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const userReplayTable = document.getElementById('user-replay-table').getElementsByTagName('tbody')[0];
      userReplayTable.innerHTML = '';

      if (data.replay) {
        const row = userReplayTable.insertRow();

        const rankCell = row.insertCell();
        rankCell.textContent = "#" + data.rank;

        const timeCell = row.insertCell();
        timeCell.textContent = (data.replay.finishTime / 1000).toFixed(2);

        const nicknameCell = row.insertCell();
        nicknameCell.textContent = data.replay.users.nickname;

        const replayCell = row.insertCell();
        const button = document.createElement('button');
        button.textContent = 'Watch Replay';
        button.onclick = function() {
          watchReplay(data.replay);
        };
        replayCell.appendChild(button);
        userReplayInfoDiv.style.display = 'block';
      } else {
        const row = userReplayTable.insertRow();
        const cell = row.insertCell();
        cell.textContent = "No replay found for you on this level.";
        cell.colSpan = 4;

      }
    } catch (error) {
      console.error('Error fetching user ranking:', error);
    }
  } else {
    userReplayInfoDiv.style.display = 'none';
  }

  populateReplayTable(replays);
}

function populateReplayTable(replays) {
  const replayTable = document.getElementById('replay-table').getElementsByTagName('tbody')[0];
  replayTable.innerHTML = '';

  if (replays.length === 0) {
    const row = replayTable.insertRow();
    const cell = row.insertCell();
    cell.textContent = 'No replays found.';
    cell.colSpan = 4;
    return;
  }

  replays.forEach((replay, index) => {
    const row = replayTable.insertRow();

    const rankCell = row.insertCell();
    rankCell.textContent = "#" + (index + 1);

    const timeCell = row.insertCell();
    timeCell.textContent = (replay.finishTime / 1000).toFixed(2);

    const nicknameCell = row.insertCell();
    nicknameCell.textContent = replay.users.nickname;

    const replayCell = row.insertCell();
    const button = document.createElement('button');
    button.innerHTML = 'Watch<br>Replay';
    button.onclick = function() {
      watchReplay(replay);
    };
    replayCell.appendChild(button);
    });
}

async function updateGlobalRanking() {
    try {
        const response = await fetch(`${apiUrl}/api/get-global-ranking`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rankingData = await response.json();
        console.log(rankingData);

        const tableBody = document.querySelector('#player-ranking-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        rankingData.forEach((player, index) => {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            rankCell.textContent = "#" + (index + 1);
            row.appendChild(rankCell);

            const nicknameCell = document.createElement('td');
            nicknameCell.textContent = player.nickname;
            row.appendChild(nicknameCell);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = floor(player["total_score"]);
            row.appendChild(scoreCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating global ranking:', error);
    }
}

function isPlayingReplay() {
  return player.isPlayback;
}

function stopWatchingReplay() {
  playbackReplay = undefined;
  raceGhost = false;
  window.startLevel();
}

function showElement(elementId) {
  let element = document.getElementById(elementId);
  if (element) {
    element.classList.remove("hidden");
    element.classList.add("visible");
  }
}

function showDarkOverlay() {
  let canvasContainer = document.getElementById('canvas-container');
  canvasContainer.classList.add("blurred");
  let darkOverlay = document.getElementById('dark-overlay');
  darkOverlay.classList.add("darkened");
  canvas.elt.classList.add("blurred");
  showElement("overlay-container");
}

function hideDarkOverlay() {
  let canvasContainer = document.getElementById('canvas-container');
  canvasContainer.classList.remove("blurred");
  let darkOverlay = document.getElementById('dark-overlay');
  darkOverlay.classList.remove("darkened");
  hideElement("overlay-container");
}

function hideLevelFinishOverlay() {
  hideElement("level-finish-overlay");
}

function showLevelFinishOverlay() {
  showElement("level-finish-overlay");
}

function hideElement(elementId) {
  let element = document.getElementById(elementId);
  if (element) {
    element.classList.remove("visible");
    element.classList.add("hidden");
  }
}

function showLevelSelectionOverlay() {
  showDarkOverlay();
  hideLevelFinishOverlay();
  hideLevelRankings();
  showElement("level-selection-overlay");
  showGlobalRanking();
  physicsEngine.finished = true;
}

function hideLevelSelectionOverlay() {
  hideElement("level-selection-overlay");
}

function hideLevelRankings() {
  hideElement("level-rankings-container");
}

function showLevelRankings() {
  showElement("level-rankings-container");
}

function showGlobalRanking() {
  updateGlobalRanking();
  showElement("player-ranking-container");
}

function hideGlobalRanking() {
  hideElement("player-ranking-container");
}
