const width = 800;
const height = 800;

const canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

const dt = 20; // Number of frames per second

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

const ball = {
    radius: 20,
    position: V(300, 200),
    velocity: V(0.3, 0.4),
    color: 'white',
}

const player1 = createPaddle({ x: 50, y0: canvas.height / 2, width: 16, height: 80, color: 'blue', minY: 50, maxY: height - 50, upKey: 'w', downKey: 's', hitSide: 'right' });
const player2 = createPaddle({ x: canvas.width - 50, y0: canvas.height / 2, width: 16, height: 80, color: 'red', minY: 50, maxY: height - 50, upKey: 'ArrowUp', downKey: 'ArrowDown', hitSide: 'left' });

function moveCircle() {
    // position = initial position + v * deltaTime
    ball.position.add(ball.velocity.times(dt));
}

function restart() {
    ball.velocity.set(0, 0);
    ball.position.set(width / 2, height / 2);
    setTimeout(function () {
        ball.velocity.randomize(0.4)
    }, 500);
}

function scorePoint(player) {
    if (player === 1) {
        el = document.getElementById("player1-score");
    } else if (player === 2) {
        el = document.getElementById("player2-score");
    }

    let score = parseInt(el.innerHTML);
    score++;
    el.innerHTML = score;

    restart();
}

function checkEdgeBounce() {
    // Top edge
    if (ball.position.y <= ball.radius) {
        ball.velocity.y = -ball.velocity.y;
    }

    // Bottom edge
    if (ball.position.y >= canvas.height - ball.radius) {
        ball.velocity.y = -ball.velocity.y;
    }

    // Right edge
    if (ball.position.x >= canvas.width - ball.radius) {
        scorePoint(1)
    }

    // Left edge
    if (ball.position.x <= ball.radius) {
        scorePoint(2)
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clearCanvas();
    drawCircle(ball.position.x, ball.position.y, ball.radius, ball.color);
    player1.draw(ctx);
    player2.draw(ctx);
}

function frame() {
    player1.move(dt);
    player2.move(dt);
    checkEdgeBounce();
    moveCircle();
    player1.checkHit(ball);
    player2.checkHit(ball);
    draw();
}

function animate() {
    setTimeout(animate, dt);
    frame();
}

animate();
restart();
