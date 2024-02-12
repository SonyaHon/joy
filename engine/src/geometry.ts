import {
  BUFFER_TYPE_ARRAY_BUFFER,
  BUFFER_TYPE_ELEMENT_ARRAY_BUFFER,
  BUFFER_USAGE_STATIC_DRAW,
  GL_FLOAT,
  joyGlBindBuffer,
  joyGlBindVertexArray,
  joyGlBufferDataF32,
  joyGlBufferDataU32,
  joyGlDisableVertexAttribArray,
  joyGlEnableVertexAttribArray,
  joyGlGenBuffers,
  joyGlGenVertexArrays,
  joyGlVertexAttribPointer,
} from '@joy/natives'

export interface GeometryAttributes {
  vertices: number[]
}

export class GeometryData {
  constructor(
    private readonly vaoId: number,
    public readonly vertexCount: number,
    private readonly enabledAttribs: number[],
    public readonly indexed = false
  ) {}

  bind() {
    joyGlBindVertexArray(this.vaoId)
  }

  unbind() {
    joyGlBindVertexArray(0)
  }

  enableAttribs() {
    for (const attrib of this.enabledAttribs) {
      joyGlEnableVertexAttribArray(attrib)
    }
  }

  disableAttribs() {
    for (const attrib of this.enabledAttribs) {
      joyGlDisableVertexAttribArray(attrib)
    }
  }

  static from(vertices: number[], indices?: number[]) {
    const vao = joyGlGenVertexArrays()
    joyGlBindVertexArray(vao)

    const vbo = joyGlGenBuffers()
    joyGlBindBuffer(BUFFER_TYPE_ARRAY_BUFFER, vbo)
    joyGlBufferDataF32(
      BUFFER_TYPE_ARRAY_BUFFER,
      vertices,
      BUFFER_USAGE_STATIC_DRAW
    )
    joyGlVertexAttribPointer(0, 3, GL_FLOAT, false, 0, 0)

    if (indices) {
      const ebo = joyGlGenBuffers()
      joyGlBindBuffer(BUFFER_TYPE_ELEMENT_ARRAY_BUFFER, ebo)
      joyGlBufferDataU32(
        BUFFER_TYPE_ELEMENT_ARRAY_BUFFER,
        indices,
        BUFFER_USAGE_STATIC_DRAW
      )
    }

    joyGlBindVertexArray(0)

    return new GeometryData(
      vao,
      indices ? indices.length : vertices.length / 3,
      [0],
      !!indices
    )
  }

  static cube(unit: number = 1) {
    return GeometryData.from(
      [
        -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1, 1,
        -1, 1, 1, -1,
      ].map((x) => x * unit),
      [
        //Top
        2, 6, 7, 2, 3, 7,

        //Bottom
        0, 4, 5, 0, 1, 5,

        //Left
        0, 2, 6, 0, 4, 6,

        //Right
        1, 3, 7, 1, 5, 7,

        //Front
        0, 2, 3, 0, 1, 3,

        //Back
        4, 6, 7, 4, 5, 7,
      ]
    )
  }

  static plane(unit: number = 1) {
    return GeometryData.from(
      [-1, 0, 1, 1, 0, 1, -1, 0, -1, 1, 0, -1].map((x) => x * unit),
      [0, 1, 2, 2, 1, 3]
    )
  }
}
