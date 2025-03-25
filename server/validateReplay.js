const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const Victor = require('victor');

// Get the replay data from the main thread
const replay = workerData;

const diamondTime = parseFloat(replay.medalTimes[0]);
const humanlyFastTime = diamondTime * 0.8;
const formattedFinishTime = parseFloat((replay.finishTime / 1000).toFixed(2));

// Get the levelId from the replay data
const levelId = replay.levelId;

// Construct the path to the level JSON file
const levelFilePath = path.join(__dirname, '..', 'levels', `${levelId}.json`);

let validatedTime = 0;


// Read the level data from the JSON file
fs.readFile(levelFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the level file:', err);
        parentPort.postMessage({ error: 'Failed to load level data' });
        return;
    }

    // Parse the level data from JSON
    const levelData = JSON.parse(data);
    
    let finishedLevel = true;

    // Here you can do something with the levelData, such as further processing
    // (for example, using the Victor library or comparing data)
    let startPos = levelData.player.startPosition;
    let player = new Player(startPos.x, startPos.y, levelData.player, replay.replayData);
    let physicsEngine = new PhysicsEngine(60, levelData, player);

    console.log("Validating ", replay.levelId, " : ", replay.finishTime);
    for(let i = 0; i < 100000; i++) {
      physicsEngine.update();
      if(physicsEngine.elapsedTime > replay.finishTime + 1000) {
        console.log("Validation time passed");
        finishedLevel = false;
        break;
      }
    }
    if(player.dead) {
      console.log("player died");
      finishedLevel = false;
    }
    
    if(parseFloat((validatedTime / 1000).toFixed(2)) != parseFloat((replay.finishTime / 1000).toFixed(2))) {
      console.log("Times dont match");
      console.log("supposed time: ", replay.finishTime, " validated time: ", validatedTime);
      finishedLevel = validatedTime;
    }
    if(!finishedLevel) console.log("cheated replay ", replay.levelId, replay.finishTime);


    // Send the result back to the main thread
    let x = Math.floor(validatedTime);
    parentPort.postMessage(x);
});


class PhysicsEngine {
  constructor(fps, levelData, mainPlayer) {
    this.fps = fps;
    this.deltaTime = 1000 / fps;
    this.updateCount = 0;
    this.elapsedTime = 0;
    this.started = true;
    this.finished = false;
    this.level = levelData;

    this.player = mainPlayer;
  }

  update() {
    if (!this.started || this.finished) return false;

    if (this.started) {
      this.elapsedTime = this.updateCount * this.deltaTime;
      this.updateCount++;
    }

    this.updatePlayer(this.player);

    return true;
  }

  updatePlayer(player) {
    let direction = player.getInput(true);


    let str = direction.magnitude(); // Obliczanie długości wektora (magnitude)
    str = Math.min(str, 1); // Ograniczenie prędkości do maksymalnej wartości 1
    direction.normalize(); // Normalizowanie wektora
    
    direction.multiply(toVic(str * player.steeringForce)); // Skalowanie wektora siły kierunku

    player.velocity.add(direction); // Dodanie kierunku do prędkości

    let collision = this.checkWallCollisions(player);
    player.isColliding = collision.isColliding;

    player.velocity.multiply(toVic(player.drag)); // Zastosowanie oporu (drag)
    let slowedVelocity = new Victor(player.velocity.x, player.velocity.y);
    slowedVelocity.multiply(toVic(collision.slowdownFactor)); // Spowolnienie prędkości przez współczynnik
    player.pos.add(slowedVelocity); // Aktualizacja pozycji

    if (player.pos.x < 0 || player.pos.x > this.level.player.bounds.width || player.pos.y < 0 || player.pos.y > this.level.player.bounds.height) {
      player.die();
    }
  }

  checkWallCollisions(player) {
    let isPhysical = true;
    let collision = { isColliding: false, slowdownFactor: 1 };

    let nextCheckpoint;
    for (let i = this.level.objects.length - 1; i >= 0; i--) {
      let obj = this.level.objects[i];

      if (obj.type == "checkpoint") {
        if (!nextCheckpoint && !obj.collected) nextCheckpoint = obj;
      }

      let distance = player.pos.distance(new Victor(obj.x, obj.y)); // Obliczanie odległości między graczami

      if (distance < obj.r / 2) {
        if (obj.type == "wall") {
          if (obj.strength != 0) collision.isColliding = true;
          collision.slowdownFactor = 1 - obj.strength;
          break;
        } else if (obj.type == "deathwall") {
          if (isPhysical) player.die();
          break;
        } else if (obj.type == "finish") {
          if (this.isCheckpointsCollected()) {
            if (isPhysical) {
              levelFinished(this.elapsedTime);
              this.finished = true;
            } else {
              player.freeze();
            }
          }
        } else if (obj.type == "checkpoint") {
          if (isPhysical && (!this.level.settings.forceCheckpointOrder || nextCheckpoint == obj)) obj.collected = true;
        }
      }
    }
    return collision;
  }

  stopLevel() {
    this.finished = true;
    player.freeze();
  }

  isCheckpointsCollected() {
    let objects = this.level.objects;
    for (let obj of objects) {
      if (obj.type == "checkpoint") {
        if (!obj.collected) return false;
      }
    }
    return true;
  }

  getDistToPlayer(x, y) {
    return this.player.pos.distance(new Victor(x, y)); // Użycie Victor.js do obliczenia odległości
  }

  getFinishTime() {
    return this.elapsedTime;
  }
}

function levelFinished(time) {
  formattedTime = parseFloat((time / 1000).toFixed(2));
  console.log("Finished time", formattedTime);
  validatedTime = time;
}

function toVic(v) {
  return new Victor(v, v);
}


class Player {
  constructor(x, y, physics, replay) {
    this.pos = new Victor(x, y); // Tworzenie wektora pozycji z Victor.js
    this.drag = physics.drag;
    this.steeringForce = physics.steeringForce;
    this.velocity = new Victor(0, 0); // Inicjalizacja wektora prędkości
    this.isColliding = false;
    this.dead = false;

    this.inputReplay = replay;
    this.playbackIndex = 0; // Które wejście ma zostać odczytane
  }

  getInput(advancePlayback = false) {
    let i = Math.min(this.playbackIndex, this.inputReplay.length - 1); // Zmiana min na Math.min
    let inp = this.inputReplay[i];
    let dir = new Victor(inp.x, inp.y); // Tworzenie wektora kierunku z Victor.js
    if (advancePlayback) this.playbackIndex++;
    return dir;
  }

  freeze() {
    this.velocity.multiply(toVic(0)); // Zamrożenie prędkości
  }

  die() {
    this.dead = true;
  }
}