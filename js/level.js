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
  if(levelName == "level3") return levelData3;
  
  return levelData1;
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
  },
  settings: {
    forceCheckpointOrder: false,
  }
};


const levelData2 = {
  name: "level2",
  objects: [
    { x: 292, y: 179, r: 50, type: "finish"},

    { x: 48, y: 37, r: 64, type: "wall", strength: 0.95 },

    { x: 88, y: 77, r: 99, type: "wall", strength: 0 },

    { x: 196, y: 200, r: 167, type: "wall", strength: 0.4 },
    { x: 265, y: 110, r: 124, type: "wall", strength: 0.4 },
    { x: 233, y: 21, r: 80, type: "wall", strength: 0.4 },
    { x: 293, y: 228, r: 62, type: "wall", strength: 0.4 },
    { x: 345, y: 198, r: 72, type: "wall", strength: 0.4 },
    { x: 367, y: 151, r: 40, type: "wall", strength: 0.4 },
    { x: 331, y: 266, r: 75, type: "wall", strength: 0.4 },
    { x: 259, y: 357, r: 96, type: "wall", strength: 0.4 },
    { x: 139, y: 301, r: 98, type: "wall", strength: 0.4 },
    { x: 16, y: 384, r: 96, type: "wall", strength: 0.4 },
    { x: 15, y: 225, r: 137, type: "wall", strength: 0.4 },
    { x: 88, y: 77, r: 79, type: "wall", strength: 0.4 },
    { x: 143, y: 130, r: 50, type: "wall", strength: 0.4 },
    { x: 167, y: 98, r: 34, type: "wall", strength: 0.4 },
    { x: 240, y: 50, r: 75, type: "wall", strength: 0.4 },

    { x: 196, y: 200, r: 152, type: "wall", strength: 0.95 },
    { x: 265, y: 110, r: 109, type: "wall", strength: 0.95 },
    { x: 233, y: 21, r: 65, type: "wall", strength: 0.95 },
    { x: 290, y: 235, r: 55, type: "wall", strength: 0.95 },
    { x: 345, y: 198, r: 57, type: "wall", strength: 0.95 },
    { x: 367, y: 151, r: 25, type: "wall", strength: 0.95 },
    { x: 360, y: 171, r: 28, type: "wall", strength: 0.95 },
    { x: 331, y: 266, r: 60, type: "wall", strength: 0.95 },
    { x: 259, y: 357, r: 81, type: "wall", strength: 0.95 },
    { x: 139, y: 301, r: 83, type: "wall", strength: 0.95 },
    { x: 16, y: 384, r: 81, type: "wall", strength: 0.95 },
    { x: 15, y: 225, r: 122, type: "wall", strength: 0.95 },
    { x: 88, y: 77, r: 64, type: "wall", strength: 0.95 },
    { x: 143, y: 130, r: 35, type: "wall", strength: 0.95 },
    { x: 167, y: 98, r: 19, type: "wall", strength: 0.95 },
    { x: 167, y: 98, r: 30, type: "wall", strength: 0.95 },

    { x: 196, y: 200, r: 135, type: "deathwall"},
    { x: 265, y: 110, r: 100, type: "deathwall"},
    { x: 240, y: 50, r: 60, type: "deathwall"},

  ],
  player: {
    drag: 0.96,
    steeringForce: 0.2,
    startPosition: { x: 192, y: 84 },
    bounds: { width: 400, height: 400 }
  }
};

const levelData3 = {
  "name": "level3",
  "objects": [
    {
      "x": 397.5,
      "y": 289,
      "r": 162.19741058352318,
      "type": "wall",
      "strength": 0.82
    },
    {
      "x": 397.5,
      "y": 289,
      "r": 162.19741058352318,
      "type": "wall",
      "strength": 0.82
    },
    {
      "x": 118.5,
      "y": 122,
      "r": 558.8702890653608,
      "type": "wall",
      "strength": 0.82
    },
    {
      "x": 240.41666666666663,
      "y": 158.33333333333331,
      "r": 277.89386463180495,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 191.36363636363635,
      "y": 173.63636363636363,
      "r": 285.59926846678076,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 193.5,
      "y": 174,
      "r": 259.3067681338071,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 192.5,
      "y": 174,
      "r": 224.0089283934906,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 91.5,
      "y": 253,
      "r": 234.38850339029398,
      "type": "wall",
      "strength": 0.82
    },
    {
      "x": 119.5,
      "y": 122,
      "r": 212.73457640919585,
      "type": "wall",
      "strength": 0.94
    },
    {
      "x": 186.61111111111111,
      "y": 61,
      "r": 36.010972264808416,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 223.3809523809523,
      "y": 337.90476190476164,
      "r": 109.77197557352794,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 204.1666666666666,
      "y": 54.99999999999998,
      "r": 16.70366264263653,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 97.49999999999997,
      "y": 253.57142857142844,
      "r": 127.34714657905032,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 249.95238095238085,
      "y": 337.5238095238092,
      "r": 94.81391250515496,
      "type": "wall",
      "strength": 0.29
    },
    {
      "x": 91.78571428571426,
      "y": 330.7142857142856,
      "r": 131.13771169273343,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 261.095238095238,
      "y": 331.99999999999994,
      "r": 86.680061759184,
      "type": "wall",
      "strength": 0.76
    },
    {
      "x": 91.78571428571426,
      "y": 330.7142857142856,
      "r": 107.55160128410688,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 96.07142857142854,
      "y": 269.9999999999999,
      "r": 86.47283400240889,
      "type": "wall",
      "strength": 0.65
    },
    {
      "x": 104.64285714285712,
      "y": 204.28571428571425,
      "r": 35.74284572341942,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 119.5,
      "y": 121,
      "r": 166.0120477555771,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 105.35714285714282,
      "y": 203.57142857142853,
      "r": 51.44840887248315,
      "type": "wall",
      "strength": 0.06
    },
    {
      "x": 94.2647058823529,
      "y": 288.57142857142856,
      "r": 93.8306793348322,
      "type": "wall",
      "strength": 0.64
    },
    {
      "x": 97.55494505494502,
      "y": 252.032967032967,
      "r": 107.2748834344165,
      "type": "wall",
      "strength": 0.79
    },
    {
      "x": 77.38095238095234,
      "y": 385.238095238095,
      "r": 64.80726702624047,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 139.7619047619047,
      "y": 323.8095238095237,
      "r": 20,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 125.76923076923075,
      "y": 478.46153846153834,
      "r": 158.73016812247548,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 125.76923076923075,
      "y": 478.46153846153834,
      "r": 122.93260769829519,
      "type": "wall",
      "strength": 0.82
    },
    {
      "x": 130.2036199095022,
      "y": 404.07239819004513,
      "r": 39.622096436111306,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 350.5,
      "y": 518,
      "r": 221.30521909796883,
      "type": "wall",
      "strength": 0.61
    },
    {
      "x": 520.4545454545454,
      "y": 409.090909090909,
      "r": 129.09090909090924,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 633.1818181818181,
      "y": 302.7272727272727,
      "r": 122.48123485890387,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 659.5454545454544,
      "y": 381.8181818181818,
      "r": 54.57574916292249,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 606.8181818181818,
      "y": 387.27272727272725,
      "r": 20,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 626.8181818181818,
      "y": 417.27272727272725,
      "r": 20,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 600.4545454545454,
      "y": 434.5454545454545,
      "r": 20,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 626.8181818181818,
      "y": 449.09090909090907,
      "r": 20,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 575.9090909090908,
      "y": 517.2727272727273,
      "r": 85.47388562576846,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 715.9090909090908,
      "y": 440,
      "r": 121.36959467839009,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 718.8461538461537,
      "y": 427.69230769230757,
      "r": 106.25413322973546,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 863.181818181818,
      "y": 434.5454545454545,
      "r": 258.4121891554891,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 715.9090909090909,
      "y": 539.0909090909091,
      "r": 67.49349524825664,
      "type": "wall",
      "strength": 0.64
    },
    {
      "x": 575.7692307692306,
      "y": 517.6923076923076,
      "r": 68.88804054534823,
      "type": "wall",
      "strength": 0.92
    },
    {
      "x": 574.230769230769,
      "y": 301.5384615384615,
      "r": 49.828106894466664,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 614.9999999999998,
      "y": 271.53846153846143,
      "r": 121.548198246792,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 698.0769230769229,
      "y": 226.1538461538461,
      "r": 117.93087936453436,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 693.4615384615383,
      "y": 333.84615384615375,
      "r": 114.68505884331003,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 656.5384615384614,
      "y": 164.61538461538458,
      "r": 69.4185487549444,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 774.9999999999999,
      "y": 96.92307692307689,
      "r": 113.81496454265657,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 654.9999999999999,
      "y": 118.46153846153844,
      "r": 61.55768930382315,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 628.8461538461538,
      "y": 81.53846153846153,
      "r": 89.23076923076906,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 504.99999999999994,
      "y": 27.692307692307686,
      "r": 124.94732617998103,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 668.8461538461538,
      "y": 230.76923076923075,
      "r": 122.01464651629723,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 474.2307692307691,
      "y": 159.2307692307692,
      "r": 106.86495376499853,
      "type": "wall",
      "strength": 0.5
    },
    {
      "x": 474.23076923076917,
      "y": 160.76923076923072,
      "r": 83.27611447830364,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 505.7692307692307,
      "y": 28.46153846153844,
      "r": 96.28606294350058,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 520.3846153846152,
      "y": 241.53846153846152,
      "r": 128.062484748657,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 589.6153846153844,
      "y": 191.5384615384615,
      "r": 81.77035240565128,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 619.6153846153845,
      "y": 138.46153846153842,
      "r": 103.36355096763586,
      "type": "wall",
      "strength": 0.9
    },
    {
      "x": 427.3076923076922,
      "y": 201.5384615384615,
      "r": 114.5095019441747,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 518.75,
      "y": 222.49999999999994,
      "r": 124.2421470802525,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 428.076923076923,
      "y": 200.76923076923072,
      "r": 88.35110163299223,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 414.99999999999994,
      "y": 150.76923076923075,
      "r": 52.510917433464606,
      "type": "wall",
      "strength": 0
    },
    {
      "x": 185.41666666666663,
      "y": 19.166666666666657,
      "r": 41.79978734661486,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 470.4166666666666,
      "y": -103.33333333333331,
      "r": 20,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 350.4166666666666,
      "y": 558.0555555555555,
      "r": 135.84355789739266,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 612.0833333333333,
      "y": 238.83333333333334,
      "r": 120.88895271648657,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 460.4166666666666,
      "y": -93.33333333333331,
      "r": 20,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 429.58333333333326,
      "y": -133.33333333333331,
      "r": 20,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 417.08333333333326,
      "y": -149.99999999999997,
      "r": 20,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 384.58333333333326,
      "y": -154.16666666666666,
      "r": 20,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 352.08333333333326,
      "y": -139.16666666666666,
      "r": 20,
      "type": "deathwall",
      "strength": 1
    },
    {
      "x": 427,
      "y": 200,
      "r": 80,
      "type": "finish"
    }
  ],
  "player": {
    "drag": 0.96,
    "steeringForce": 0.2,
    "startPosition": {
      "x": 120,
      "y": 90
    },
    "bounds": {
      "width": 800,
      "height": 600
    }
  }
}
