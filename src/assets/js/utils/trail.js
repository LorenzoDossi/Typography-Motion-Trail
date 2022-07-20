import { component } from "bidello";
import { Vector2 } from "three";
import FBO from "./fbo";

const shader = `
precision highp float;

uniform vec2 mousePos;
uniform bool landscape;

float sdfCircle(vec2 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = gl_FragCoord.xy / RESOLUTION.xy;
  // vec2 pixelCoords = vec2(0.);
  vec2 pixelCoords = (uv - 0.5) * vec2(RESOLUTION);

  // if (landscape) {
  // } else {
  //   pixelCoords = (uv - 0.5) * vec2(RESOLUTION);
  // }

  vec3 color = vec3(1.);

  float d = sdfCircle(pixelCoords - mousePos / 2. * vec2(RESOLUTION), 100.);
  color = mix(vec3(1., 0., 0.), color, step(0., d));
  // color = vec3(length(uv - 0.5));

  gl_FragColor = vec4(vec3(color), 1.);
}

`

class Trail extends component() {
  init() {
    this.fbo = new FBO({
      width: innerWidth,
      height: innerHeight,
      name: 'trail',
      shader,
      uniforms: {
        landscape: { value: true },
        mousePos: { value: new Vector2(0, 0) }
      },
    })
  }

  onRaf() {
    this.fbo.update()
  }

  onResize() {
    let longerSide = innerWidth > innerHeight ? innerWidth : innerHeight
    this.fbo.resize(longerSide, longerSide)
    this.fbo.uniforms.landscape.value = innerWidth > innerHeight
  }

  onPointerMove({ pointer }) {
    let pointerSide = innerWidth > innerHeight ? pointer.normalized.x : pointer.normalized.y

    this.fbo.uniforms.mousePos.value.set(pointer.normalized.x, pointer.normalized.y)
  }
}

export default new Trail()
