let cachedLevels = {};

function getLevelData(levelName) {
  if (cachedLevels[levelName]) {
    console.log("returning cached: ", levelName);
    return { ...cachedLevels[levelName] }; // Return cached level
  } else {
    console.log("fetching from server: ", levelName);
    const fetchedLevel = fetchLevel(levelName);
    cachedLevels[levelName] = fetchedLevel;
    return fetchedLevel;
  }
}

function fetchLevel(levelName) {
  console.log("Fetching " + levelName);

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `levels/${levelName}.json`, false); // 👈 Synchronous request
  xhr.send(null);

  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  } else {
    console.error(`Error fetching level: ${levelName} (Status: ${xhr.status})`);
    return null;
  }
}
