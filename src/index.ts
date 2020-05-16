import vs from './shader.vert'
import fs from './shader.frag'
import {
  createContext,
  createProgram,
  Program,
  resizeCanvasToDisplaySize
} from './graphics'

export type Vec3 = [number, number, number]

declare const PACKAGE_VERSION: any
export const VERSION: string = PACKAGE_VERSION

function normalizeColor(color: string): Vec3 {
  const div = document.createElement('div')
  div.style.display = 'none'
  div.style.color = color

  document.body.appendChild(div)

  const strColors = getComputedStyle(div).color || 'rgb(0, 0, 0)'
  const numColors = strColors.match(/[+-]?\d+(\.\d+)?/g)
  const intColors = numColors
    ? numColors.map((a) => parseInt(a, 10))
    : [0, 0, 0]

  if (div.parentElement) {
    div.parentElement.removeChild(div)
  }

  if (intColors.length > 3) {
    intColors.length = 3
  } else if (intColors.length < 3) {
    return [0, 0, 0]
  }

  return intColors as Vec3
}

function parseColor(color: string | Vec3): Vec3 {
  let result: Vec3 = [0, 0, 0]

  if (typeof color === 'string') {
    normalizeColor(color).forEach((color, idx) => {
      result[idx] = color / 255
    })
  } else if (Array.isArray(color) && color.length === 3) {
    color.slice(0, 3).forEach((color, idx) => {
      result[idx] = color / 255
    })
  }

  return result
}

export interface KloudsOptions {
  selector: string | HTMLCanvasElement
  speed?: number
  layerCount?: number
  bgColor?: Vec3
  cloudColor1?: Vec3
  cloudColor2?: Vec3
}

export class Klouds {
  private canvas!: HTMLCanvasElement
  private gl!: WebGLRenderingContext
  private program!: Program
  private buffer!: WebGLBuffer

  private isRunning: boolean = false
  private accumTime: number = 0
  private lastTime: number = performance.now()

  private speed!: number
  private layerCount!: number
  private bgColor!: Vec3
  private cloudColor1!: Vec3
  private cloudColor2!: Vec3

  constructor(options: KloudsOptions) {
    const canvas = this.queryRootElement(options.selector)
    if (!canvas) {
      throw new Error(`Invalid options.selector value passed to Klouds`)
    }

    this.canvas = canvas

    const speed = options.speed || 1
    const layerCount = options.layerCount || 5

    const cloudColor1: Vec3 = options.cloudColor1 || [25, 178, 204]
    const cloudColor2: Vec3 = options.cloudColor2 || [255, 255, 255]
    const bgColor: Vec3 = options.bgColor || [0, 102, 128]

    canvas.style.width = '100%'
    canvas.style.height = '100%'

    this.initGraphics(canvas)

    this.setSpeed(speed)
    this.setLayerCount(layerCount)
    this.setBgColor(bgColor)
    this.setCloudColor1(cloudColor1)
    this.setCloudColor2(cloudColor2)

    this.start()
  }

  private queryRootElement(selector: any): HTMLCanvasElement | null {
    if (typeof selector === 'string') {
      const element = document.querySelector(selector)
      if (!element) {
        console.error('options.selector element not found')
        return null
      } else if (!(element instanceof HTMLCanvasElement)) {
        console.error('options.selector element is not a <canvas> element')
        return null
      } else {
        return element
      }
    } else if (selector instanceof HTMLElement) {
      if (selector instanceof HTMLCanvasElement) {
        return selector
      } else {
        console.error('options.selector element is not a <canvas> element')
        return null
      }
    } else {
      console.error('options.selector value is invalid')
      return null
    }
  }

  private initGraphics(canvas: HTMLCanvasElement) {
    const gl = createContext(canvas)
    if (!gl) {
      throw new Error('Failed to create WebGL context')
    }

    const program = createProgram(
      gl,
      vs,
      fs,
      ['position'],
      [
        'resolution',
        'layerCount',
        'time',
        'bgColor',
        'cloudColor1',
        'cloudColor2'
      ]
    )
    if (!program) {
      throw new Error('Failed to create WebGL program')
    }

    const buffer = gl.createBuffer()
    if (!buffer) {
      gl.deleteProgram(program)
      throw new Error('Failed to create WebGL buffer')
    }

    const posAttrib = program.attributes['position']
    gl.enableVertexAttribArray(posAttrib)
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0)

    const bufferData = [
      [-1, -1, 0],
      [1, -1, 0],
      [-1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [1, 1, 0]
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(bufferData.reduce((prev, cur) => prev.concat(cur), [])),
      gl.STATIC_DRAW
    )

    this.gl = gl
    this.program = program
    this.buffer = buffer
  }

  private render = (time: number) => {
    const gl = this.gl
    const program = this.program
    const buffer = this.buffer

    const dt = (time - this.lastTime) * this.speed * 0.001
    this.accumTime += dt
    this.lastTime = time

    resizeCanvasToDisplaySize(this.canvas)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.useProgram(program.handle)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    const posAttrib = program.attributes['position']
    gl.enableVertexAttribArray(posAttrib)
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0)

    gl.uniform2f(
      program.uniforms['resolution'],
      gl.canvas.width,
      gl.canvas.height
    )
    gl.uniform1f(program.uniforms['layerCount'], this.layerCount)
    gl.uniform1f(program.uniforms['time'], this.accumTime)
    gl.uniform3fv(program.uniforms['bgColor'], this.bgColor)
    gl.uniform3fv(program.uniforms['cloudColor1'], this.cloudColor1)
    gl.uniform3fv(program.uniforms['cloudColor2'], this.cloudColor2)

    gl.drawArrays(gl.TRIANGLES, 0, 6)

    if (this.isRunning) {
      requestAnimationFrame(this.render)
    }
  }

  start() {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    requestAnimationFrame(this.render)
  }

  stop() {
    this.isRunning = false
  }

  setSpeed(speed: number) {
    this.speed = Math.max(-100, Math.min(100, speed))
  }

  setCloudColor1(color: string | Vec3) {
    const c = parseColor(color)

    if (c) {
      this.cloudColor1 = c
    }
  }

  setCloudColor2(color: string | Vec3) {
    const c = parseColor(color)

    if (c) {
      this.cloudColor2 = c
    }
  }

  setBgColor(color: string | Vec3) {
    const c = parseColor(color)

    if (c) {
      this.bgColor = c
    }
  }

  setLayerCount(count: number) {
    this.layerCount = Math.max(1, Math.min(8, count)) / 10
  }

  getSpeed() {
    return this.speed
  }

  getLayerCount() {
    return this.layerCount
  }

  getBgColor() {
    return this.bgColor.slice()
  }

  getCloudColor1() {
    return this.cloudColor1.slice()
  }

  getCloudColor2() {
    return this.cloudColor2.slice()
  }
}

export function create(options: KloudsOptions) {
  return new Klouds(options)
}

if (window && typeof (window as any).jQuery !== 'undefined') {
  ;(window as any).jQuery.fn.Klouds = function(options: KloudsOptions) {
    options = options || {}
    const elements = this.get()
    const skies = []
    for (let i = 0; i < elements.length; ++i) {
      options.selector = elements[i]
      skies.push(new Klouds(options))
    }

    return skies
  }
}
