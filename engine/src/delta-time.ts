export class DeltaTime {
  private _timeScale = 1.0
  private _lastDelta = 0.0
  private _elapsedTotal = 0.0

  get deltaTime() {
    return this._timeScale * this._lastDelta
  }

  get elapsedTotal() {
    return this._elapsedTotal
  }

  setTimeScale(timeScale?: number) {
    this._timeScale = timeScale ?? 1.0
  }

  $internal$__update(deltaTime: number) {
    this._lastDelta = deltaTime
    this._elapsedTotal += deltaTime
  }
}
