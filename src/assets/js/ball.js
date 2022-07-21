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
      transparent: true,
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

        vec4 color = texture2D(uTrail, vUv);
        // color.rgb = smoothstep(0.5, 0.9, color.rgb);
        // color.rgb = step(0.5, color.rgb);
        // vec4 invertedColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,1.);
        // float grayscale = invertedColor.r * (1. / 3.) + invertedColor.g * (1. / 3.) + invertedColor.b * (1. / 3.);
        float grayscale = 1.;

        gl_FragColor = vec4(color.rgb, grayscale);
       }
      `
    })
    this.mesh = new Mesh(this.geometry, this.material)

    this.add(this.mesh)
  }

  onResize() {
    this.mesh.scale.set(camera.unit.width, camera.unit.height, 1)
  }
}
