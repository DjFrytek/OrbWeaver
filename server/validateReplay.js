const { workerData, parentPort } = require('worker_threads');

// Get the replay data from the main thread
const replay = workerData;

const diamondTime = parseFloat(replay.medalTimes[0]);
const humanlyFastTime = diamondTime * 0.8;
const formattedFinishTime = parseFloat((replay.finishTime / 1000).toFixed(2));

// Send the result back to the main thread
parentPort.postMessage(formattedFinishTime > humanlyFastTime);
process.exit();