// Determines how much precision the GPU uses when calculating floats
precision highp float;

// Get the position attribute of the geometry
attribute vec3 aPosition;

// Get the texture coordinate attribute from the geometry
attribute vec2 aTexCoord;

// The view matrix defines attributes about the camera, such as focal length and camera position
// Multiplying uModelViewMatrix * vec4(aPosition, 1.0) would move the object into its world position in front of the camera
uniform mat4 uModelViewMatrix;

// uProjectionMatrix is used to convert the 3d world coordinates into screen coordinates
uniform mat4 uProjectionMatrix;

varying vec2 vVertTexCoord;

void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
}