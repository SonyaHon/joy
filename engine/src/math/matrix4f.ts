import { degreesToRadians } from './functions'
import { Vector3 } from './vector3'

export class Matrix4f {
  constructor(
    private readonly elems: number[] = [
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]
  ) {}

  static identity() {
    return new Matrix4f()
  }

  get m00() {
    return this.elems[0]
  }
  get m01() {
    return this.elems[1]
  }
  get m02() {
    return this.elems[2]
  }
  get m03() {
    return this.elems[3]
  }
  get m10() {
    return this.elems[4]
  }
  get m11() {
    return this.elems[5]
  }
  get m12() {
    return this.elems[6]
  }
  get m13() {
    return this.elems[7]
  }
  get m20() {
    return this.elems[8]
  }
  get m21() {
    return this.elems[9]
  }
  get m22() {
    return this.elems[10]
  }
  get m23() {
    return this.elems[11]
  }
  get m30() {
    return this.elems[12]
  }
  get m31() {
    return this.elems[13]
  }
  get m32() {
    return this.elems[14]
  }
  get m33() {
    return this.elems[15]
  }

  set m00(value: number) {
    this.elems[0] = value
  }
  set m01(value: number) {
    this.elems[1] = value
  }
  set m02(value: number) {
    this.elems[2] = value
  }
  set m03(value: number) {
    this.elems[3] = value
  }
  set m10(value: number) {
    this.elems[4] = value
  }
  set m11(value: number) {
    this.elems[5] = value
  }
  set m12(value: number) {
    this.elems[6] = value
  }
  set m13(value: number) {
    this.elems[7] = value
  }
  set m20(value: number) {
    this.elems[8] = value
  }
  set m21(value: number) {
    this.elems[9] = value
  }
  set m22(value: number) {
    this.elems[10] = value
  }
  set m23(value: number) {
    this.elems[11] = value
  }
  set m30(value: number) {
    this.elems[12] = value
  }
  set m31(value: number) {
    this.elems[13] = value
  }
  set m32(value: number) {
    this.elems[14] = value
  }
  set m33(value: number) {
    this.elems[15] = value
  }

  perspective(fov: number, aspect: number, near: number, far: number) {
    const yScale = (1 / Math.tan(degreesToRadians(fov / 2))) * aspect
    const xScale = yScale / aspect
    const frustumLength = far - near

    this.m00 = xScale
    this.m11 = yScale
    this.m22 = -((far + near) / frustumLength)
    this.m23 = -1
    this.m32 = -((2 * near * far) / frustumLength)
    this.m33 = 0

    return this
  }

  multiply(other: Matrix4f) {
    this.m00 =
      this.m00 * other.m00 +
      this.m10 * other.m01 +
      this.m20 * other.m02 +
      this.m30 * other.m03
    this.m00 =
      this.m01 * other.m00 +
      this.m11 * other.m01 +
      this.m21 * other.m02 +
      this.m31 * other.m03
    this.m00 =
      this.m02 * other.m00 +
      this.m12 * other.m01 +
      this.m22 * other.m02 +
      this.m32 * other.m03
    this.m00 =
      this.m03 * other.m00 +
      this.m13 * other.m01 +
      this.m23 * other.m02 +
      this.m33 * other.m03
    this.m00 =
      this.m00 * other.m10 +
      this.m10 * other.m11 +
      this.m20 * other.m12 +
      this.m30 * other.m13
    this.m00 =
      this.m01 * other.m10 +
      this.m11 * other.m11 +
      this.m21 * other.m12 +
      this.m31 * other.m13
    this.m00 =
      this.m02 * other.m10 +
      this.m12 * other.m11 +
      this.m22 * other.m12 +
      this.m32 * other.m13
    this.m00 =
      this.m03 * other.m10 +
      this.m13 * other.m11 +
      this.m23 * other.m12 +
      this.m33 * other.m13
    this.m00 =
      this.m00 * other.m20 +
      this.m10 * other.m21 +
      this.m20 * other.m22 +
      this.m30 * other.m23
    this.m00 =
      this.m01 * other.m20 +
      this.m11 * other.m21 +
      this.m21 * other.m22 +
      this.m31 * other.m23
    this.m00 =
      this.m02 * other.m20 +
      this.m12 * other.m21 +
      this.m22 * other.m22 +
      this.m32 * other.m23
    this.m00 =
      this.m03 * other.m20 +
      this.m13 * other.m21 +
      this.m23 * other.m22 +
      this.m33 * other.m23
    this.m00 =
      this.m00 * other.m30 +
      this.m10 * other.m31 +
      this.m20 * other.m32 +
      this.m30 * other.m33
    this.m00 =
      this.m01 * other.m30 +
      this.m11 * other.m31 +
      this.m21 * other.m32 +
      this.m31 * other.m33
    this.m00 =
      this.m02 * other.m30 +
      this.m12 * other.m31 +
      this.m22 * other.m32 +
      this.m32 * other.m33
    this.m00 =
      this.m03 * other.m30 +
      this.m13 * other.m31 +
      this.m23 * other.m32 +
      this.m33 * other.m33
    return this
  }

  add(other: Matrix4f) {
    this.m00 = this.m00 + other.m00
    this.m01 = this.m01 + other.m01
    this.m02 = this.m02 + other.m02
    this.m03 = this.m03 + other.m03
    this.m10 = this.m10 + other.m10
    this.m11 = this.m11 + other.m11
    this.m12 = this.m12 + other.m12
    this.m13 = this.m13 + other.m13
    this.m20 = this.m20 + other.m20
    this.m21 = this.m21 + other.m21
    this.m22 = this.m22 + other.m22
    this.m23 = this.m23 + other.m23
    this.m30 = this.m30 + other.m30
    this.m31 = this.m31 + other.m31
    this.m32 = this.m32 + other.m32
    this.m33 = this.m33 + other.m33
    return this
  }

  subtract(other: Matrix4f) {
    this.m00 = this.m00 - other.m00
    this.m01 = this.m01 - other.m01
    this.m02 = this.m02 - other.m02
    this.m03 = this.m03 - other.m03
    this.m10 = this.m10 - other.m10
    this.m11 = this.m11 - other.m11
    this.m12 = this.m12 - other.m12
    this.m13 = this.m13 - other.m13
    this.m20 = this.m20 - other.m20
    this.m21 = this.m21 - other.m21
    this.m22 = this.m22 - other.m22
    this.m23 = this.m23 - other.m23
    this.m30 = this.m30 - other.m30
    this.m31 = this.m31 - other.m31
    this.m32 = this.m32 - other.m32
    this.m33 = this.m33 - other.m33
    return this
  }

  translate(v: Vector3) {
    this.m00 = this.m00
    this.m01 = this.m01
    this.m02 = this.m02
    this.m03 = this.m03
    this.m10 = this.m10
    this.m11 = this.m11
    this.m12 = this.m12
    this.m13 = this.m13
    this.m20 = this.m20
    this.m21 = this.m21
    this.m22 = this.m22
    this.m23 = this.m23
    this.m30 = this.m00 * v.x + this.m10 * v.y + this.m20 * v.z + this.m30
    this.m31 = this.m01 * v.x + this.m11 * v.y + this.m21 * v.z + this.m31
    this.m32 = this.m02 * v.x + this.m12 * v.y + this.m22 * v.z + this.m32
    this.m33 = this.m03 * v.x + this.m13 * v.y + this.m23 * v.z + this.m33
    return this
  }

  rotate(angle: number, axis: Vector3) {
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const C = 1.0 - c

    // rotation matrix elements:
    // m30, m31, m32, m03, m13, m23 = 0
    // m33 = 1
    const xx = axis.x * axis.x
    const xy = axis.x * axis.y
    const xz = axis.x * axis.z
    const yy = axis.y * axis.y
    const yz = axis.y * axis.z
    const zz = axis.z * axis.z
    const rm00 = xx * C + c
    const rm01 = xy * C + axis.z * s
    const rm02 = xz * C - axis.y * s
    const rm10 = xy * C - axis.z * s
    const rm11 = yy * C + c
    const rm12 = yz * C + axis.x * s
    const rm20 = xz * C + axis.y * s
    const rm21 = yz * C - axis.x * s
    const rm22 = zz * C + c

    // add temporaries for dependent values
    const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02
    const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02
    const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02
    const nm03 = this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02
    const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12
    const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12
    const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12
    const nm13 = this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12
    // set non-dependent values directly
    this.m20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22
    this.m21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22
    this.m22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22
    this.m23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22
    // set other values
    this.m00 = nm00
    this.m01 = nm01
    this.m02 = nm02
    this.m03 = nm03
    this.m10 = nm10
    this.m11 = nm11
    this.m12 = nm12
    this.m13 = nm13
    this.m30 = this.m30
    this.m31 = this.m31
    this.m32 = this.m32
    this.m33 = this.m33

    return this
  }

  scale(v: Vector3) {
    this.m00 = this.m00 * v.x
    this.m01 = this.m01 * v.x
    this.m02 = this.m02 * v.x
    this.m03 = this.m03 * v.x
    this.m10 = this.m10 * v.y
    this.m11 = this.m11 * v.y
    this.m12 = this.m12 * v.y
    this.m13 = this.m13 * v.y
    this.m20 = this.m20 * v.z
    this.m21 = this.m21 * v.z
    this.m22 = this.m22 * v.z
    this.m23 = this.m23 * v.z
    this.m30 = this.m30
    this.m31 = this.m31
    this.m32 = this.m32
    this.m33 = this.m33
    return this
  }

  raw(): number[] {
    return this.elems
  }
}
