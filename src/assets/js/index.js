import * as helpers from './bidello'
import renderer from './renderer'
import camera from './camera'
import scene from './scene'
import { component } from 'bidello'

class Site extends component() {
  init() {
    document.body.appendChild(renderer.domElement)
  }

  onRaf() {
    renderer.render(scene, camera)
  }
}

new Site()
