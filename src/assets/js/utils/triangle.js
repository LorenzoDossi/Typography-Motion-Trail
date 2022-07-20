import {
  BufferAttribute,
  BufferGeometry
} from "three";

const vertices = new Float32Array([
  -1., -1.,
  3., -1.,
  -1., 3.
])

const geometry = new BufferGeometry()
geometry.setAttribute('position', new BufferAttribute(vertices, 2))

export default geometry
