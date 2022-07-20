import {
  Object3D,
  Mesh,
  PlaneBufferGeometry,
  RawShaderMaterial
} from 'three'

import { component } from 'bidello'
import camera from './camera'
import trail from './utils/trail'
import { ShaderMaterial } from 'three'

export default class extends component(Object3D) {
  init() {
    this.geometry = new PlaneBufferGeometry(1, 1, 1, 1)
    this.material = new ShaderMaterial({
      uniforms: {
        uTrail: { value: trail.fbo.target }
      },
      vertexShader: `
        precision highp float;

        varying vec2 vUv;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

          vUv = uv;
        }
      `,
      fragmentShader: `
       precision highp float;

       uniform sampler2D uTrail;

       varying vec2 vUv;

       void main() {

        vec3 color = texture2D(uTrail, vUv).rgb;
        gl_FragColor = vec4(color, 1.);
       }
      `
    })
    this.mesh = new Mesh(this.geometry, this.material)

    this.add(this.mesh)
  }

  onResize() {
    this.longerSide = camera.unit.width > camera.unit.height ? camera.unit.width : camera.unit.height
    this.mesh.scale.set(this.longerSide, this.longerSide, 1)
  }
}
