import { WebGLRenderer } from "three";
import { component } from 'bidello'

class Renderer extends component(WebGLRenderer) {
  constructor() {
    super({
      antialising: false
    })

    this.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
  }

  onResize({width, height}) {
    this.setSize(width, height)
  }
}

export default new Renderer()
