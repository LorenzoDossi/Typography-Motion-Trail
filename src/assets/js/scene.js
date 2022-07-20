import { component } from 'bidello';
import { Scene } from 'three'
import Ball from './ball'
import camera from './camera'

class Stage extends component(Scene) {
  init() {
    this.add(camera)
    this.add(new Ball())
  }
}

export default new Stage();
