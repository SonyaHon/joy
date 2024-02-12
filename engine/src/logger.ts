export class JoyLogger {
  trace(message: string, data?: Record<string, any> | Error) {
    console.trace(message, data)
  }

  debug(message: string, data?: Record<string, any> | Error) {
    console.debug(message, data)
  }

  error(message: string, data?: Record<string, any> | Error) {
    console.error(message, data)
  }

  panic(message: string, data?: Record<string, any> | Error) {
    console.error(message, data)
    process.exit(1)
  }
}

export const logger = new JoyLogger()
