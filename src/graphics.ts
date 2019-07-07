export function createContext(canvas: HTMLCanvasElement) {
  return canvas.getContext('webgl')
}

export enum ShaderType {
  VERTEX,
  FRAGMENT
}

export function createShader(
  gl: WebGLRenderingContext,
  type: ShaderType,
  source: string
) {
  const shader =
    type === ShaderType.VERTEX
      ? gl.createShader(gl.VERTEX_SHADER)
      : gl.createShader(gl.FRAGMENT_SHADER)
  if (!shader) {
    console.error('Failed to create WebGL shader')
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.debug(gl.getShaderInfoLog(shader))
    console.error('Failed to compile WebGL shader')
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertShaderSrc: string,
  fragShaderSrc: string,
  attributeNames: string[],
  uniformNames: string[]
) {
  const program = gl.createProgram()
  if (!program) {
    console.error('Failed to create WebGL program')
    return null
  }

  const vertexShader = createShader(gl, ShaderType.VERTEX, vertShaderSrc)
  const fragmentShader = createShader(gl, ShaderType.FRAGMENT, fragShaderSrc)

  if (!vertexShader || !fragmentShader) {
    console.error('Failed to create a shader while creating a program')
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.validateProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    console.error(`Failed to link WebGL program`)
    console.debug(gl.getProgramInfoLog(program))
    return null
  }

  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    gl.deleteProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    console.error(`Failed to validate WebGL program`)
    console.debug(gl.getProgramInfoLog(program))
    return null
  }

  const attributes: { [name: string]: number } = {}
  for (let i = 0; i < attributeNames.length; ++i) {
    const name = attributeNames[i]
    const attr = gl.getAttribLocation(program, name)
    if (attr === -1) {
      console.error(`Program attribute named "${name}" doesn't exist`)
      gl.deleteProgram(program)
      return null
    }
    attributes[name] = attr
  }

  const uniforms: { [name: string]: WebGLUniformLocation } = {}
  for (let i = 0; i < uniformNames.length; ++i) {
    const name = uniformNames[i]
    const uniform = gl.getUniformLocation(program, name)
    if (uniform === null) {
      console.error(`Program uniform named "${name}" doesn't exist`)
      gl.deleteProgram(program)
      return null
    }
    uniforms[name] = uniform
  }

  return {
    handle: program,
    attributes,
    uniforms
  }
}

export interface Program {
  handle: WebGLProgram
  attributes: { [name: string]: number }
  uniforms: { [name: string]: WebGLUniformLocation }
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }

  return false
}
