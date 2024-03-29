import { ShaderSource } from '../shader'

export default {
  vertex: `
    #version 410 core

    layout(location = 0) in vec3 aPos;

    uniform mat4 uModelMatrix = mat4(1);
    uniform mat4 uViewMatrix = mat4(1);
    uniform mat4 uProjectionMatrix = mat4(1);

    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPos, 1.0);
    }
  `,
  fragment: `
    #version 410 core

    uniform vec4 uColor = vec4(1, 0, 1, 1);

    out vec4 FragColor;

    void main() {
      FragColor = uColor;
    }
`,
} as ShaderSource
