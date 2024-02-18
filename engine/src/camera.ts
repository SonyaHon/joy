import {degreesToRadians, Matrix4f, radiansToDegrees, Vector3} from './math'
import {logger} from "./logger";

export class Camera3d {
    private _matrixCache: Matrix4f | null = null

    constructor(
        public position: Vector3 = Vector3.zero(),
        public rotation: Vector3 = Vector3.zero()
    ) {
    }

    viewMatrix() {
        if (this._matrixCache) {
            return this._matrixCache
        }

        this._matrixCache = Matrix4f.identity()
            .rotate(degreesToRadians(this.rotation.x), Vector3.right())
            .rotate(degreesToRadians(this.rotation.y), Vector3.up())
            .translate(new Vector3(-this.position.x, -this.position.y, -this.position.z))

        return this._matrixCache
    }

    translate(v: Vector3): this {
        this.position.add(v)
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
        this.rotation.add(v)
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
        const direction = Vector3.subtract(this.position, target).normalize()
        const right = Vector3.cross(up, direction).normalize()
        up = Vector3.cross(direction, right).normalize()

        const rotationX = Math.asin(direction.y)
        const rotationY = -Math.atan2(direction.x, direction.z)
        const rotationZ = Math.atan2(right.y, up.y)

        this.rotation = new Vector3(
            radiansToDegrees(rotationX),
            radiansToDegrees(rotationY),
            radiansToDegrees(rotationZ)
        )

        this._matrixCache = null
        return this
    }
}
