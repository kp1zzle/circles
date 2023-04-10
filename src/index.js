import p5 from 'p5'
//import p5Svg from "p5.js-svg"

//p5Svg(p5);
let sketch = (s) => {
    s.strokeWt = 2
    s.spacing = 50 //150
    s.radius = 10
    s.columns = 8
    s.rows = 0
    s.pointsPerCircle = 10
    s.tightness = 0
    s.t = 0
    s.minSpeed = 20;
    s.speed = s.minSpeed; // Per second
    s.speedMultiple = 80
    s.backgroundColor = s.color(255)
    s.strokeColor = s.color(0)
    s.minMargin = 200
    s.displacementAmplitude = 50
    s.canvasWidth = 0
    s.canvasHeight = 0
    s.aspectRatioMode = 0 // 0 = window, 1 = 1:1, 2 = 4:5, 3 = 1.91:1, 4 = 9:16
    s.randomFill = false
    s.hasMotionPermission = false
    s.paused = false
    s.mainBuffer = null
    s.grainBuffer = null
    s.grainShader = null
    s.enableGrain = true


    s.preload = () => {
        s.grainShader = s.loadShader('grain.vert', 'grain.frag')
    }

    s.setup = () => {
        s.stopTouchScrolling()
        s.setCanvasAspectRatio(s.aspectRatioMode)
        s.setupControlPanel()
        s.displayInstructionPane()
        s.frameRate(60)
        s.colorMode(s.HSL)
        s.angleMode(s.DEGREES)
    }

    s.draw = () => {
        if (s.enableGrain) {
            s.push()
        }

        s.drawCircles()

        if (s.enableGrain) {
            s.pop()
            s.applyGrain()
        }

        if (!s.paused && s.frameRate() !== 0) {
            s.t += (s.speed/s.frameRate())
            s.speed -= ((s.speed - s.minSpeed)/3)/s.frameRate()
            s.speed = s.max(s.speed, s.minSpeed)
        }
    }

    s.drawCircles = () => {
        s.push()
        s.background(s.backgroundColor);
        s.stroke(s.strokeColor)
        s.columns = s.floor((s.canvasWidth - 2* s.minMargin) / (2 * s.radius + s.spacing))
        s.rows = s.floor((s.canvasHeight - 2* s.minMargin) / (2 * s.radius + s.spacing))
        s.strokeWeight(s.strokeWt)
        let leftPadding = (s.canvasWidth - ((s.columns * 2 * s.radius) + ((s.columns - 1) * s.spacing)))/2
        let topPadding = (s.canvasHeight - ((s.rows * 2 * s.radius) + ((s.rows - 1) * s.spacing)))/2
        s.translate(leftPadding + s.radius, topPadding)

        s.noFill();
        s.curveTightness(s.tightness)
        // s.noLoop()
        for (let r = 0; r < s.rows; r++) {
            for (let c = 0; c < s.columns; c++) {
                let rotation = s.noise((r*s.columns)+c, s.t / (s.speedMultiple)) * 360 * 2
                if (s.randomFill && s.random() <= 0.1) {
                    s.fill(s.strokeColor)
                }
                s.beginShape();
                let displacement = []
                for(let a = 0; a <= s.pointsPerCircle + 2; a++) {
                    let theta = (a % s.pointsPerCircle) * (360/s.pointsPerCircle) + rotation

                    let normal_x = s.sin(theta)
                    let normal_y = s.cos(theta)

                    displacement[a] = s.noise(a*5, (r*s.columns)+c, s.t / (s.speedMultiple))* s.displacementAmplitude;
                    s.curveVertex(normal_x * (s.radius + displacement[a % s.pointsPerCircle]), normal_y * (s.radius + displacement[a % s.pointsPerCircle]))
                }
                s.endShape();
                s.noFill();

                s.translate(2* s.radius + s.spacing, 0);
            }
            s.translate(-s.columns * (2* s.radius + s.spacing), 2*s.radius + s.spacing)
        }
        s.pop()
    }

    s.windowResized = () => {
        s.setCanvasAspectRatio(s.aspectRatioMode)
    }

    // Desktop Controls

    s.mouseMoved = () => {
        // s.t += 1/5;
        s.speed += (s.abs(s.mouseX - s.pmouseX) + s.abs(s.mouseY - s.pmouseY))/100
    }

    s.mouseWheel = (event) => {
        // Disable all other keys if control panel is visible
        if (s.controlPanelIsDisplayed()) {
            return
        }

        if (s.keyIsPressed && s.key === 'z') {
            s.spacing += event.delta/10;
            // if (s.spacing < 0) {
            //     s.spacing = 5
            // }
            // if (s.spacing > 300) {
            //     s.spacing = 300
            // }
        } else if (s.keyIsPressed && s.key === 'x') {
            s.displacementAmplitude-= event.delta/10;
        } else if (s.keyIsPressed && s.key === 'c') {
            s.minMargin -= event.delta/10;
        } else if (s.keyIsPressed && s.key === 'v') {
            s.tightness -= event.delta/50;
        } else {
            s.radius -= event.delta/10;
            // if (s.radius < 0) {
            //     s.radius = 5
            // }
            // if (s.radius > 300) {
            //     s.radius = 300
            // }
        }

    }

    s.mouseClicked = () => {
        if (s.controlPanelIsDisplayed()) {
            return
        }

        s.paused = !s.paused
    }

    s.keyPressed = () => {
        if (s.keyCode === s.ESCAPE) {
            s.toggleControlPanelVisibility()
        }

        // Disable all other keys if control panel is visible
        if (s.controlPanelIsDisplayed()) {
            return
        }

        if (s.keyCode === s.ENTER) {
            s.aspectRatioMode = (s.aspectRatioMode + 1) % 5
            s.setCanvasAspectRatio(s.aspectRatioMode)
        }

        switch (s.key) {
            case "s":
                s.export()
                break
            case "-":
                s.pointsPerCircle -= 1
                if (s.pointsPerCircle < 0) {
                    s.pointsPerCircle = 0
                }
                // s.strokeWt -= 0.25
                // if (s.strokeWt < 0) {
                //     s.strokeWt = 0
                // }
                break
            case "=":
                s.pointsPerCircle += 1
                if (s.pointsPerCircle > 100) {
                    s.pointsPerCircle = 100
                }
                //s.strokeWt += 0.25
                break
            case " ":
                s.randomizeColors()
                break
            case "l":
                s.emitConfiguration()
                break
            case "f":
                s.randomFill = !s.randomFill
                break
            case "g":
                s.enableGrain = !s.enableGrain
        }
    }

    // Mobile Controls

    s.touchStarted = () => {
        switch (s.touches.length) {
            case 3:
                s.randomizeColors()
                break
            case 4:
                //s.export()
                s.toggleControlPanelVisibility()
                break
        }
    }

    s.touchMoved = () => {
        let deltaX = s.mouseX - s.pmouseX
        let deltaY = s.mouseY - s.pmouseY
        switch (s.touches.length) {
            case 1:
                s.radius += deltaX/10
                s.displacementAmplitude += deltaY/10
                break
            case 2:
                s.spacing += deltaX/10
                s.minMargin += deltaY/10
                break
        }
    }

    s.deviceMoved = () => {
        s.speed += (s.abs(s.accelerationX) + s.abs(s.accelerationY) + s.abs(s.accelerationZ))/4
        // let dX = s.rotationX - s.pRotationX
        // let dY = s.rotationY - s.pRotationY
        // let dZ = s.rotationZ - s.pRotationZ
        // s.t += (dX + dY + dZ) /3;
    }

    s.deviceShaken = () => {
        s.randomizeColors()
    }

    // Helper Functions

    s.export = () => {
        let filename = (new Date).toISOString()
        s.save(filename.concat(".png"))
        let prevGrainState = s.enableGrain
        let prevDrawingContext = s.drawingContext
        s.enableGrain = false
        let svgGraphics = s.createGraphics(s.canvasWidth, s.canvasHeight, s.SVG)
        s.drawingContext = svgGraphics.drawingContext
        console.log(svgGraphics)
        s.draw()
        svgGraphics.save(filename.concat(".svg"))
        s.enableGrain = prevGrainState
        s.drawingContext
        // s.mainBuffer = s.createCanvas(s.canvasWidth, s.canvasHeight)

    }

    s.setCanvasAspectRatio = (mode) => {
        // 0 = window, 1 = 1:1, 2 = 4:5, 3 = 1.91:1, 4 = 9:16
        switch (mode) {
            case 0:
                // Window
                s.canvasWidth = window.innerWidth
                s.canvasHeight = window.innerHeight
                break
            case 1:
                // 1:1
                s.canvasWidth = s.min(window.innerWidth, window.innerHeight)
                s.canvasHeight = s.min(window.innerWidth, window.innerHeight)
                break
            case 2:
                // 4:5
                [s.canvasWidth, s.canvasHeight] = s.returnCanvasDimsForAspectRatio(4, 5)
                break
            case 3:
                // 1.91:1
                [s.canvasWidth, s.canvasHeight] = s.returnCanvasDimsForAspectRatio(1.91, 1)
                break
            case 4:
                // 9:16
                [s.canvasWidth, s.canvasHeight] = s.returnCanvasDimsForAspectRatio(9, 16)
                break
        }

        if (s.mainBuffer == null) {
            s.mainBuffer = s.createCanvas(s.canvasWidth, s.canvasHeight);
            s.grainBuffer = s.createGraphics(s.canvasWidth, s.canvasHeight, s.WEBGL);
        } else {
            s.mainBuffer.resize(s.canvasWidth, s.canvasHeight);
            s.grainBuffer.resizeCanvas(s.canvasWidth, s.canvasHeight);
        }

    }

    s.returnCanvasDimsForAspectRatio = (widthRatio, heightRatio) => {
        let units = s.min(window.innerWidth / widthRatio, window.innerHeight / heightRatio)
        let width = units * widthRatio
        let height = units * heightRatio
        return [width, height]
    }

    s.randomizeColors = () => {
        const paletteList = ['Black&White', 'Mono', 'Analogous', 'Complementary'];
        let colorPalette = s.random(paletteList)

        let saturation1 = s.random(40, 60);
        let lightness1 = s.random(10, 55);

        let saturation2 = s.random(70, 100);
        let lightness2 = s.random(55, 90);

        // Switch 1 and 2, making background bright and stroke dark
        if (s.random() > 0.5) {
            let temp = saturation1
            saturation1 = saturation2
            saturation2 = temp

            temp = lightness1
            lightness1 = lightness2
            lightness2 = temp
        }

        // pick a random hue on the color wheel
        let hue1 = s.random(0, 360);
        let hue2;

        if (colorPalette === 'Mono') {
            // if we have a Mono color palette, then the hues are the same
            hue2 = hue1;

        } else if (colorPalette === 'Analogous') {
            hue2 = hue1;
            // if we have Analogous palette, we need to pick another hue next to the original one
            // either by decreasing or increasing the angle on the wheel
            hue2 += s.random() > 0.5 ? s.random(-60, -30) : s.random(30, 60);
        } else if (colorPalette === 'Complementary') {
            hue2 = hue1;

            // if we have a Complementary palette, we need the opposite value on the color wheel
            hue2 += 180;
        }

        s.backgroundColor = s.color(hue1, saturation1, lightness1);
        s.strokeColor = s.color(hue2, saturation2, lightness2)
    }

    s.emitConfiguration = () => {
        console.log(s)
    }

    // Prevent scrolling when touching the canvas
    // Adapted from https://kirkdev.blogspot.com/2020/10/prevent-browser-scrolling-while-drawing.html
    s.stopTouchScrolling = () => {
        let canvas = s.select('canvas').elt
        document.body.addEventListener("touchstart", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, { passive: false });
        document.body.addEventListener("touchend", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, { passive: false });
        document.body.addEventListener("touchmove", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    s.setupControlPanel = () => {
        let spacing = s.select('#spacing');
        spacing.elt.addEventListener("input", () => {
            s.spacing = +spacing.value()
        });

        let radius = s.select('#radius');
        radius.elt.addEventListener("input", () => {
            s.radius = +radius.value()
        });

        let disturbance = s.select('#disturbance');
        disturbance.elt.addEventListener("input", () => {
            s.displacementAmplitude = +disturbance.value()
        });

        let min_margin = s.select('#min_margin');
        min_margin.elt.addEventListener("input", () => {
            s.minMargin = +min_margin.value()
        });

        let tightness = s.select('#tightness');
        tightness.elt.addEventListener("input", () => {
            s.tightness = +tightness.value()
        });

        let closeButton = s.select('#mobileWelcomeScreen #closeButton')
        closeButton.elt.addEventListener("click",() => {
            s.select('#mobileWelcomeScreen').style('visibility', 'hidden');
        });
    }

    s.updateControlPanelValues = () => {
        s.select('#radius').value(s.round(s.radius, 2));
        s.select('#spacing').value(s.round(s.spacing, 2));
        s.select('#disturbance').value(s.round(s.displacementAmplitude, 2));
        s.select('#min_margin').value(s.round(s.minMargin, 2));
        s.select('#tightness').value(s.round(s.tightness, 2));
    }

    s.controlPanelIsDisplayed = () => {
       return s.select('#controlPanel').style('visibility') === 'visible';
    }

    s.toggleControlPanelVisibility = () => {
        if (s.controlPanelIsDisplayed()) {
            s.select('#controlPanel').style('visibility', 'hidden')
        } else {
            s.updateControlPanelValues()
            s.select('#controlPanel').style('visibility', 'visible')
        }
    }

    s.isMobileClient = () => {
        return typeof DeviceMotionEvent !== 'undefined'
    }

    s.displayInstructionPane = () => {
        if (s.isMobileClient()) {
            s.select('#mobileWelcomeScreen').style('visibility', 'visible')
        } else {

        }
    }

    s.applyGrain = () => {
        s.grainBuffer.clear();
        s.grainBuffer.reset();
        s.grainBuffer.push();
        s.grainBuffer.shader(s.grainShader);
        s.grainShader.setUniform('source', s.mainBuffer);
        // if (shouldAnimate) {
        //     //grainShader.setUniform('noiseSeed', random());
        //     s.grainShader.setUniform('noiseSeed', frameCount/100);
        // }
        s.grainShader.setUniform('noiseAmount', 0.3);
        s.grainBuffer.rectMode(s.CENTER);
        s.grainBuffer.noStroke();
        s.grainBuffer.rect(0, 0, s.canvasWidth, s.canvasHeight);
        s.grainBuffer.pop();

        s.clear();
        s.push();
        s.image(s.grainBuffer, 0, 0);
        s.pop();
    }

}

const P5 = new p5(sketch);

function requestDeviceMotionPermission() {
    // feature detect
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', () => {});
                }
            })
            .catch(console.error);
    } else {
        // handle regular non iOS 13+ devices
    }
}