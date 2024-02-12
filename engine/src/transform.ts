import { Matrix4f, Vector3 } from './math'
import { degreesToRadians } from './math/functions'

export class Transform {
  private _matrixCache: Matrix4f | null = null

  constructor(
    public position: Vector3 = Vector3.zero(),
    public rotation: Vector3 = Vector3.zero(),
    public scale: Vector3 = Vector3.unit()
  ) {}

  modelMatrix() {
    if (this._matrixCache) {
      return this._matrixCache
    }

    this._matrixCache = Matrix4f.identity()
      .translate(this.position)
      .rotate(degreesToRadians(this.rotation.x), Vector3.right())
      .rotate(degreesToRadians(this.rotation.y), Vector3.up())
      .rotate(degreesToRadians(this.rotation.z), Vector3.forward())
      .scale(this.scale)
    return this._matrixCache
  }

  setPosition(v: Vector3): this
  setPosition(x: number | Vector3, y?: number, z?: number): this {
    if (typeof x === 'number') {
      this.position.x = x
      this.position.y = y!
      this.position.z = z!
    } else {
      this.position.x = x.x
      this.position.y = x.y
      this.position.z = x.z
    }
    this._matrixCache = null
    return this
  }

  translateX(x: number) {
    this.position.x += x
    this._matrixCache = null
    return this
  }

  translateY(y: number) {
    this.position.y += y
    this._matrixCache = null
    return this
  }

  translateZ(z: number) {
    this.position.z += z
    this._matrixCache = null
    return this
  }

  translate(v: Vector3): this
  translate(x: number | Vector3, y?: number, z?: number): this {
    if (typeof x === 'number') {
      this.position.x += x
      this.position.y += y!
      this.position.z += z!
    } else {
      this.position.x += x.x
      this.position.y += x.y
      this.position.z += x.z
    }
    this._matrixCache = null
    return this
  }

  rotateX(angle: number) {
    this.rotation.x += angle
    this._matrixCache = null
    return this
  }

  rotateY(angle: number) {
    this.rotation.y += angle
    this._matrixCache = null
    return this
  }

  rotateZ(angle: number) {
    this.rotation.z += angle
    this._matrixCache = null
    return this
  }

  rotate(axis: Vector3): this
  rotate(angleX: number | Vector3, angleY?: number, angleZ?: number): this {
    if (typeof angleX === 'number') {
      this.rotation.x += angleX
      this.rotation.y += angleY!
      this.rotation.z += angleZ!
    } else {
      this.rotation.x += angleX.x
      this.rotation.y += angleX.y
      this.rotation.z += angleX.z
    }
    this._matrixCache = null
    return this
  }

  scaleX(x: number) {
    this.scale.x *= x
    this._matrixCache = null
    return this
  }

  scaleY(y: number) {
    this.scale.y *= y
    this._matrixCache = null
    return this
  }

  scaleZ(z: number) {
    this.scale.z *= z
    this._matrixCache = null
    return this
  }

  setScale(v: Vector3): this
  setScale(x: number | Vector3, y?: number, z?: number): this {
    if (typeof x === 'number') {
      this.scale.x = x
      this.scale.y = y!
      this.scale.z = z!
    } else {
      this.scale.x = x.x
      this.scale.y = x.y
      this.scale.z = x.z
    }
    this._matrixCache = null
    return this
  }
}
