import * as THREE from 'three'

const clock = new THREE.Clock()
const scene = new THREE.Scene()

// Create a new framebuffer we will use to render to
// the video card memory
let renderBufferA = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)

let renderBufferB = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)

// Create a threejs renderer:
// 1. Size it correctly
// 2. Set default background color
// 3. Append it to the page
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x222222)
renderer.setClearAlpha(0)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio || 1)
document.body.appendChild(renderer.domElement)

// Create an orthographic camera that covers the entire screen
// 1. Position it correctly in the positive Z dimension
// 2. Orient it towards the scene center
const orthoCamera = new THREE.OrthographicCamera(
  -innerWidth / 2,
  innerWidth / 2,
  innerHeight / 2,
  -innerHeight / 2,
  0.1,
  10,
)
orthoCamera.position.set(0, 0, 1)
orthoCamera.lookAt(new THREE.Vector3(0, 0, 0))

console.log('k')

// Create a plane geometry that spawns either the entire
// viewport height or width
const labelMeshSize = innerWidth > innerHeight ? innerHeight : innerWidth
const circleGeometry = new THREE.PlaneBufferGeometry( labelMeshSize, labelMeshSize)
const circleMaterial = new THREE.ShaderMaterial({
  defines: {
    RESOLUTION: `vec2(${innerWidth.toFixed(1)}, ${innerHeight.toFixed(1)})`
  },
  uniforms: {
    mousePos: { value: new THREE.Vector2(0, 0) }
  },
  vertexShader: `
      varying vec2 vUv;

      void main () {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv;
      }
    `,
  fragmentShader: `
    uniform vec2 mousePos;
    varying vec2 vUv;

    vec3 drawGrid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth, vec2 uv) {
      vec2 center = uv - 0.5;
      vec2 cells = abs(fract(center * RESOLUTION / cellSpacing) - 0.5);
      float distToEdge = (.5 - max(cells.x, cells.y)) * cellSpacing;
      float lines = smoothstep(0., lineWidth, distToEdge);

      color = mix(lineColor, color, lines);

      return color;
    }

    vec3 bgColor(vec2 uv) {
      float distFromCenter = length(abs(uv - 0.5));

      float vignette = distFromCenter;
      vignette = smoothstep(0., 0.01, vignette);

      return vec3(vignette);
    }

    float sdfCircle(vec2 p, float r) {
      return length(p) - r;
    }

    void main() {
      vec2 pixelCoords = (vUv - 0.5) * RESOLUTION;

      vec3 color = bgColor(vUv);
      color = drawGrid(color, vec3(0.5), 10., 1., vUv);
      color = drawGrid(color, vec3(0.5), 100., 3., vUv);

      float d = sdfCircle(pixelCoords - mousePos, 100.);
      color = mix(vec3(1., 0., 0.), color, step(0., d));

      gl_FragColor = vec4(vec3(color), 1);
    }
  `
})

// Create a plane mesh, add it to the scene
const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial)
scene.add(circleMesh)

// Create a second scene that will hold our fullscreen plane
const postFXScene = new THREE.Scene()

// Create a plane geometry that covers the entire screen
const postFXGeometry = new THREE.PlaneBufferGeometry(innerWidth, innerHeight)

// Create a plane material that expects a sampler texture input
// We will pass our generated framebuffer texture to it
const postFXMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sampler: { value: null },
    time: { value: 0 },
    mousePos: { value: new THREE.Vector2(0, 0) }
  },
  // vertex shader will be in charge of positioning our plane correctly
  vertexShader: `
    varying vec2 vUv;

    void main () {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D sampler;

    varying vec2 vUv;

    void main () {
      vec4 inputColor = texture2D(sampler, vUv + vec2(0.005));

      gl_FragColor = vec4(inputColor * 0.975);
    }
  `
})
const postFXMesh = new THREE.Mesh(postFXGeometry, postFXMaterial)
postFXScene.add(postFXMesh)

// ... animation loop code here, same as before

// Start out animation render loop
renderer.setAnimationLoop(onAnimLoop)

// Attach mousemove event listener
document.addEventListener('mousemove', onMouseMove)

function onMouseMove (e) {
  // Normalise horizontal mouse pos from -1 to 1
  const x = (e.pageX / innerWidth) * 2 - 1

  // Normalise vertical mouse pos from -1 to 1
  const y = (1 - e.pageY / innerHeight) * 2 - 1

  // Pass normalised mouse coordinates to fragment shader
  postFXMesh.material.uniforms.mousePos.value.set(x, y)
  circleMesh.material.uniforms.mousePos.value.set(x * innerWidth / 2, y * innerHeight / 2)
}

window.addEventListener('resize', onResize)

function onResize() {
  console.log('mario');
  circleMaterial.defines.RESOLUTION = `vec2(${innerWidth.toFixed(1)}, ${innerHeight.toFixed(1)})`
}

function onAnimLoop() {
  // Do not clear the contents of the canvas on each render
  // In order to achieve our effect, we must draw the new frame
  // on top of the previous one!
  renderer.autoClearColor = false

  // Explicitly set renderBufferA as the framebuffer to render to
  renderer.setRenderTarget(renderBufferA)

  // On each new frame, render the scene to renderBufferA
  renderer.render(postFXScene, orthoCamera)
  renderer.render(scene, orthoCamera)

  // Set the device screen as the framebuffer to render to
  // In WebGL, framebuffer "null" corresponds to the default framebuffer!
  renderer.setRenderTarget(null)

  // Assign the generated texture to the sampler variable used
  // in the postFXMesh that covers the device screen
  postFXMesh.material.uniforms.sampler.value = renderBufferA.texture

  // Render the postFX mesh to the default framebuffer
  renderer.render(postFXScene, orthoCamera)

  // Ping-pong our framebuffers by swapping them
  // at the end of each frame render
  const temp = renderBufferA
  renderBufferA = renderBufferB
  renderBufferB = temp
}
