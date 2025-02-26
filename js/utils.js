
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