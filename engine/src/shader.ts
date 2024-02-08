import {
  SHADER_TYPE_FRAGMENT,
  SHADER_TYPE_VERTEX,
  joyGlAttachShader,
  joyGlCompileShader,
  joyGlCreateProgram,
  joyGlDeleteProgram,
  joyGlDeleteShader,
  joyGlGetUniformLocation,
  joyGlLinkProgram,
  joyGlSetUniform1F,
  joyGlSetUniform1I,
  joyGlSetUniform2F,
  joyGlSetUniform3F,
  joyGlSetUniform4F,
  joyGlSetUniformMatrix4Fv,
  joyGlUseProgram,
} from '@joy/natives'
import { logger } from './logger'
import { Matrix4x4f, Vector2, Vector3, Vector4 } from './math'

export interface ShaderSource {
  vertex: string
  fragment: string
}

export class Shader {
  private static allocated = {
    shaders: [] as number[],
    programs: [] as number[],
  }

  private uniformLocationCache: Record<string, number> = {}

  private static compileShader(type: number, source: string) {
    const shader = joyGlCompileShader(source, type)
    if (shader.error) {
      logger.error(shader.error)
      return 0
    }

    Shader.allocated.shaders.push(shader.result!)
    return shader.result!
  }

  static $internal$__cleanup() {
    Shader.allocated.shaders.forEach(joyGlDeleteShader)
    Shader.allocated.programs.forEach(joyGlDeleteProgram)
  }

  static compile(shaderSource: ShaderSource) {
    const vertex = Shader.compileShader(SHADER_TYPE_VERTEX, shaderSource.vertex)
    const fragment = Shader.compileShader(
      SHADER_TYPE_FRAGMENT,
      shaderSource.fragment
    )

    const program = joyGlCreateProgram()
    joyGlAttachShader(program, vertex)
    joyGlAttachShader(program, fragment)

    const linkError = joyGlLinkProgram(program)
    if (linkError) {
      logger.error(linkError)
      return new Shader(0)
    }
    this.allocated.programs.push(program)

    return new Shader(program)
  }

  constructor(private readonly program: number) {}

  use() {
    joyGlUseProgram(this.program)
  }

  private getUniformLocation(name: string) {
    if (this.uniformLocationCache[name]) {
      return this.uniformLocationCache[name]
    }

    const loc = joyGlGetUniformLocation(this.program, name)
    if (loc === null) {
      logger.error(`Failed to get uniform location`, { name })
      return -1
    }

    this.uniformLocationCache[name] = loc
    return loc
  }

  public setUniform(name: string) {
    const loc = this.getUniformLocation(name)
    return {
      int(value: number) {
        joyGlSetUniform1I(loc, value)
      },
      bool(value: boolean) {
        joyGlSetUniform1I(loc, value ? 1 : 0)
      },
      float(value: number) {
        joyGlSetUniform1F(loc, value)
      },
      vector2(value: Vector2) {
        joyGlSetUniform2F(loc, value.x, value.y)
      },
      vector3(value: Vector3) {
        joyGlSetUniform3F(loc, value.x, value.y, value.z)
      },
      vector4(value: Vector4) {
        joyGlSetUniform4F(loc, value.x, value.y, value.z, value.w)
      },
      matrix4x4(value: Matrix4x4f) {
        joyGlSetUniformMatrix4Fv(loc, false, value.raw())
      },
    }
  }
}
