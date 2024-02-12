import { Color } from './color'
import { GeometryData } from './geometry'
import { Matrix4f } from './math'
import { Shader } from './shader'
import { Transform } from './transform'

export interface IMaterialOptions {
  solidColor?: Color
}

export class Material {
  constructor(
    public shader: Shader,
    public options: IMaterialOptions = {}
  ) {}

  apply(
    projectionMatrix: Matrix4f,
    viewMatrix: Matrix4f,
    modelMatrix: Matrix4f
  ) {
    this.shader.use()

    this.shader.setUniform('uProjectionMatrix').matrix4x4(projectionMatrix)
    this.shader.setUniform('uViewMatrix').matrix4x4(viewMatrix)
    this.shader.setUniform('uModelMatrix').matrix4x4(modelMatrix)

    if (this.options.solidColor) {
      this.shader
        .setUniform('uColor')
        .vector4(
          this.options.solidColor.red,
          this.options.solidColor.green,
          this.options.solidColor.blue,
          this.options.solidColor.alpha
        )
    }
  }
}

export class Mesh {
  constructor(public geometryData: GeometryData) {}

  bind() {
    this.geometryData.bind()
    this.geometryData.enableAttribs()
  }
}

export class GameObject {
  public readonly transform = new Transform()
  public readonly components: Map<any, any> = new Map()

  constructor() {}

  addComponent<T>(component: T) {
    this.components.set((component as any).constructor, component)
  }

  getComponent<T>(component: any): T {
    return this.components.get(component)
  }

  hasComponent(component: any) {
    return this.components.has(component)
  }
}
