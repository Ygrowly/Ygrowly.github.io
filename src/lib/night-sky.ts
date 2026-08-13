import * as THREE from 'three'

export type SkyKind = 'projects' | 'blog' | 'experience' | 'about'

export interface SkyCardTarget {
  el: HTMLElement
  kind: SkyKind
}

const OBJECT_DISTANCE = 13
const NDC = new THREE.Vector3()

function navy(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    flatShading: true,
    roughness: 0.65,
    metalness: 0.2
  })
}

function steel(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x3b4a63,
    flatShading: true,
    roughness: 0.45,
    metalness: 0.5
  })
}

function glow(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x22d3ee,
    emissiveIntensity: 0.55,
    flatShading: true,
    roughness: 0.4,
    metalness: 0.1
  })
}

function box(mat: THREE.Material, w: number, h: number, d: number): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
}

/** Modular cube cluster — "things built". */
function buildProjects(): THREE.Group {
  const g = new THREE.Group()
  const parts: [number, number, number, number, number, number, THREE.Material][] = [
    [0.95, 0.55, 0.45, 0, -0.25, 0, navy()],
    [0.75, 0.9, 0.6, 0.7, 0.05, 0.1, steel()],
    [0.5, 0.5, 0.5, -0.65, 0.15, -0.1, glow()],
    [1.05, 0.35, 0.7, 0.15, 0.55, -0.05, navy()],
    [0.55, 0.65, 0.45, -0.35, -0.65, 0.05, steel()],
    [0.4, 0.4, 0.4, 0.55, -0.5, -0.15, glow()]
  ]
  for (const [w, h, d, x, y, z, mat] of parts) {
    const m = box(mat, w, h, d)
    m.position.set(x, y, z)
    g.add(m)
  }
  return g
}

/** Fanned pages on a slab — "writing". */
function buildBlog(): THREE.Group {
  const g = new THREE.Group()
  const base = box(navy(), 1.7, 0.14, 1.15)
  base.position.y = -0.55
  g.add(base)
  const page = new THREE.BoxGeometry(1.5, 0.05, 1.0)
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(page, i === 0 ? glow() : steel())
    m.position.set(-0.28 + i * 0.28, -0.28 + i * 0.22, 0.05 + i * 0.03)
    m.rotation.set(0.1 + i * 0.08, 0, 0.06 - i * 0.03)
    g.add(m)
  }
  return g
}

/** Icosahedron probe with a ring and antenna — "experiments". */
function buildExperience(): THREE.Group {
  const g = new THREE.Group()
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), glow())
  g.add(core)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.055, 8, 32), steel())
  ring.rotation.x = Math.PI / 2.2
  g.add(ring)
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85), navy())
  antenna.position.y = 1.05
  g.add(antenna)
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), glow())
  tip.position.y = 1.5
  g.add(tip)
  return g
}

/** Compass disc with a needle — "about". */
function buildAbout(): THREE.Group {
  const g = new THREE.Group()
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.78, 0.16, 8), navy())
  g.add(disc)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 8, 24), steel())
  rim.rotation.x = Math.PI / 2
  g.add(rim)
  const needle = box(glow(), 1.15, 0.07, 0.07)
  needle.position.y = 0.12
  needle.rotation.z = Math.PI / 6
  g.add(needle)
  return g
}

const BUILDERS: Record<SkyKind, () => THREE.Group> = {
  projects: buildProjects,
  blog: buildBlog,
  experience: buildExperience,
  about: buildAbout
}

/**
 * Shared WebGL scene for the night chapter: starfield + node network
 * background, plus one procedural low-poly object per explore card that
 * tracks its card's viewport position.
 */
export class NightSky {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private objects = new Map<SkyKind, THREE.Group>()
  private cards: SkyCardTarget[] = []
  private stars: THREE.Points
  private starPhase: number
  private raf = 0
  private running = false
  private reduced: boolean
  private isMobile: boolean
  private pointer = new THREE.Vector2(0, 0)
  private parallax = new THREE.Vector2(0, 0)
  private hovered: SkyKind | null = null
  private hoveredAt = 0
  private elapsed = 0
  private lastFrame = 0

  constructor(canvas: HTMLCanvasElement) {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.isMobile = window.matchMedia('(max-width: 767px)').matches

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !this.isMobile,
      powerPreference: 'low-power'
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    this.camera.position.set(0, 0, OBJECT_DISTANCE)

    this.scene.add(new THREE.AmbientLight(0x8094b8, 1.1))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(6, 8, 10)
    this.scene.add(key)
    const cyan = new THREE.PointLight(0x22d3ee, 9, 30)
    cyan.position.set(-3, 4, 8)
    this.scene.add(cyan)

    const star = this.buildStars()
    this.stars = star.points
    this.starPhase = star.phase
    this.scene.add(this.stars)
    this.scene.add(this.buildNetwork())

    if (!this.isMobile) {
      for (const kind of Object.keys(BUILDERS) as SkyKind[]) {
        const group = BUILDERS[kind]()
        group.visible = false
        this.objects.set(kind, group)
        this.scene.add(group)
      }
    }

    this.resize()

    if (!this.reduced) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true })
      window.addEventListener('scroll', this.updatePositions, { passive: true })
      window.addEventListener('resize', this.resize)
      this.start()
    } else {
      this.updatePositions()
      this.renderFrame()
    }
  }

  mountCards(cards: SkyCardTarget[]) {
    this.cards = cards
    this.updatePositions()
  }

  setHover(kind: SkyKind | null) {
    this.hovered = kind
    this.hoveredAt = performance.now()
  }

  setActive(active: boolean) {
    if (this.reduced) return
    if (active) this.start()
    else this.stop()
  }

  dispose() {
    this.stop()
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('scroll', this.updatePositions)
    window.removeEventListener('resize', this.resize)
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh || node instanceof THREE.Points || node instanceof THREE.LineSegments) {
        node.geometry?.dispose()
        const materials = Array.isArray(node.material) ? node.material : [node.material]
        materials.forEach((m) => m?.dispose())
      }
    })
    this.renderer.dispose()
  }

  private buildStars(): { points: THREE.Points; phase: number } {
    const count = this.isMobile ? 150 : 520
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 46
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26
      positions[i * 3 + 2] = -8 + Math.random() * 12
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: 0x9fd8ff,
      size: 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })
    return { points: new THREE.Points(geometry, material), phase: Math.random() * Math.PI * 2 }
  }

  private buildNetwork(): THREE.Group {
    const group = new THREE.Group()
    if (this.isMobile) return group

    const count = 34
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 44,
          (Math.random() - 0.5) * 20,
          -6 + Math.random() * 8
        )
      )
    }
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(positions)
    const nodeMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.09,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    })
    group.add(new THREE.Points(nodeGeo, nodeMat))

    const linePositions: number[] = []
    const threshold = 9
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (positions[i].distanceTo(positions[j]) < threshold) {
          linePositions.push(positions[i].x, positions[i].y, positions[i].z)
          linePositions.push(positions[j].x, positions[j].y, positions[j].z)
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.08,
      depthWrite: false
    })
    group.add(new THREE.LineSegments(lineGeo, lineMat))
    return group
  }

  private onPointerMove = (event: PointerEvent) => {
    this.pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -((event.clientY / window.innerHeight) * 2 - 1)
    )
  }

  private resize = () => {
    const width = this.renderer.domElement.clientWidth
    const height = this.renderer.domElement.clientHeight
    if (width === 0 || height === 0) return
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.updatePositions()
  }

  /** Re-project each card's viewport rect onto the z≈0 world plane. */
  private updatePositions = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    for (const { el, kind } of this.cards) {
      const object = this.objects.get(kind)
      if (!object) continue
      const rect = el.getBoundingClientRect()
      const onScreen = rect.bottom > 0 && rect.top < height && rect.width > 0
      if (!onScreen) {
        object.visible = false
        continue
      }
      const cx = rect.left + rect.width / 2
      const cy = rect.top + Math.min(rect.height * 0.22, 96)
      NDC.set((cx / width) * 2 - 1, -((cy / height) * 2 - 1), 0.5).unproject(this.camera)
      const direction = NDC.sub(this.camera.position).normalize()
      object.position.copy(
        this.camera.position.clone().add(direction.multiplyScalar(OBJECT_DISTANCE))
      )
      object.userData.baseY = object.position.y
      object.visible = true
    }
  }

  private start() {
    if (this.running) return
    this.running = true
    this.lastFrame = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private tick = () => {
    if (!this.running) return
    const now = performance.now()
    const dt = Math.min((now - this.lastFrame) / 1000, 0.05)
    this.lastFrame = now
    const t = (this.elapsed += dt)

    this.parallax.x += (this.pointer.x - this.parallax.x) * 0.04
    this.parallax.y += (this.pointer.y - this.parallax.y) * 0.04
    this.camera.position.x = this.parallax.x * 0.7
    this.camera.position.y = this.parallax.y * 0.45
    this.camera.lookAt(0, 0, 0)

    for (const [kind, object] of this.objects) {
      if (!object.visible) continue
      const hovered = kind === this.hovered
      const hoverBlend = Math.min((performance.now() - this.hoveredAt) / 300, 1)
      const hoverAmount = hovered ? hoverBlend : 1 - hoverBlend
      const speed = 0.22 + hoverAmount * 1.5
      object.rotation.y += speed * dt
      object.rotation.x += Math.sin(t * 0.5 + object.position.x) * dt * 0.15
      const baseY = typeof object.userData.baseY === 'number' ? object.userData.baseY : object.position.y
      object.position.y = baseY + Math.sin(t * 0.8 + object.position.x * 0.7) * 0.1
      const targetScale = 1 + hoverAmount * 0.14
      object.scale.setScalar(object.scale.x + (targetScale - object.scale.x) * 0.08)
    }

    this.stars.rotation.y = t * 0.008
    ;(this.stars.material as THREE.PointsMaterial).opacity =
      0.68 + Math.sin(t * 0.5 + this.starPhase) * 0.12

    this.renderFrame()
    this.raf = requestAnimationFrame(this.tick)
  }

  private renderFrame() {
    this.renderer.render(this.scene, this.camera)
  }
}
