import { component } from "bidello";
import { gsap } from 'gsap'
import { Vector2, LinearFilter } from "three";
import FBO from "./fbo";

const shader = `
  precision highp float;

  uniform vec2 resolution;
  uniform vec2 mousePos;
  uniform sampler2D texture;

  float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    float dist = sqrt(dot(uv, uv));
    return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
  }

  float sdfCircle(vec2 p, float r) {
    return length(p) - r;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 oldColor = texture2D(texture, uv).rgb;
    vec3 newColor = vec3(0.);

    uv -= 0.5;
    uv *= resolution;

    newColor += vec3(circle(uv, mousePos * resolution + 0.5, 35., 20.));
    newColor *= 1.5;
    // vec3 newColor = vec3(sdfCircle(uv - mousePos * resolution, 100.));
    // newColor += mix(newColor, vec3(0.0), .5);
    // newColor *= 0.4;
    // newColor = clamp(newColor, vec3(0.0), vec3(1.0));
    float grayscale = 1.;

    newColor += oldColor * 0.45;


    gl_FragColor = vec4(vec3(newColor), grayscale);
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
        mousePos: { value: new Vector2(0, 0) },
        resolution: { value: new Vector2(0, 0) }
      },
      rtOptions: {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      },
    })

    this.pointerTarget = new Vector2()
  }

  onRaf() {
    this.fbo.uniforms.mousePos.value.copy(this.pointerTarget)
    this.fbo.update()
  }

  onResize() {
    this.fbo.resize(innerWidth, innerHeight)
    this.fbo.uniforms.resolution.value.set(innerWidth, innerHeight)
  }

  onPointerMove({ pointer }) {
    gsap.to(this.pointerTarget, {
      x: pointer.normalized.x / 2,
      y: pointer.normalized.y / 2,
      duration: 1.,
      ease: "power3.out"
    })
  }
}

export default new Trail()
