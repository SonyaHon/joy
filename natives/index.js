/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */

/* auto-generated by NAPI-RS */

const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim()
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'natives.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.android-arm64.node')
          } else {
            nativeBinding = require('@joy/natives-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'natives.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.android-arm-eabi.node')
          } else {
            nativeBinding = require('@joy/natives-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'natives.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@joy/natives-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'natives.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@joy/natives-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'natives.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@joy/natives-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'natives.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./natives.darwin-universal.node')
      } else {
        nativeBinding = require('@joy/natives-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'natives.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.darwin-x64.node')
          } else {
            nativeBinding = require('@joy/natives-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'natives.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.darwin-arm64.node')
          } else {
            nativeBinding = require('@joy/natives-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'natives.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./natives.freebsd-x64.node')
      } else {
        nativeBinding = require('@joy/natives-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'natives.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./natives.linux-x64-musl.node')
            } else {
              nativeBinding = require('@joy/natives-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'natives.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./natives.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@joy/natives-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'natives.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./natives.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@joy/natives-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'natives.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./natives.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@joy/natives-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'natives.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@joy/natives-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'riscv64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'natives.linux-riscv64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./natives.linux-riscv64-musl.node')
            } else {
              nativeBinding = require('@joy/natives-linux-riscv64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'natives.linux-riscv64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./natives.linux-riscv64-gnu.node')
            } else {
              nativeBinding = require('@joy/natives-linux-riscv64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 's390x':
        localFileExisted = existsSync(
          join(__dirname, 'natives.linux-s390x-gnu.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./natives.linux-s390x-gnu.node')
          } else {
            nativeBinding = require('@joy/natives-linux-s390x-gnu')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { joyGlfwInit, joyGlfwTerminate, joyGlfwCreateWindow, joyGlfwSwapBuffers, joyGlfwPollEvents, joyGlfwWindowShouldClose, joyGlfwWindowHint, joyGlfwSetWindowVisible, joyGlfwSetWindowSize, joyGlfwMakeContextCurrent, WINDOW_HINT_RESIZABLE, WINDOW_HINT_VISIBLE, WINDOW_HINT_OPENGL_VERSION_MAJOR, WINDOW_HINT_OPENGL_VERSION_MINOR, WINDOW_HINT_OPENGL_PROFILE, WINDOW_HINT_OPENGL_FORWARD_COMPAT, OPENGL_PROFILE_CORE, GLFW_TRUE, GLFW_FALSE, joyGlClearColor, joyGlClear, GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, joyGlViewport, joyGlfwGetFramebufferSize, joyGlfwSetErrorCallback, SHADER_TYPE_VERTEX, SHADER_TYPE_FRAGMENT, joyGlCompileShader, joyGlCreateProgram, joyGlAttachShader, joyGlLinkProgram, joyGlUseProgram, joyGlDeleteShader, joyGlDeleteProgram, joyGlGenVertexArrays, joyGlBindVertexArray, joyGlGenBuffers, joyGlBindBuffer, BUFFER_TYPE_ARRAY_BUFFER, BUFFER_TYPE_ELEMENT_ARRAY_BUFFER, joyGlBufferDataF32, joyGlBufferDataU32, BUFFER_USAGE_STATIC_DRAW, BUFFER_USAGE_DYNAMIC_DRAW, joyGlVertexAttribPointer, GL_FLOAT, joyGlEnableVertexAttribArray, joyGlDisableVertexAttribArray, joyGlDrawArrays, GL_TRIANGLES, GL_UNSIGNED_INT, joyGlDrawElements, joyGlGetError, joyLoadTexture, joyGlBindTexture, joyGlTexParameteri, GL_TEXTURE_WRAP_S, GL_TEXTURE_WRAP_T, GL_TEXTURE_MIN_FILTER, GL_TEXTURE_MAG_FILTER, GL_REPEAT, GL_NEAREST, GL_LINEAR, joyGlDeleteTexture, joyGlActiveTexture, GL_TEXTURE0, joyGlGetUniformLocation, joyGlSetUniform1I, joyGlSetUniform1F, joyGlSetUniform2F, joyGlSetUniform3F, joyGlSetUniform4F, joyGlSetUniformMatrix4Fv, joyGlfwSetWindowCloseCallback, joyGlfwGetTime, joyGlfwSetTime, joyGlfwDestroyWindow } = nativeBinding

module.exports.joyGlfwInit = joyGlfwInit
module.exports.joyGlfwTerminate = joyGlfwTerminate
module.exports.joyGlfwCreateWindow = joyGlfwCreateWindow
module.exports.joyGlfwSwapBuffers = joyGlfwSwapBuffers
module.exports.joyGlfwPollEvents = joyGlfwPollEvents
module.exports.joyGlfwWindowShouldClose = joyGlfwWindowShouldClose
module.exports.joyGlfwWindowHint = joyGlfwWindowHint
module.exports.joyGlfwSetWindowVisible = joyGlfwSetWindowVisible
module.exports.joyGlfwSetWindowSize = joyGlfwSetWindowSize
module.exports.joyGlfwMakeContextCurrent = joyGlfwMakeContextCurrent
module.exports.WINDOW_HINT_RESIZABLE = WINDOW_HINT_RESIZABLE
module.exports.WINDOW_HINT_VISIBLE = WINDOW_HINT_VISIBLE
module.exports.WINDOW_HINT_OPENGL_VERSION_MAJOR = WINDOW_HINT_OPENGL_VERSION_MAJOR
module.exports.WINDOW_HINT_OPENGL_VERSION_MINOR = WINDOW_HINT_OPENGL_VERSION_MINOR
module.exports.WINDOW_HINT_OPENGL_PROFILE = WINDOW_HINT_OPENGL_PROFILE
module.exports.WINDOW_HINT_OPENGL_FORWARD_COMPAT = WINDOW_HINT_OPENGL_FORWARD_COMPAT
module.exports.OPENGL_PROFILE_CORE = OPENGL_PROFILE_CORE
module.exports.GLFW_TRUE = GLFW_TRUE
module.exports.GLFW_FALSE = GLFW_FALSE
module.exports.joyGlClearColor = joyGlClearColor
module.exports.joyGlClear = joyGlClear
module.exports.GL_COLOR_BUFFER_BIT = GL_COLOR_BUFFER_BIT
module.exports.GL_DEPTH_BUFFER_BIT = GL_DEPTH_BUFFER_BIT
module.exports.joyGlViewport = joyGlViewport
module.exports.joyGlfwGetFramebufferSize = joyGlfwGetFramebufferSize
module.exports.joyGlfwSetErrorCallback = joyGlfwSetErrorCallback
module.exports.SHADER_TYPE_VERTEX = SHADER_TYPE_VERTEX
module.exports.SHADER_TYPE_FRAGMENT = SHADER_TYPE_FRAGMENT
module.exports.joyGlCompileShader = joyGlCompileShader
module.exports.joyGlCreateProgram = joyGlCreateProgram
module.exports.joyGlAttachShader = joyGlAttachShader
module.exports.joyGlLinkProgram = joyGlLinkProgram
module.exports.joyGlUseProgram = joyGlUseProgram
module.exports.joyGlDeleteShader = joyGlDeleteShader
module.exports.joyGlDeleteProgram = joyGlDeleteProgram
module.exports.joyGlGenVertexArrays = joyGlGenVertexArrays
module.exports.joyGlBindVertexArray = joyGlBindVertexArray
module.exports.joyGlGenBuffers = joyGlGenBuffers
module.exports.joyGlBindBuffer = joyGlBindBuffer
module.exports.BUFFER_TYPE_ARRAY_BUFFER = BUFFER_TYPE_ARRAY_BUFFER
module.exports.BUFFER_TYPE_ELEMENT_ARRAY_BUFFER = BUFFER_TYPE_ELEMENT_ARRAY_BUFFER
module.exports.joyGlBufferDataF32 = joyGlBufferDataF32
module.exports.joyGlBufferDataU32 = joyGlBufferDataU32
module.exports.BUFFER_USAGE_STATIC_DRAW = BUFFER_USAGE_STATIC_DRAW
module.exports.BUFFER_USAGE_DYNAMIC_DRAW = BUFFER_USAGE_DYNAMIC_DRAW
module.exports.joyGlVertexAttribPointer = joyGlVertexAttribPointer
module.exports.GL_FLOAT = GL_FLOAT
module.exports.joyGlEnableVertexAttribArray = joyGlEnableVertexAttribArray
module.exports.joyGlDisableVertexAttribArray = joyGlDisableVertexAttribArray
module.exports.joyGlDrawArrays = joyGlDrawArrays
module.exports.GL_TRIANGLES = GL_TRIANGLES
module.exports.GL_UNSIGNED_INT = GL_UNSIGNED_INT
module.exports.joyGlDrawElements = joyGlDrawElements
module.exports.joyGlGetError = joyGlGetError
module.exports.joyLoadTexture = joyLoadTexture
module.exports.joyGlBindTexture = joyGlBindTexture
module.exports.joyGlTexParameteri = joyGlTexParameteri
module.exports.GL_TEXTURE_WRAP_S = GL_TEXTURE_WRAP_S
module.exports.GL_TEXTURE_WRAP_T = GL_TEXTURE_WRAP_T
module.exports.GL_TEXTURE_MIN_FILTER = GL_TEXTURE_MIN_FILTER
module.exports.GL_TEXTURE_MAG_FILTER = GL_TEXTURE_MAG_FILTER
module.exports.GL_REPEAT = GL_REPEAT
module.exports.GL_NEAREST = GL_NEAREST
module.exports.GL_LINEAR = GL_LINEAR
module.exports.joyGlDeleteTexture = joyGlDeleteTexture
module.exports.joyGlActiveTexture = joyGlActiveTexture
module.exports.GL_TEXTURE0 = GL_TEXTURE0
module.exports.joyGlGetUniformLocation = joyGlGetUniformLocation
module.exports.joyGlSetUniform1I = joyGlSetUniform1I
module.exports.joyGlSetUniform1F = joyGlSetUniform1F
module.exports.joyGlSetUniform2F = joyGlSetUniform2F
module.exports.joyGlSetUniform3F = joyGlSetUniform3F
module.exports.joyGlSetUniform4F = joyGlSetUniform4F
module.exports.joyGlSetUniformMatrix4Fv = joyGlSetUniformMatrix4Fv
module.exports.joyGlfwSetWindowCloseCallback = joyGlfwSetWindowCloseCallback
module.exports.joyGlfwGetTime = joyGlfwGetTime
module.exports.joyGlfwSetTime = joyGlfwSetTime
module.exports.joyGlfwDestroyWindow = joyGlfwDestroyWindow