let levelBound = {
    width: 800,
    height: 600
};

let cameraX = 0;
let cameraY = 0;
let zoom = 1;

let snapGridSize = 5;

let obstacles = [];
let selectedObstacle = null;
let selectedHandle = null; // null, 'position', or 'size'
let handleOffset = { x: 0, y: 0 };
let lastSelectedObstacle = null;
let strengthSlider;
let strengthValueInput;

function setup() {
    createCanvas(800, 800);

    strengthSlider = document.getElementById('strength');
    strengthValueInput = document.getElementById('strengthValue');

    strengthSlider.addEventListener('input', function() {
        if (lastSelectedObstacle) {
            lastSelectedObstacle.force = parseFloat(strengthSlider.value);
            strengthValueInput.value = strengthSlider.value;
        }
    });

    strengthValueInput.addEventListener('input', function() {
        if (lastSelectedObstacle) {
            lastSelectedObstacle.force = parseFloat(strengthValueInput.value);
            strengthSlider.value = strengthValueInput.value;
        }
    });

        let saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function() {
            let levelName = document.getElementById('levelName').value;
            let startX = parseFloat(document.getElementById('startX').value);
            let startY = parseFloat(document.getElementById('startY').value);
            let forceCheckpointOrder = document.getElementById('forceCheckpointOrder').checked;
            let diamondTime = parseFloat(document.getElementById('diamondTime').value);
            let goldTime = parseFloat(document.getElementById('goldTime').value);
            let silverTime = parseFloat(document.getElementById('silverTime').value);
            let bronzeTime = parseFloat(document.getElementById('bronzeTime').value);

            let levelData = {
                name: levelName,
                objects: [],
                player: {
                    drag: 0.96,
                    steeringForce: 0.2,
                    startPosition: { x: startX, y: startY },
                    bounds: { width: levelBound.width, height: levelBound.height }
                },
                settings: {
                    forceCheckpointOrder: forceCheckpointOrder
                },
                medals: [diamondTime, goldTime, silverTime, bronzeTime]
        };

        for (let obstacle of obstacles) {
            let type;
            if(obstacle.type == "wall") type = obstacle.force === 1 ? "deathwall" : "wall";
            else {
                type = obstacle.type;
            }
            levelData.objects.push({
                x: obstacle.x,
                y: obstacle.y,
                r: obstacle.size,
                type: type,
                strength: obstacle.force
            });
        }

        let json = JSON.stringify(levelData, null, 2);
        saveJSON(levelData, document.getElementById('levelName').value + '.json');
    });

    let loadInput = document.getElementById('loadInput');
    loadInput.addEventListener('change', function(event) {
        let file = event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let contents = e.target.result;
                try {
                    let levelData = JSON.parse(contents);
                    obstacles = [];
                    for (let obj of levelData.objects) {
                        if(obj.type == "wall" || obj.type == "deathwall") {
                            let obstacle = new Obstacle(obj.x, obj.y, obj.r, "wall", obj.strength);
                            obstacles.push(obstacle);
                        } else {
                            let obstacle = new Obstacle(obj.x, obj.y, obj.r, obj.type);
                            obstacles.push(obstacle);
                        }
                    }
                    levelBound.width = levelData.player.bounds.width;
                    levelBound.height = levelData.player.bounds.height;
                    strengthSlider.value = 0.5;
                    strengthValueInput.value = 0.5;
                    document.getElementById('levelWidth').value = levelBound.width;
                    document.getElementById('levelHeight').value = levelBound.height;
                    document.getElementById('levelName').value = levelData.name;
                    document.getElementById('startX').value = levelData.player.startPosition.x;
                    document.getElementById('startY').value = levelData.player.startPosition.y;
                    if (levelData.settings) {
                        document.getElementById('forceCheckpointOrder').checked = levelData.settings.forceCheckpointOrder;
                    }
                    if (levelData.medals) {
                        document.getElementById('diamondTime').value = levelData.medals[0];
                        document.getElementById('goldTime').value = levelData.medals[1];
                        document.getElementById('silverTime').value = levelData.medals[2];
                        document.getElementById('bronzeTime').value = levelData.medals[3];
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    alert("Failed to load level: Invalid JSON format.");
                }
            };
            reader.readAsText(file);
        }
    });

    let levelWidthInput = document.getElementById('levelWidth');
    let levelHeightInput = document.getElementById('levelHeight');

    levelWidthInput.addEventListener('change', function() {
        levelBound.width = parseInt(levelWidthInput.value);
    });

    levelHeightInput.addEventListener('change', function() {
        levelBound.height = parseInt(levelHeightInput.value);
    });

    canvas.addEventListener('wheel', function(event) {
        zoom += event.deltaY * -0.001;
        // Restrict scale
        zoom = Math.min(Math.max(.125, zoom), 4);
    });
}

function keyPressed() {
    if (document.activeElement.tagName === 'INPUT') {
        return;
    }

    if(mouseX < 0) return;
    if(mouseX > width) return;
    if(mouseY < 0) return;
    if(mouseY > height) return;

    if (keyCode === 32) { // Spacebar
        if (selectedObstacle) {
            //COPY
        } else {
            addObstacle(0.5);
        }
    } else if (keyCode >= 48 && keyCode <= 57) { // Numbers 1-9
        let strength = 0;
        switch (keyCode) {
            case 48: strength = 1; break;
            case 49: strength = 0; break;
            case 50: strength = 0.1; break;
            case 51: strength = 0.2; break;
            case 52: strength = 0.35; break;
            case 53: strength = 0.65; break;
            case 54: strength = 0.8; break;
            case 55: strength = 0.9; break;
            case 56: strength = 0.95; break;
            case 57: strength = 0.98; break;
        }
        if (selectedObstacle) {
            selectedObstacle.force = strength;
        } else {
            addObstacle(strength);
        }
    }

    if (selectedObstacle) {
        if (keyCode === 46) { //DELETE
            let index = obstacles.indexOf(selectedObstacle);
            if (index > -1) {
                obstacles.splice(index, 1);
                selectedObstacle = null;
                lastSelectedObstacle = null;
            }
        }

        let index = obstacles.indexOf(selectedObstacle);
        if (keyCode === 81) { // Q
            if (index > 0) {
                let temp = obstacles[index];
                obstacles[index] = obstacles[index - 1];
                obstacles[index - 1] = temp;
            }
        }
        if (keyCode === 69) { // E
            if (index < obstacles.length - 1) {
                let temp = obstacles[index];
                obstacles[index] = obstacles[index + 1];
                obstacles[index + 1] = temp;
            }
        }
    }
    if (keyCode === 70) { // F
        addFinish();
    }
    if (keyCode === 67) { // C
        addCheckpoint();
    }
}

function draw() {
    background(50);

    if (keyIsDown(87)) { // W
        cameraY += getCameraSpeed();
    }
    if (keyIsDown(83)) { // S
        cameraY -= getCameraSpeed();
    }
    if (keyIsDown(65)) { // A
        cameraX += getCameraSpeed();
    }
    if (keyIsDown(68)) { // D
        cameraX -= getCameraSpeed();
    }

    drawLevel();
    drawDebugInfo();
}

function drawLevel() {
    push();
    translate(cameraX, cameraY);
    scale(zoom);

    // Draw circles
    for (let obstacle of obstacles) {
        obstacle.draw();
    }

    // Draw handles
    for (let obstacle of obstacles) {
        obstacle.drawHandles();
    }

    drawBounds();
    drawStartPosition();

    pop();
}

function drawStartPosition() {
    push();
    fill(0, 0, 255);
    strokeWeight(2);
    stroke(0, 255, 0);
    let startX = parseFloat(document.getElementById('startX').value);
    let startY = parseFloat(document.getElementById('startY').value);
    ellipse(startX, startY, 5);
    pop();
}

function drawBounds() {
    push();
    noFill();
    strokeWeight(4);
    stroke(255, 0, 0);
    rect(0, 0, levelBound.width, levelBound.height);
    pop();

}

function addObstacle(str) {
    let mousePos = getMousePosition();
    let obstacle = new Obstacle(mousePos.x, mousePos.y, 20, "wall", str);
    obstacles.push(obstacle);
}

function addFinish() {
    let mousePos = getMousePosition();
    let obstacle = new Obstacle(mousePos.x, mousePos.y, 20, "finish");
    obstacles.push(obstacle);
}

function addCheckpoint() {
    let mousePos = getMousePosition();
    let obstacle = new Obstacle(mousePos.x, mousePos.y, 20, "checkpoint");
    obstacles.push(obstacle);
}

function getCameraSpeed() {
    return 5;
}

class Obstacle {
    constructor(x, y, size, type, force) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.force = force;
        this.handleSize = 10;
        this.sizeHandleX = this.x + this.size / 2;
        this.sizeHandleY = this.y;

        this.type = type;
    }

    draw() {
        push();
        noStroke();
        if(this.type == "wall") {
            let slowdownFactor = 1 - this.force;
            let x = pow(slowdownFactor, 0.5)
            let c = map(x, 1, 0, 50, 200);
            fill(c);
            if(this.force == 1) fill(255);
        } else if(this.type == "finish") {
            let c = color(0, 255, 0, 100);
            fill(c);
        } else if(this.type == "checkpoint") {
            let c = color(158, 49, 222, 100);
            fill(c);
        }
        ellipse(this.x, this.y, this.size);
        pop();
    }

    drawHandles() {
        push();
        fill(0, 0, 255);
        ellipse(this.sizeHandleX, this.sizeHandleY, this.handleSize);
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.handleSize);
        pop();
    }
}

function drawDebugInfo() {
    push();
    resetMatrix();
    fill(255);
    textSize(20);
    text("Zoom: " + zoom.toFixed(2), 20, 30);
    text("Camera X: " + cameraX.toFixed(2), 20, 60);
    text("Camera Y: " + cameraY.toFixed(2), 20, 90);
    pop();
}

function getMousePosition() {
    let x = (mouseX - cameraX) / zoom;
    let y = (mouseY - cameraY) / zoom;

    if(keyIsDown(16)) { //SHIFT
        x -= x % snapGridSize;
        y -= y % snapGridSize;
    }
    return { x, y };
}

function mousePressed() {
    let mousePos = getMousePosition();
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        let distanceToPositionHandle = dist(mousePos.x, mousePos.y, obstacle.x, obstacle.y);
        let distanceToSizeHandle = dist(mousePos.x, mousePos.y, obstacle.sizeHandleX, obstacle.sizeHandleY);

        if (distanceToPositionHandle < obstacle.handleSize / 2) {
            selectedObstacle = obstacle;
            selectedHandle = 'position';
            handleOffset.x = mousePos.x - obstacle.x;
            handleOffset.y = mousePos.y - obstacle.y;
            lastSelectedObstacle = obstacle;
            strengthSlider.value = obstacle.force;
            strengthValueInput.value = obstacle.force;
            return;
        } else if (distanceToSizeHandle < obstacle.handleSize / 2) {
            selectedObstacle = obstacle;
            selectedHandle = 'size';
            handleOffset.x = mousePos.x - obstacle.x;
            handleOffset.y = mousePos.y - obstacle.y;
            lastSelectedObstacle = obstacle;
            strengthSlider.value = obstacle.force;
            strengthValueInput.value = obstacle.force;
            return;
        }
    }
}

function mouseDragged() {
    if (selectedObstacle) {
        let mousePos = getMousePosition();
        if (selectedHandle === 'position') {
            let dx = selectedObstacle.sizeHandleX - selectedObstacle.x;
            let dy = selectedObstacle.sizeHandleY - selectedObstacle.y;

            selectedObstacle.x = mousePos.x;
            selectedObstacle.y = mousePos.y;

            selectedObstacle.sizeHandleX = selectedObstacle.x + dx;
            selectedObstacle.sizeHandleY = selectedObstacle.y + dy;
        } else if (selectedHandle === 'size') {
            selectedObstacle.sizeHandleX = mousePos.x;
            selectedObstacle.sizeHandleY = mousePos.y;
            selectedObstacle.size = dist(selectedObstacle.x, selectedObstacle.y, selectedObstacle.sizeHandleX, selectedObstacle.sizeHandleY) * 2;
        }
    }
}

function mouseReleased() {
    selectedObstacle = null;
    selectedHandle = null;
}
