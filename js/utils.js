function loadLevelFromFile() {
    wybierzPlikJSON().then(json => {
        currentLevel = json;
        console.log('Załadowano poziom:', currentLevel);
        window.startLevel("nothing", false);
    }).catch(console.error);
}


async function wybierzPlikJSON() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';

        input.addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file) return reject('Nie wybrano pliku');

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const jsonData = JSON.parse(reader.result);
                    resolve(jsonData);
                } catch (error) {
                    reject('Błąd parsowania JSON');
                }
            };
            reader.readAsText(file);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    });
}


function isCanvasFocused() {
    return canvasWasClickedLast;
}


function getCurrentDate() {
    return Date.now();
}



function resizeCanvasIfNeeded() {
    let gameCanvas = document.getElementById('game-canvas');
    let canvasWidth = gameCanvas.offsetWidth;
    let canvasHeight = gameCanvas.offsetHeight;
    console.log("Resizing canvas to: " + canvasWidth + "x" + canvasHeight);
    resizeCanvas(canvasWidth, canvasHeight);
}


function showFPS() {
    push();
    fill(255);
    textSize(20);
    text(frameRate().toFixed(0), 10, 20);
    text("Zoom: " + renderer.zoom.toFixed(2), 10, 40);
    pop();
}

function disableRightClick() {
    let canvas = document.getElementById("defaultCanvas0");
    canvas.addEventListener("contextmenu", event => event.preventDefault());
}

function getMedalIndexForTime(levelId, time) {
    const levelData = getLevelData(levelId);
    if (!levelData || !levelData.medals) {
        return -1; // No level data or medals defined
    }

    const formattedTime = parseFloat((time / 1000).toFixed(2)); // Format time to X.XXs

    for (let i = 0; i < levelData.medals.length; i++) {
        const medalTime = parseFloat(levelData.medals[i].toFixed(2)); // Format medal time for comparison
        if (formattedTime <= medalTime) {
            return i; // Medal index found
        }
    }

    return -1; // No medal reached
}
