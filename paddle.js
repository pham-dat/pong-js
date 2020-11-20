function lineBounce(line, ball) {
    let point1 = line.point1;
    let point2 = line.point2;

    let lineVector = point2.minus(point1);
    let point1ToBall = ball.position.minus(point1);
    let proj = point1ToBall.clampedProj(lineVector);
    let displacement = point1ToBall.minus(proj);
    let distance = displacement.norm();
    let overlap = ball.radius - distance;

    if (distance <= ball.radius) {
        // Bounce
        ball.velocity.reflect(displacement);
        displacement.setNorm(overlap);
        ball.position.add(displacement);
    }
}

function createPaddle({ x, y0, width, height, color, minY, maxY, upKey, downKey, hitSide }) {
    let y = y0;
    let velocity = 0;

    window.addEventListener('keydown', function (e) {
        let key = e.key;

        if (key === upKey) {
            velocity = -0.5;
        } else if (key === downKey) {
            velocity = 0.5;
        }
    })

    window.addEventListener('keyup', function (e) {
        let key = e.key;

        if (key === upKey || key === downKey) {
            velocity = 0;
        }
    })

    function draw(ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
    }

    function move(dt) {
        y += velocity * dt;
        y = Math.min(y, maxY);
        y = Math.max(y, minY);

    }

    function getHitLine() {
        if (hitSide === 'right') {
            return {
                point1: V(x + width / 2, y - height / 2),
                point2: V(x + width / 2, y + height / 2)
            }
        }
        else if (hitSide === 'left') {
            return {
                point1: V(x - width / 2, y - height / 2),
                point2: V(x - width / 2, y + height / 2)
            }
        }
    }

    function checkHit(ball) {
        let hitLine = getHitLine();
        lineBounce(hitLine, ball);
    }


    return {
        draw,
        move,
        checkHit
    }
}
