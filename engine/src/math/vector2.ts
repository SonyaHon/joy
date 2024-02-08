import { lerp } from './functions'

export class Vector2 {
  static zero() {
    return new Vector2(0, 0)
  }

  static unit(v: number = 1) {
    return new Vector2(v, v)
  }

  static fromArray(arr: number[]) {
    return new Vector2(arr[0], arr[1])
  }

  static up() {
    return new Vector2(0, 1)
  }

  static down() {
    return new Vector2(0, -1)
  }

  static left() {
    return new Vector2(-1, 0)
  }

  static right() {
    return new Vector2(1, 0)
  }

  constructor(
    public x: number,
    public y: number
  ) {}

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  static normalize(v: Vector2) {
    const length = v.length()
    return new Vector2(v.x / length, v.y / length)
  }

  normalize(): this {
    const length = this.length()
    this.x /= length
    this.y /= length
    return this
  }

  static add(a: Vector2, b: Vector2) {
    return new Vector2(a.x + b.x, a.y + b.y)
  }

  add(v: Vector2): this {
    this.x += v.x
    this.y += v.y
    return this
  }

  static subtract(a: Vector2, b: Vector2) {
    return new Vector2(a.x - b.x, a.y - b.y)
  }

  subtract(v: Vector2): this {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  static multiply(a: Vector2, b: Vector2) {
    return new Vector2(a.x * b.x, a.y * b.y)
  }

  multiply(v: Vector2): this {
    this.x *= v.x
    this.y *= v.y
    return this
  }

  static divide(a: Vector2, b: Vector2) {
    return new Vector2(a.x / b.x, a.y / b.y)
  }

  divide(v: Vector2): this {
    this.x /= v.x
    this.y /= v.y
    return this
  }

  static lerp(a: Vector2, b: Vector2, t: number, fn?: (t: number) => number) {
    return new Vector2(lerp(a.x, b.x, t, fn), lerp(a.y, b.y, t, fn))
  }

  lerp(v: Vector2, t: number, fn?: (t: number) => number): this {
    this.x = lerp(this.x, v.x, t, fn)
    this.y = lerp(this.y, v.y, t, fn)
    return this
  }
}
