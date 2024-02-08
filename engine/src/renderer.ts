import {
  GL_TRIANGLES,
  GL_UNSIGNED_INT,
  joyGlDrawArrays,
  joyGlDrawElements,
} from '@joy/natives'
import { GeometryData } from './geometry'
import { Shader } from './shader'
import { Transform } from './transform'
import { Matrix4x4f } from './math'
import { Camera3d } from './camera'

export class Renderer {
  constructor(
    private readonly projectionMatrix: Matrix4x4f,
    private readonly camera: Camera3d
  ) {}

  renderGeometryData(
    geometryData: GeometryData,
    shader: Shader,
    transform?: Transform
  ) {
    shader.use()
    geometryData.bind()
    geometryData.enableAttribs()

    shader.setUniform('uProjectionMatrix').matrix4x4(this.projectionMatrix)
    shader.setUniform('uViewMatrix').matrix4x4(this.camera.viewMatrix())

    if (transform) {
      shader.setUniform('uModelMatrix').matrix4x4(transform.modelMatrix())
    }

    if (geometryData.indexed) {
      joyGlDrawElements(
        GL_TRIANGLES,
        geometryData.vertexCount,
        GL_UNSIGNED_INT,
        0
      )
    } else {
      joyGlDrawArrays(GL_TRIANGLES, 0, geometryData.vertexCount)
    }
  }
}
