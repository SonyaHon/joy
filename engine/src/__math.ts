export function lerp(
  a: number,
  b: number,
  t: number,
  fn?: (t: number) => number
) {
  if (fn) {
    t = fn(t)
  }
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export class Vector2 {
  constructor(
    public x: number,
    public y: number
  ) {}

  static lerp(a: Vector2, b: Vector2, t: number, fn?: (t: number) => number) {
    return new Vector2(lerp(a.x, b.x, t, fn), lerp(a.y, b.y, t, fn))
  }

  static zero() {
    return new Vector2(0, 0)
  }

  static unit(v: number = 1) {
    return new Vector2(v, v)
  }
}

export class Vector3 {
  constructor(
    public x: number,
    public y: number,
    public z: number
  ) {}

  static lerp(a: Vector3, b: Vector3, t: number, fn?: (t: number) => number) {
    return new Vector3(
      lerp(a.x, b.x, t, fn),
      lerp(a.y, b.y, t, fn),
      lerp(a.z, b.z, t, fn)
    )
  }

  static zero() {
    return new Vector3(0, 0, 0)
  }

  static unit(v: number = 1) {
    return new Vector3(v, v, v)
  }

  static up() {
    return new Vector3(0, 1, 0)
  }

  static dot(a: Vector3, b: Vector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }

  static cross(a: Vector3, b: Vector3) {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    )
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  multiply(v: number) {
    return new Vector3(this.x * v, this.y * v, this.z * v)
  }

  multiplyMut(v: number) {
    this.x *= v
    this.y *= v
    this.z *= v
    return this
  }

  add(v: Vector3) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  addMut(v: Vector3) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  subtract(v: Vector3) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  subtractMut(v: Vector3) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

  normalize() {
    const len = 1 / this.length
    return new Vector3(this.x * len, this.y * len, this.z * len)
  }

  normalizeMut() {
    const len = 1 / this.length
    this.x *= len
    this.y *= len
    this.z *= len
    return this
  }
}

export class Vector4 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {}

  static lerp(a: Vector4, b: Vector4, t: number, fn?: (t: number) => number) {
    return new Vector4(
      lerp(a.x, b.x, t, fn),
      lerp(a.y, b.y, t, fn),
      lerp(a.z, b.z, t, fn),
      lerp(a.w, b.w, t, fn)
    )
  }

  static zero() {
    return new Vector4(0, 0, 0, 0)
  }
}

export class Matrix4x4f {
  private _raw: number[] = []
  constructor(
    m00 = 1,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1
  ) {
    this._raw = [
      m00,
      m01,
      m02,
      m03,
      m10,
      m11,
      m12,
      m13,
      m20,
      m21,
      m22,
      m23,
      m30,
      m31,
      m32,
      m33,
    ]
  }

  raw(): number[] {
    return this._raw
  }

  static identity() {
    return new Matrix4x4f()
  }

  static perspective(fov: number, aspect: number, near: number, far: number) {
    const scale = Math.tan((fov * 0.5 * Math.PI) / 180) * near
    const r = aspect * scale
    const l = -r
    const t = scale
    const b = -t

    return new Matrix4x4f(
      (2 * near) / (r - l),
      0,
      0,
      0,
      0,
      (2 * near) / (t - b),
      0,
      0,
      (r + l) / (r - l),
      (t + b) / (t - b),
      -(far + near) / (far - near),
      -1,
      0,
      0,
      (-2 * far * near) / (far - near),
      0
    )
  }

  public translate(v: Vector3) {
    const raw = this.raw()
    raw[12] += v.x
    raw[13] += v.y
    raw[14] += v.z
    return this
  }

  public scale(v: Vector3) {
    const raw = this.raw()
    raw[0] *= v.x
    raw[5] *= v.y
    raw[10] *= v.z
    return this
  }

  public rotateX(angle: number) {
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    const a10 = this._raw[4]
    const a11 = this._raw[5]
    const a12 = this._raw[6]
    const a13 = this._raw[7]
    const a20 = this._raw[8]
    const a21 = this._raw[9]
    const a22 = this._raw[10]
    const a23 = this._raw[11]

    this._raw[4] = a10 * c + a20 * s
    this._raw[5] = a11 * c + a21 * s
    this._raw[6] = a12 * c + a22 * s
    this._raw[7] = a13 * c + a23 * s
    this._raw[8] = a20 * c - a10 * s
    this._raw[9] = a21 * c - a11 * s
    this._raw[10] = a22 * c - a12 * s
    this._raw[11] = a23 * c - a13 * s

    return this
  }

  public rotateY(angle: number) {
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    const a00 = this._raw[0]
    const a01 = this._raw[1]
    const a02 = this._raw[2]
    const a03 = this._raw[3]
    const a20 = this._raw[8]
    const a21 = this._raw[9]
    const a22 = this._raw[10]
    const a23 = this._raw[11]

    this._raw[0] = a00 * c - a20 * s
    this._raw[1] = a01 * c - a21 * s
    this._raw[2] = a02 * c - a22 * s
    this._raw[3] = a03 * c - a23 * s
    this._raw[8] = a00 * s + a20 * c
    this._raw[9] = a01 * s + a21 * c
    this._raw[10] = a02 * s + a22 * c
    this._raw[11] = a03 * s + a23 * c
    return this._raw
  }

  public rotateZ(angle: number) {
    let s = Math.sin(angle)
    let c = Math.cos(angle)
    const a00 = this._raw[0]
    const a01 = this._raw[1]
    const a02 = this._raw[2]
    const a03 = this._raw[3]
    const a10 = this._raw[4]
    const a11 = this._raw[5]
    const a12 = this._raw[6]
    const a13 = this._raw[7]

    this._raw[0] = a00 * c + a10 * s
    this._raw[1] = a01 * c + a11 * s
    this._raw[2] = a02 * c + a12 * s
    this._raw[3] = a03 * c + a13 * s
    this._raw[4] = a10 * c - a00 * s
    this._raw[5] = a11 * c - a01 * s
    this._raw[6] = a12 * c - a02 * s
    this._raw[7] = a13 * c - a03 * s
    return this._raw
  }

  public rotate(v: Vector3) {
    this.rotateX(v.x)
    this.rotateY(v.y)
    this.rotateZ(v.z)
    return this
  }

  public rotateAxis(axis: Vector3, angle: number) {
    const len =
      1 / Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z)
    const x = axis.x * len
    const y = axis.y * len
    const z = axis.z * len

    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const t = 1 - c

    const a00 = this._raw[0]
    const a01 = this._raw[1]
    const a02 = this._raw[2]
    const a03 = this._raw[3]
    const a10 = this._raw[4]
    const a11 = this._raw[5]
    const a12 = this._raw[6]
    const a13 = this._raw[7]
    const a20 = this._raw[8]
    const a21 = this._raw[9]
    const a22 = this._raw[10]
    const a23 = this._raw[11]

    // Construct the elements of the rotation matrix
    const b00 = x * x * t + c
    const b01 = y * x * t + z * s
    const b02 = z * x * t - y * s
    const b10 = x * y * t - z * s
    const b11 = y * y * t + c
    const b12 = z * y * t + x * s
    const b20 = x * z * t + y * s
    const b21 = y * z * t - x * s
    const b22 = z * z * t + c

    // Perform rotation-specific matrix multiplication
    this._raw[0] = a00 * b00 + a10 * b01 + a20 * b02
    this._raw[1] = a01 * b00 + a11 * b01 + a21 * b02
    this._raw[2] = a02 * b00 + a12 * b01 + a22 * b02
    this._raw[3] = a03 * b00 + a13 * b01 + a23 * b02
    this._raw[4] = a00 * b10 + a10 * b11 + a20 * b12
    this._raw[5] = a01 * b10 + a11 * b11 + a21 * b12
    this._raw[6] = a02 * b10 + a12 * b11 + a22 * b12
    this._raw[7] = a03 * b10 + a13 * b11 + a23 * b12
    this._raw[8] = a00 * b20 + a10 * b21 + a20 * b22
    this._raw[9] = a01 * b20 + a11 * b21 + a21 * b22
    this._raw[10] = a02 * b20 + a12 * b21 + a22 * b22
    this._raw[11] = a03 * b20 + a13 * b21 + a23 * b22

    return this._raw
  }

  rotationAsVec3(): Vector3 {
    if (this._raw[0] == 1 || this._raw[0] == -1) {
      return new Vector3(0, Math.atan2(this._raw[2], this._raw[11]), 0)
    } else {
      return new Vector3(
        Math.asin(this._raw[4]),
        Math.atan2(-this._raw[8], this._raw[0]),
        Math.atan2(-this._raw[6], this._raw[5])
      )
    }
  }
}
