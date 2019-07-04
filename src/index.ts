/// <reference path="global.d.ts" />
import * as twgl from 'twgl.js'
import vs from './shader.vert'
import fs from './shader.frag'

type Vec3 = [number, number, number]

function normalizeColor(color: string): Vec3 {
  const div = document.createElement('div')
  div.style.display = 'none'
  div.style.color = color

  document.body.appendChild(div)

  const strColors = getComputedStyle(div).color || 'rgb(0, 0, 0)'
  const numColors = strColors.match(/[+-]?\d+(\.\d+)?/g)
  const intColors = numColors ? numColors.map(a => parseInt(a, 10)) : [0, 0, 0]

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
  gl: WebGLRenderingContext
  programInfo: twgl.ProgramInfo
  bufferInfo: twgl.BufferInfo
  arrays: { position: number[] } = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
  }

  isRunning: boolean = false
  accumTime: number = 0
  lastTime: number = performance.now()

  speed!: number
  layerCount!: number
  bgColor!: Vec3
  cloudColor1!: Vec3
  cloudColor2!: Vec3

  constructor(options: KloudsOptions) {
    const element = this.queryRootElement(options.selector)
    if (!element) {
      throw new Error(`Invalid options.selector value passed to Klouds`)
    }

    const speed = options.speed || 1
    const layerCount = options.layerCount || 5

    const cloudColor1: Vec3 = options.cloudColor1
      ? parseColor(options.cloudColor1)
      : [0.1, 0.7, 0.8]
    const cloudColor2: Vec3 = options.cloudColor2
      ? parseColor(options.cloudColor2)
      : [1.0, 1.0, 1.0]
    const bgColor: Vec3 = options.bgColor
      ? parseColor(options.bgColor)
      : [0.0, 0.4, 0.5]

    element.style.width = '100%'
    element.style.height = '100%'

    const gl = twgl.getWebGLContext(element)
    const programInfo = twgl.createProgramInfo(gl, [vs, fs])
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, this.arrays)

    this.gl = gl
    this.programInfo = programInfo
    this.bufferInfo = bufferInfo

    
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

  render = (time: number) => {
    const gl = this.gl
    const programInfo = this.programInfo
    const bufferInfo = this.bufferInfo

    const dt = (time - this.lastTime) * this.speed * 0.001
    this.accumTime += dt
    this.lastTime = time

    twgl.resizeCanvasToDisplaySize(gl.canvas)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    const uniforms = {
      time: this.accumTime,
      resolution: [gl.canvas.width, gl.canvas.height],
      bgColor: this.bgColor,
      cloudColor1: this.cloudColor1,
      cloudColor2: this.cloudColor2,
      layerCount: this.layerCount / 10
    }

    gl.useProgram(programInfo.program)
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
    twgl.setUniforms(programInfo, uniforms)
    twgl.drawBufferInfo(gl, bufferInfo)

    if (this.isRunning) {
      requestAnimationFrame(this.render)
    }
  }

  stop() {
    this.isRunning = false
  }

  start() {
    this.isRunning = true
    requestAnimationFrame(this.render)
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
    this.layerCount = Math.max(1, Math.min(8, count))
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
