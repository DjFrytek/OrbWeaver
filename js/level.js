let cachedLevels = {};

function getLevelData(levelName) {
  if(cachedLevels[levelName]) return cachedLevels[levelName];
  else {
    let fetchedLevel = fetchLevel(levelName);
    cachedLevels[levelName] = fetchedLevel;
    return fetchedLevel;
  }
}

//TODO Connect fetching levels to database
function fetchLevel(levelName) {
  console.log("fetching " + levelName);
  if(levelName == "level1") return levelData1;
  if(levelName == "level2") return levelData2;
}

const levelData1 = {
  name: "level1",
  objects: [
    { x: 300, y: 80, r: 60, type: "finish"},


    { x: 200, y: 200, r: 80, type: "wall", strength: 0.4 },
    { x: 180, y: 140, r: 100, type: "wall", strength: 0.4 },
    { x: 245, y: 220, r: 40, type: "wall", strength: 0.4 },
    { x: 240, y: 315, r: 110, type: "wall", strength: 0.4 },
    { x: 290, y: 150, r: 80, type: "wall", strength: 0.4 },
    { x: 270, y: 90, r: 70, type: "wall", strength: 0.4 },
    { x: 255, y: 30, r: 90, type: "wall", strength: 0.4 },
    { x: 185, y: 25, r: 90, type: "wall", strength: 0.4 },
    { x: 90, y: 70, r: 90, type: "wall", strength: 0.4 },
    { x: 390, y: 70, r: 90, type: "wall", strength: 0.4 },
    { x: 370, y: 250, r: 110, type: "wall", strength: 0.4 },
    { x: 115, y: 250, r: 80, type: "wall", strength: 0.4 },
    { x: 145, y: 290, r: 90, type: "wall", strength: 0.4 },
    { x: 80, y: 300, r: 85, type: "wall", strength: 0.4 },
    { x: 123, y: 400, r: 85, type: "wall", strength: 0.4 },
    { x: 20, y: 390, r: 85, type: "wall", strength: 0.4 },

    { x: 200, y: 200, r: 70, type: "wall", strength: 0.8 },
    { x: 180, y: 140, r: 90, type: "wall", strength: 0.8 },
    { x: 245, y: 220, r: 30, type: "wall", strength: 0.8 },
    { x: 240, y: 315, r: 100, type: "wall", strength: 0.8 },
    { x: 290, y: 150, r: 70, type: "wall", strength: 0.8 },
    { x: 270, y: 90, r: 60, type: "wall", strength: 0.8 },
    { x: 255, y: 30, r: 80, type: "wall", strength: 0.8 },
    { x: 185, y: 25, r: 80, type: "wall", strength: 0.8 },
    { x: 90, y: 70, r: 80, type: "wall", strength: 0.8 },
    { x: 390, y: 70, r: 80, type: "wall", strength: 0.8 },
    { x: 370, y: 250, r: 100, type: "wall", strength: 0.8 },
    { x: 115, y: 250, r: 70, type: "wall", strength: 0.8 },
    { x: 145, y: 290, r: 80, type: "wall", strength: 0.8 },
    { x: 80, y: 300, r: 75, type: "wall", strength: 0.8 },
    { x: 123, y: 400, r: 75, type: "wall", strength: 0.8 },
    { x: 20, y: 390, r: 75, type: "wall", strength: 0.8 },

    { x: 265, y: 60, r: 40, type: "wall", strength: 0.96 },
    { x: 280, y: 130, r: 50, type: "wall", strength: 0.96 },
    { x: 270, y: 90, r: 50, type: "deathwall"},



  ],
  player: {
    drag: 0.96,
    steeringForce: 0.2,
    startPosition: { x: 40, y: 200 },
    bounds: { width: 400, height: 400 }
  }
};


const levelData2 = {
  name: "level2",
  objects: [
    { x: 300, y: 80, r: 60, type: "finish"},

    { x: 300, y: 200, r: 60, type: "checkpoint"},
    { x: 300, y: 300, r: 60, type: "checkpoint"},
    { x: 100, y: 300, r: 60, type: "checkpoint"},


    { x: 200, y: 200, r: 80, type: "wall", strength: 0.4 },
    { x: 180, y: 140, r: 100, type: "wall", strength: 0.4 },

    { x: 20, y: 390, r: 75, type: "wall", strength: 0.8 },

    { x: 265, y: 60, r: 40, type: "wall", strength: 0.96 },
    { x: 280, y: 130, r: 50, type: "wall", strength: 0.96 },
    { x: 270, y: 90, r: 50, type: "deathwall"},



  ],
  player: {
    drag: 0.96,
    steeringForce: 0.2,
    startPosition: { x: 40, y: 200 },
    bounds: { width: 400, height: 400 }
  },
  settings: {
    forceCheckpointOrder: true, 
  }
};