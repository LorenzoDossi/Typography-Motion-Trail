import { WebGLRenderer } from "three";
import { component } from 'bidello'

class Renderer extends component(WebGLRenderer) {
  constructor() {
    super({
      antialising: false,
      alpha: true
    })

    this.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    this.setClearColor(0xff0000, 0.);
  }

  onResize({width, height}) {
    this.setSize(width, height)
  }
}

export default new Renderer()
