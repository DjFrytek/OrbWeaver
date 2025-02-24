let levelBound = {
    width: 800,
    height: 600
};

let cameraX = 0;
let cameraY = 0;
let zoom = 1;

let obstacles = [];
let selectedObstacle = null;
let selectedHandle = null; // null, 'position', or 'size'
let handleOffset = { x: 0, y: 0 };

function setup() {
    createCanvas(800, 800);

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
    if (keyCode === 32) { // Spacebar
        addObstacle();
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

    // put drawing code here
    noFill();
    strokeWeight(4);
    stroke(255, 0, 0);
    rect(0, 0, levelBound.width, levelBound.height);

    for (let obstacle of obstacles) {
        obstacle.draw();
    }

    pop();
}

function addObstacle() {
    let mousePos = getMousePosition();
    let obstacle = new Obstacle(mousePos.x, mousePos.y, 20, 0.8);
    obstacles.push(obstacle);
}

function getCameraSpeed() {
    return 5;
}

class Obstacle {
    constructor(x, y, size, force) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.force = force;
        this.handleSize = 10;
        this.sizeHandleX = this.x + this.size / 2;
        this.sizeHandleY = this.y;
    }

    draw() {
        push();
        noStroke();
        let c = map(this.force, 0, 1, 50, 250);
        fill(c);
        ellipse(this.x, this.y, this.size);
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
    return { x, y };
}

function mousePressed() {
    let mousePos = getMousePosition();
    for (let obstacle of obstacles) {
        let distanceToPositionHandle = dist(mousePos.x, mousePos.y, obstacle.x, obstacle.y);
        let distanceToSizeHandle = dist(mousePos.x, mousePos.y, obstacle.sizeHandleX, obstacle.sizeHandleY);

        if (distanceToPositionHandle < obstacle.handleSize) {
            selectedObstacle = obstacle;
            selectedHandle = 'position';
            handleOffset.x = mousePos.x - obstacle.x;
            handleOffset.y = mousePos.y - obstacle.y;
            return;
        } else if (distanceToSizeHandle < obstacle.handleSize) {
            selectedObstacle = obstacle;
            selectedHandle = 'size';
            handleOffset.x = mousePos.x - obstacle.sizeHandleX;
            handleOffset.y = mousePos.y - obstacle.sizeHandleY;
            return;
        }
    }
}

function mouseDragged() {
    if (selectedObstacle) {
        let mousePos = getMousePosition();
        if (selectedHandle === 'position') {
            selectedObstacle.x = mousePos.x - handleOffset.x;
            selectedObstacle.y = mousePos.y - handleOffset.y;
            selectedObstacle.sizeHandleX = selectedObstacle.x + selectedObstacle.size / 2;
            selectedObstacle.sizeHandleY = selectedObstacle.y;
        } else if (selectedHandle === 'size') {
            let newSize = dist(selectedObstacle.x, selectedObstacle.y, mousePos.x, mousePos.y) * 2;
            selectedObstacle.size = newSize;
            selectedObstacle.sizeHandleX = selectedObstacle.x + selectedObstacle.size / 2;
            selectedObstacle.sizeHandleY = selectedObstacle.y;
        }
    }
}

function mouseReleased() {
    selectedObstacle = null;
    selectedHandle = null;
}
