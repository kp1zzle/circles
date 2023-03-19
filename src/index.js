import p5 from 'p5'

let sketch = (s) => {
    s.numCircles = 64
    s.strokeWt = 2
    s.spacing = 40
    s.radius = 50
    s.columns = 8
    s.rows = 0
    s.pointsPerCircle = 5
    s.tightness = 0
    s.t = 0
    s.speed = 1;
    s.speedMultiple = 80

    s.setup = () => {
        s.createCanvas(window.innerWidth, window.innerHeight)
        s.background(220);

        s.frameRate(20)
    }

    s.draw = () => {
        s.background(255);
        s.stroke(0)
        s.columns = s.floor(window.innerWidth / (2 * s.radius + s.spacing))
        s.rows = s.ceil(s.numCircles / s.columns)
        s.strokeWeight(s.strokeWt)
        let edgePadding = (window.innerWidth - ((s.columns * 2 * s.radius) + ((s.columns - 1) * s.spacing)))/2
        s.translate(edgePadding, 135)
        s.angleMode(s.DEGREES)
        s.noFill();
        s.curveTightness(s.tightness)
        // s.noLoop()
        for (let r = 0; r < s.rows; r++) {
            let circles = s.min(s.columns, s.numCircles - (r * s.columns))
            for (let c = 0; c < circles; c++) {
                s.beginShape();
                let displacement = []
                for(let a = 0; a <= s.pointsPerCircle + 2; a++) {
                    let theta = (a % s.pointsPerCircle) * (360/s.pointsPerCircle)
                    displacement[a] = s.noise(a / 2, r+c, s.t / (s.speedMultiple))* 100;
                    s.curveVertex(s.radius * s.sin(theta) + displacement[a % s.pointsPerCircle], s.radius * s.cos(theta) - displacement[a % s.pointsPerCircle])
                }
                s.endShape();

                s.translate(2* s.radius + s.spacing, 0);
            }
            s.translate(-circles * (2* s.radius + s.spacing), 2*s.radius + s.spacing)
        }
        s.t += s.speed
    }

    s.mouseWheel = (event) => {
        if (s.mouseIsPressed) {
            s.spacing -= event.delta;
            if (s.spacing < 0) {
                s.spacing = 5
            }
            if (s.spacing > 300) {
                s.spacing = 300
            }
        } else {
            s.radius -= event.delta;
            if (s.radius < 0) {
                s.radius = 5
            }
            if (s.radius > 300) {
                s.radius = 300
            }
        }

    }

    s.mouseClicked = () => {
        if (s.speed === 1) {
            s.speed = 0
        } else {
            s.speed = 1
        }
    }

    s.keyPressed = () => {
        if (s.key === "s") {
            s.save()
        } else if (s.key === "-") {
            s.strokeWt -= 0.25
            if (s.strokeWt < 0) {
                s.strokeWt = 0
            }
        } else if (s.key === "=") {
            s.strokeWt += 0.25
        } else if (s.keyCode === s.ENTER) {

        }
    }

}

const P5 = new p5(sketch);