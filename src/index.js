import p5 from 'p5'

let sketch = (s) => {
    s.setup = () => {
        s.createCanvas(window.innerWidth, window.innerHeight)
        s.background(220);
    }

    s.draw = () => {
        s.textSize(50);
        s.text('hello world', 10, 50);
    }
}

const P5 = new p5(sketch);