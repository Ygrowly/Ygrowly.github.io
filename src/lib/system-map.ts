import * as THREE from 'three'

export type SkyKind = 'projects' | 'blog' | 'experience' | 'about'

export interface SkyCardTarget {
  el: HTMLElement
  kind: SkyKind
}

const OBJECT_DISTANCE = 13
const NDC = new THREE.Vector3()

/**
 * The scene palette, read from the design tokens rather than hardcoded, so the
 * map follows the light/dark switch like every other surface on the page.
 * `--scene-body` and `--scene-frame` carry the two solid roles; the accent is
 * `--tech-glow`, the same token the CSS instruments use.
 */
interface ScenePalette {
  body: THREE.Color
  frame: THREE.Color
  accent: THREE.Color
  star: THREE.Color
  /** A starfield is a night device; on paper it reads as noise. */
  showStars: boolean
}

const FALLBACK = {
  body: { light: '#5b6b86', dark: '#1e3a8a' },
  frame: { light: '#94a3b8', dark: '#3b4a63' },
  accent: '#22d3ee',
  star: '#9fd8ff'
}

function prefersDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

function readPalette(): ScenePalette {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback
  const dark = prefersDark()
  return {
    body: new THREE.Color(token('--scene-body', dark ? FALLBACK.body.dark : FALLBACK.body.light)),
    frame: new THREE.Color(
      token('--scene-frame', dark ? FALLBACK.frame.dark : FALLBACK.frame.light)
    ),
    accent: new THREE.Color(token('--tech-glow', FALLBACK.accent)),
    star: new THREE.Color(FALLBACK.star),
    showStars: dark
  }
}

/**
 * One material per role, shared by every part of every object and recoloured in
 * place. Sharing is what makes a theme switch cheap: no geometry is rebuilt,
 * the materials just take the new colours.
 */
class SceneMaterials {
  readonly body: THREE.MeshStandardMaterial
  readonly frame: THREE.MeshStandardMaterial
  readonly accent: THREE.MeshStandardMaterial

  constructor(palette: ScenePalette) {
    this.body = new THREE.MeshStandardMaterial({
      flatShading: true,
      roughness: 0.65,
      metalness: 0.2
    })
    this.frame = new THREE.MeshStandardMaterial({
      flatShading: true,
      roughness: 0.45,
      metalness: 0.5
    })
    this.accent = new THREE.MeshStandardMaterial({
      flatShading: true,
      roughness: 0.4,
      metalness: 0.1
    })
    this.apply(palette)
  }

  apply(palette: ScenePalette) {
    const dark = palette.showStars
    this.body.color.copy(palette.body)
    this.frame.color.copy(palette.frame)
    this.accent.color.copy(palette.accent)
    this.accent.emissive.copy(palette.accent)
    this.accent.emissiveIntensity = dark ? 0.55 : 0.32
    // Metal reflects the ambient wash; on a light page that reads as haze
    // rather than material, so the paper version is mostly diffuse.
    this.body.metalness = dark ? 0.2 : 0.04
    this.frame.metalness = dark ? 0.5 : 0.12
    this.body.roughness = dark ? 0.65 : 0.55
  }
}

function box(mat: THREE.Material, w: number, h: number, d: number): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
}

/** Modular cube cluster — "things built". */
function buildProjects(m: SceneMaterials): THREE.Group {
  const g = new THREE.Group()
  const parts: [number, number, number, number, number, number, THREE.Material][] = [
    [0.95, 0.55, 0.45, 0, -0.25, 0, m.body],
    [0.75, 0.9, 0.6, 0.7, 0.05, 0.1, m.frame],
    [0.5, 0.5, 0.5, -0.65, 0.15, -0.1, m.accent],
    [1.05, 0.35, 0.7, 0.15, 0.55, -0.05, m.body],
    [0.55, 0.65, 0.45, -0.35, -0.65, 0.05, m.frame],
    [0.4, 0.4, 0.4, 0.55, -0.5, -0.15, m.accent]
  ]
  for (const [w, h, d, x, y, z, mat] of parts) {
    const mesh = box(mat, w, h, d)
    mesh.position.set(x, y, z)
    g.add(mesh)
  }
  return g
}

/** Fanned pages on a slab — "writing". */
function buildBlog(m: SceneMaterials): THREE.Group {
  const g = new THREE.Group()
  const base = box(m.body, 1.7, 0.14, 1.15)
  base.position.y = -0.55
  g.add(base)
  const page = new THREE.BoxGeometry(1.5, 0.05, 1.0)
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(page, i === 0 ? m.accent : m.frame)
    mesh.position.set(-0.28 + i * 0.28, -0.28 + i * 0.22, 0.05 + i * 0.03)
    mesh.rotation.set(0.1 + i * 0.08, 0, 0.06 - i * 0.03)
    g.add(mesh)
  }
  return g
}

/** Icosahedron probe with a ring and antenna — "experiments". */
function buildExperience(m: SceneMaterials): THREE.Group {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), m.accent))
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.055, 8, 32), m.frame)
  ring.rotation.x = Math.PI / 2.2
  g.add(ring)
  // A short mast: a tall one dominates the bounding box the object is
  // normalised by, shrinking the core to a dot next to a stray line.
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), m.body)
  antenna.position.y = 0.75
  g.add(antenna)
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), m.accent)
  tip.position.y = 0.95
  g.add(tip)
  return g
}

/** Compass disc with a needle — "about". */
function buildAbout(m: SceneMaterials): THREE.Group {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.78, 0.16, 8), m.body))
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 8, 24), m.frame)
  rim.rotation.x = Math.PI / 2
  g.add(rim)
  const needle = box(m.accent, 1.15, 0.07, 0.07)
  needle.position.y = 0.12
  needle.rotation.z = Math.PI / 6
  g.add(needle)
  return g
}

const BUILDERS: Record<SkyKind, (m: SceneMaterials) => THREE.Group> = {
  projects: buildProjects,
  blog: buildBlog,
  experience: buildExperience,
  about: buildAbout
}

/**
 * How tall the biggest object may render, in world units. Kept under the stage
 * band (190px at PX_PER_UNIT ≈ 108) with margin for rotation, which can project
 * wider than the axis-aligned bounds the object was measured by.
 */
const OBJECT_TARGET = 1.3

/**
 * Recentre a built object on its own bounding box and scale it so its longest
 * side is `target`. The four objects are authored at very different sizes (the
 * probe with its antenna is more than twice the fanned pages), and a shared
 * stage needs them to read as equals.
 *
 * The outer group is what the frame positions, so its origin becomes the
 * object's visual centre.
 */
function normalize(built: THREE.Group, target: number): THREE.Group {
  const bounds = new THREE.Box3().setFromObject(built)
  const size = new THREE.Vector3()
  const centre = new THREE.Vector3()
  bounds.getSize(size)
  bounds.getCenter(centre)
  built.position.sub(centre)

  const holder = new THREE.Group()
  holder.add(built)
  const scale = target / Math.max(size.x, size.y, size.z)
  holder.userData.baseScale = scale
  holder.scale.setScalar(scale)
  return holder
}

/**
 * The system map scene: one procedural low-poly object per destination card,
 * each projected onto its card's position inside the canvas, plus a faint node
 * network behind them.
 *
 * Every position is measured against the canvas box rather than the viewport,
 * so the canvas is an ordinary block element. Nothing here reads the scroll
 * position: the cards move with the layout and the objects follow them.
 */
export class SystemMapScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private objects = new Map<SkyKind, THREE.Group>()
  private cards: SkyCardTarget[] = []
  private mats: SceneMaterials
  private palette: ScenePalette
  private stars: THREE.Points
  private network: THREE.Group
  private ambient: THREE.AmbientLight
  private key: THREE.DirectionalLight
  private accentLight: THREE.PointLight
  private stageHalf = new Map<HTMLElement, number>()
  private starPhase: number
  private raf = 0
  private running = false
  private reduced: boolean
  private pointer = new THREE.Vector2(0, 0)
  private parallax = new THREE.Vector2(0, 0)
  private hovered: SkyKind | null = null
  private hoveredAt = 0
  private elapsed = 0
  private lastFrame = 0

  constructor(canvas: HTMLCanvasElement) {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.palette = readPalette()
    this.mats = new SceneMaterials(this.palette)

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    this.camera.position.set(0, 0, OBJECT_DISTANCE)

    this.ambient = new THREE.AmbientLight(0x8094b8, 1.1)
    this.scene.add(this.ambient)
    this.key = new THREE.DirectionalLight(0xffffff, 1.6)
    this.key.position.set(6, 8, 10)
    this.scene.add(this.key)
    this.accentLight = new THREE.PointLight(0x22d3ee, 9, 30)
    this.accentLight.position.set(-3, 4, 8)
    this.scene.add(this.accentLight)

    const star = this.buildStars()
    this.stars = star.points
    this.starPhase = star.phase
    this.stars.visible = this.palette.showStars
    this.scene.add(this.stars)

    this.network = this.buildNetwork()
    this.scene.add(this.network)

    for (const kind of Object.keys(BUILDERS) as SkyKind[]) {
      const group = normalize(BUILDERS[kind](this.mats), OBJECT_TARGET)
      group.visible = false
      this.objects.set(kind, group)
      this.scene.add(group)
    }

    this.applyPalette()
    this.resize()

    if (!this.reduced) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true })
      window.addEventListener('resize', this.resize)
      window.addEventListener('ygrowly:theme-change', this.onThemeChange)
      this.start()
    } else {
      this.updatePositions()
      this.renderFrame()
    }
  }

  mountCards(cards: SkyCardTarget[]) {
    this.cards = cards
    this.measureStages()
    this.updatePositions()
    this.renderFrame()
  }

  /**
   * Cache each card's stage half-height. The card reserves its top padding for
   * the object, so reading it from the computed style keeps CSS as the single
   * owner of the size instead of a number guessed here going stale.
   */
  private measureStages() {
    this.stageHalf.clear()
    for (const { el } of this.cards) {
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0
      this.stageHalf.set(el, pad / 2)
    }
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
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('ygrowly:theme-change', this.onThemeChange)
    this.scene.traverse((node) => {
      if (
        node instanceof THREE.Mesh ||
        node instanceof THREE.Points ||
        node instanceof THREE.LineSegments
      ) {
        node.geometry?.dispose()
        const materials = Array.isArray(node.material) ? node.material : [node.material]
        materials.forEach((m) => m?.dispose())
      }
    })
    this.renderer.dispose()
  }

  /** Recolour everything in place; no geometry is rebuilt on a theme switch. */
  private applyPalette() {
    const dark = this.palette.showStars
    this.mats.apply(this.palette)
    this.stars.visible = dark
    this.accentLight.color.copy(this.palette.accent)
    // Total illumination has to stay near 1 or the material colour is washed
    // out to white; the night version can afford more because the background
    // carries the contrast.
    this.ambient.intensity = dark ? 1.1 : 0.55
    this.key.intensity = dark ? 1.6 : 0.75
    this.accentLight.intensity = dark ? 9 : 1.5
    this.network.traverse((node) => {
      const material = (node as THREE.Points | THREE.LineSegments).material as
        | (THREE.Material & { color?: THREE.Color })
        | undefined
      material?.color?.copy(this.palette.accent)
    })
  }

  private onThemeChange = () => {
    this.palette = readPalette()
    this.applyPalette()
    this.renderFrame()
  }

  private buildStars(): { points: THREE.Points; phase: number } {
    const count = 520
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 46
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26
      positions[i * 3 + 2] = -8 + Math.random() * 12
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: FALLBACK.star,
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
      color: FALLBACK.accent,
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
    lineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    )
    const lineMat = new THREE.LineBasicMaterial({
      color: FALLBACK.accent,
      transparent: true,
      opacity: 0.1,
      depthWrite: false
    })
    group.add(new THREE.LineSegments(lineGeo, lineMat))
    return group
  }

  private onPointerMove = (event: PointerEvent) => {
    const box = this.renderer.domElement.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) return
    this.pointer.set(
      Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1)),
      Math.max(-1, Math.min(1, -(((event.clientY - box.top) / box.height) * 2 - 1)))
    )
  }

  private resize = () => {
    const width = this.renderer.domElement.clientWidth
    const height = this.renderer.domElement.clientHeight
    if (width === 0 || height === 0) return
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.measureStages()
    this.updatePositions()
  }

  /** Project each card's rect onto the z≈0 world plane, in canvas space. */
  private updatePositions = () => {
    const box = this.renderer.domElement.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) return
    for (const { el, kind } of this.cards) {
      const object = this.objects.get(kind)
      if (!object) continue
      const rect = el.getBoundingClientRect()
      const inside = rect.bottom > box.top && rect.top < box.bottom && rect.width > 0
      if (!inside) {
        object.visible = false
        continue
      }
      // Sit the object in the card's stage, centred on the reserved band.
      const cx = rect.left + rect.width / 2
      const cy = rect.top + (this.stageHalf.get(el) ?? 0)
      NDC.set(
        ((cx - box.left) / box.width) * 2 - 1,
        -(((cy - box.top) / box.height) * 2 - 1),
        0.5
      ).unproject(this.camera)
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

    // Card rects are read inside the frame rather than on a scroll handler, so
    // one pass covers both the follow and the draw.
    this.updatePositions()

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
      const baseY =
        typeof object.userData.baseY === 'number' ? object.userData.baseY : object.position.y
      object.position.y = baseY + Math.sin(t * 0.8 + object.position.x * 0.7) * 0.1
      const base =
        typeof object.userData.baseScale === 'number' ? object.userData.baseScale : 1
      const targetScale = base * (1 + hoverAmount * 0.14)
      object.scale.setScalar(object.scale.x + (targetScale - object.scale.x) * 0.08)
    }

    if (this.stars.visible) {
      this.stars.rotation.y = t * 0.008
      ;(this.stars.material as THREE.PointsMaterial).opacity =
        0.68 + Math.sin(t * 0.5 + this.starPhase) * 0.12
    }

    this.renderFrame()
    this.raf = requestAnimationFrame(this.tick)
  }

  private renderFrame() {
    this.renderer.render(this.scene, this.camera)
  }
}
