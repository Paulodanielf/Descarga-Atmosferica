let points = [];
const numPoints = 50; // Reducir el número de puntos
const maxDist = 80;  // Aumentar la distancia máxima para conectar los puntos
const maxDistM = 160;  // Aumentar la distancia máxima para conectar los puntos
let referenceY = 0;
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('effectArea');
    for (let i = 0; i < numPoints; i++) {
        points.push(new Point(random(width), random(height)));
    }
    window.addEventListener('mousemove', updateReference);
}

function draw() {
    clear();
    
    adjustedMouseY = mouseY + window.scrollY - referenceY;
    for (let i = 0; i < points.length; i++) {
        points[i].move();
        points[i].display();
    }
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            let d = dist(points[i].x, points[i].y, points[j].x, points[j].y);
            if (d < maxDist) {
                drawZigzagLine(points[i].x, points[i].y, points[j].x, points[j].y, d, maxDist);
            }
        }
        let d = dist(points[i].x, points[i].y, mouseX, adjustedMouseY);
        if (d < maxDistM) {
            drawZigzagLine(points[i].x, points[i].y, mouseX, adjustedMouseY, d, maxDistM);
        }
    }
}

function drawZigzagLine(x1, y1, x2, y2, distance,Dm) {
    frameRate(35);
    let step = 10;
    let numSteps = distance / step;
    let prevX = x1;
    let prevY = y1;
    let colorInterpolation = map(distance, 0, Dm, 0, 1);
    let lineColor = lerpColor(color(255, 255, 255), color(0, 100, 255), colorInterpolation); // De amarillo a blanco
    stroke(lineColor);
    strokeWeight(map(distance, 0, Dm, 2, 0));

    for (let i = 1; i <= numSteps; i++) {
        let inter = i / numSteps;
        let newX = lerp(x1, x2, inter) + random(-5, 5);
        let newY = lerp(y1, y2, inter) + random(-5, 5);
        line(prevX, prevY, newX, newY);
        prevX = newX;
        prevY = newY;
    }
    line(prevX, prevY, x2, y2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function updateReference() {
    referenceY = window.scrollY; // Actualiza la referencia del desplazamiento
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1); // Reducir la velocidad de movimiento
        this.vy = random(-1, 1); // Reducir la velocidad de movimiento
        this.size = random(1, 5);
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    display() {
        noStroke();
        fill(255);
        ellipse(this.x, this.y, this.size, this.size);
    }
}
