import { lerp } from './functions'

export class Vector3 {
  static zero() {
    return new Vector3(0, 0, 0)
  }

  static unit(v: number = 1) {
    return new Vector3(v, v, v)
  }

  static fromArray(arr: number[]) {
    return new Vector3(arr[0], arr[1], arr[2])
  }

  static up() {
    return new Vector3(0, 1, 0)
  }

  static down() {
    return new Vector3(0, -1, 0)
  }

  static left() {
    return new Vector3(-1, 0, 0)
  }

  static right() {
    return new Vector3(1, 0, 0)
  }

  static forward() {
    return new Vector3(0, 0, -1)
  }

  static back() {
    return new Vector3(0, 0, 1)
  }

  constructor(
    public x: number,
    public y: number,
    public z: number
  ) {}

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  static normalize(v: Vector3) {
    const length = v.length()
    return new Vector3(v.x / length, v.y / length, v.z / length)
  }

  normalize(): this {
    const length = this.length()
    this.x /= length
    this.y /= length
    this.z /= length
    return this
  }

  static add(a: Vector3, b: Vector3) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
  }

  add(other: Vector3) {
    this.x += other.x
    this.y += other.y
    this.z += other.z
    return this
  }

  static subtract(a: Vector3, b: Vector3) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
  }

  subtract(other: Vector3) {
    this.x -= other.x
    this.y -= other.y
    this.z -= other.z
    return this
  }

  static multiply(a: Vector3, b: Vector3) {
    return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z)
  }

  multiply(other: Vector3) {
    this.x *= other.x
    this.y *= other.y
    this.z *= other.z
    return this
  }

  static divide(a: Vector3, b: Vector3) {
    return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z)
  }

  divide(other: Vector3) {
    this.x /= other.x
    this.y /= other.y
    this.z /= other.z
    return this
  }

  static dot(a: Vector3, b: Vector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }

  dot(other: Vector3) {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }

  static cross(a: Vector3, b: Vector3) {
    const x = a.y * b.z - a.z * b.y
    const y = a.z * b.x - a.x * b.z
    const z = a.x * b.y - a.y * b.x
    return new Vector3(x, y, z)
  }

  cross(other: Vector3) {
    const x = this.y * other.z - this.z * other.y
    const y = this.z * other.x - this.x * other.z
    const z = this.x * other.y - this.y * other.x
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  static lerp(
    from: Vector3,
    to: Vector3,
    t: number,
    fn?: (t: number) => number
  ) {
    return new Vector3(
      lerp(from.x, to.x, t, fn),
      lerp(from.y, to.y, t, fn),
      lerp(from.z, to.z, t, fn)
    )
  }

  lerp(to: Vector3, t: number, fn?: (t: number) => number) {
    this.x = lerp(this.x, to.x, t, fn)
    this.y = lerp(this.y, to.y, t, fn)
    this.z = lerp(this.z, to.z, t, fn)
    return this
  }
}
