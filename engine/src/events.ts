export abstract class Event<T = any> {
  public handled = false

  is<T>(kind: T): this is T {
    // @ts-ignore
    return this instanceof kind
  }
}

export class EventDispatcher {
  private _listeners: ((event: Event) => void | Promise<void>)[] = []

  onEvent(callback: (event: Event) => void | Promise<void>) {
    this._listeners.push(callback)
  }

  dispatch(event: Event) {
    for (const listener of this._listeners) {
      listener(event)
    }
  }

  async dispatchAsync(event: Event) {
    for (const listener of this._listeners) {
      await listener(event)
    }
  }
}

export class WindowCloseEvent extends Event<never> {}
