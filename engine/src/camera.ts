import { logger } from './logger'
import { Matrix4x4f, Vector3 } from './math'

export class Camera3d {
  private _matrixCache: Matrix4x4f | null = null

  constructor(
    public position: Vector3 = Vector3.zero(),
    public rotation: Vector3 = Vector3.zero()
  ) {}

  viewMatrix() {
    if (this._matrixCache) {
      return this._matrixCache
    }

    this._matrixCache = Matrix4x4f.identity()
      .rotate(this.rotation)
      .translate(this.position.multiply(-1))
    
    return this._matrixCache
  }

  translate(v: Vector3): this {
    this.position.addMut(v)
    this._matrixCache = null
    return this
  }

  setPosition(v: Vector3): this {
    this.position = v
    this._matrixCache = null
    return this
  }

  translateX(x: number): this {
    this.position.x += x
    this._matrixCache = null
    return this
  }

  translateY(y: number): this {
    this.position.y += y
    this._matrixCache = null
    return this
  }

  translateZ(z: number): this {
    this.position.z += z
    this._matrixCache = null
    return this
  }

  rotate(v: Vector3): this {
    this.rotation.addMut(v)
    this._matrixCache = null
    return this
  }

  setRotation(v: Vector3): this {
    this.rotation = v
    this._matrixCache = null
    return this
  }

  rotateX(x: number): this {
    this.rotation.x += x
    this._matrixCache = null
    return this
  }

  rotateY(y: number): this {
    this.rotation.y += y
    this._matrixCache = null
    return this
  }

  rotateZ(z: number): this {
    this.rotation.z += z
    this._matrixCache = null
    return this
  }

  lookAt(target: Vector3, up: Vector3 = Vector3.up()) {
    const forward = this.position.subtract(target).normalizeMut()
    const right = Vector3.cross(forward, up).normalizeMut()
    up = Vector3.cross(right, forward).normalizeMut()

    const mat = new Matrix4x4f(
      right.x,
      right.y,
      right.z,
      0,
      up.x,
      up.y,
      up.z,
      0,
      forward.x,
      forward.y,
      forward.z,
      0,
      this.position.x,
      this.position.y,
      this.position.z,
      1
    )

    this.rotation = mat.rotationAsVec3()
    this._matrixCache = null
  }
}
