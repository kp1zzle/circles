precision highp float;
varying vec2 vVertTexCoord;

uniform sampler2D source;
uniform float noiseSeed;
uniform float noiseAmount;

// Noise functions
// https://github.com/patriciogonzalezvivo/lygia/blob/main/generative/random.glsl
float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    // GorillaSun's grain algorithm
    vec4 inColor = texture2D(source, vVertTexCoord);
    gl_FragColor = clamp(inColor + vec4(
    mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 1234.5678))),
    mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 876.54321))),
    mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 3214.5678))),
    0.
    ), 0., 1.);
}