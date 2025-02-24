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
        addObstacle(random(0.1, 0.9));
    }

    if (selectedObstacle) {
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
    push();
    strokeWeight(4);
    stroke(255, 0, 0);
    rect(0, 0, levelBound.width, levelBound.height);
    pop();
    
    // Draw circles
    for (let obstacle of obstacles) {
        obstacle.draw();
    }

    // Draw handles
    for (let obstacle of obstacles) {
        obstacle.drawHandles();
    }

    pop();
}

function addObstacle(str) {
    let mousePos = getMousePosition();
    let obstacle = new Obstacle(mousePos.x, mousePos.y, 20, str);
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
    return { x, y };
}

function mousePressed() {
    let mousePos = getMousePosition();
    for (let obstacle of obstacles) {
        let distanceToPositionHandle = dist(mousePos.x, mousePos.y, obstacle.x, obstacle.y);
        let distanceToSizeHandle = dist(mousePos.x, mousePos.y, obstacle.sizeHandleX, obstacle.sizeHandleY);

        if (distanceToPositionHandle < obstacle.handleSize / 2) {
            selectedObstacle = obstacle;
            selectedHandle = 'position';
            handleOffset.x = mousePos.x - obstacle.x;
            handleOffset.y = mousePos.y - obstacle.y;
            return;
        } else if (distanceToSizeHandle < obstacle.handleSize / 2) {
            selectedObstacle = obstacle;
            selectedHandle = 'size';
            handleOffset.x = mousePos.x - obstacle.x;
            handleOffset.y = mousePos.y - obstacle.y;
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

            selectedObstacle.x = mousePos.x - handleOffset.x;
            selectedObstacle.y = mousePos.y - handleOffset.y;

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
