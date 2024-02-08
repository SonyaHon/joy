import { Event } from './events'

export abstract class Layer {
  abstract onAttach(): void
  abstract onDetach(): void
  abstract onUpdate(): void
  abstract onRender(): void
  abstract onEvent(event: Event): void
}

export class LayerStack {
  private layers: Layer[] = []
  private overlays: Layer[] = []

  pushLayer(layer: Layer) {
    this.layers.push(layer)
    layer.onAttach()
  }

  popLayer(layer: Layer) {
    const index = this.layers.indexOf(layer)
    this.layers.splice(index, 1)
    layer.onDetach()
  }

  pushOverlay(overlay: Layer) {
    this.overlays.push(overlay)
    overlay.onAttach()
  }

  popOverlay(overlay: Layer) {
    const index = this.overlays.indexOf(overlay)
    this.overlays.splice(index, 1)
    overlay.onDetach()
  }

  cycleForwards(callback: (layer: Layer, cmds: { break: () => void }) => void) {
    let shouldBreak = false
    let commands = {
      break: () => {
        shouldBreak = true
      },
    }
    for (let i = 0; i < this.layers.length + this.overlays.length; i++) {
      if (i < this.layers.length) {
        callback(this.layers[i], commands)
        if (shouldBreak) break
      } else {
        callback(this.overlays[i - this.layers.length], commands)
        if (shouldBreak) break
      }
    }
  }

  cycleBackwards(
    callback: (layer: Layer, cmds: { break: () => void }) => void
  ) {
    let shouldBreak = false
    let commands = {
      break: () => {
        shouldBreak = true
      },
    }
    for (let i = this.layers.length + this.overlays.length - 1; i >= 0; i--) {
      if (i < this.layers.length) {
        callback(this.layers[i], commands)
        if (shouldBreak) break
      } else {
        callback(this.overlays[i - this.layers.length], commands)
        if (shouldBreak) break
      }
    }
  }
}
