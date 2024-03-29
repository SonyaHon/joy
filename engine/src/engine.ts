import {
    ExternalObject,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GLFW_FALSE,
    GLFW_TRUE,
    joyGlClear,
    joyGlClearColor,
    joyGlfwCreateWindow,
    joyGlfwDestroyWindow,
    joyGlfwGetTime,
    joyGlfwInit,
    joyGlfwMakeContextCurrent,
    joyGlfwPollEvents,
    joyGlfwSetCursorMode,
    joyGlfwSetCursorMoveCallback,
    joyGlfwSetErrorCallback,
    joyGlfwSetKeyCallback,
    joyGlfwSetTime,
    joyGlfwSetWindowCloseCallback,
    joyGlfwSetWindowSize,
    joyGlfwSetWindowVisible,
    joyGlfwSwapBuffers,
    joyGlfwTerminate,
    joyGlfwWindowHint,
    joyGlGetError,
    OPENGL_PROFILE_CORE,
    WINDOW_HINT_OPENGL_FORWARD_COMPAT,
    WINDOW_HINT_OPENGL_PROFILE,
    WINDOW_HINT_OPENGL_VERSION_MAJOR,
    WINDOW_HINT_OPENGL_VERSION_MINOR,
    WINDOW_HINT_VISIBLE,
} from '@joy/natives'
import {logger} from './logger'
import {LayerStack} from './layer'
import {Event, EventDispatcher, KeyboardEvent, WindowCloseEvent} from './events'
import {DeltaTime} from './delta-time'
import {Shader} from './shader'

import standardShader from './shaders/standard'
import {Renderer} from './renderer'
import {Color} from './color'
import {Matrix4f} from './math'
import {Camera3d} from './camera'
import {CursorMode, Input} from "./input";

export class JoyEngine {
    private _windowHandle: ExternalObject<any> | null = null
    private _windowWidth = 800
    private _windowHeight = 600

    private _isRunning = true
    private _layerStack = new LayerStack()
    private _dispatcher = new EventDispatcher()

    private _onInitializeCallback: () => void | Promise<void> = () => {
    }
    private _onTerminateCallback: () => void | Promise<void> = () => {
    }
    private _onUpdateCallback = () => {
    }
    private _onRenderCallback = () => {
    }

    public camera3d = new Camera3d()

    public time = new DeltaTime()
    public input = new Input()

    public shader = {
        standard: null as any,
    } as Record<string, Shader>

    constructor() {
        this._dispatcher.onEvent((event: Event) => {
            this._layerStack.cycleBackwards((layer, cmds) => {
                layer.onEvent(event)
                if (event.handled) {
                    cmds.break()
                }
            })

            if (event.is(WindowCloseEvent) && !event.handled) {
                this._isRunning = false
            }
        })
    }

    public onInitialize(callback: () => void | Promise<void>) {
        this._onInitializeCallback = callback
    }

    public onTerminate(callback: () => void | Promise<void>) {
        this._onTerminateCallback = callback
    }

    public onUpdate(callback: () => void) {
        this._onUpdateCallback = callback
    }

    public onRender(callback: () => void) {
        this._onRenderCallback = callback
    }

    public setClearColor(color: Color) {
        joyGlClearColor(color.red, color.green, color.blue, color.alpha)
    }

    public setWindowSize(width: number, height: number) {
        this._windowWidth = width
        this._windowHeight = height

        if (this._windowHandle) {
            joyGlfwSetWindowSize(this._windowHandle, width, height)
        }
    }

    public setWindowCursorMode(cursorMode: typeof CursorMode[keyof typeof CursorMode]) {
        joyGlfwSetCursorMode(this._windowHandle!, cursorMode)
    }

    private async _initialize() {
        if (!joyGlfwInit()) {
            logger.panic('Failed to initialize GLFW')
        }

        joyGlfwSetErrorCallback((error, description) => {
            logger.error('GLFW Error:', {error, description})
        })

        joyGlfwWindowHint(WINDOW_HINT_OPENGL_FORWARD_COMPAT, GLFW_TRUE)
        joyGlfwWindowHint(WINDOW_HINT_OPENGL_PROFILE, OPENGL_PROFILE_CORE)
        joyGlfwWindowHint(WINDOW_HINT_OPENGL_VERSION_MAJOR, 4)
        joyGlfwWindowHint(WINDOW_HINT_OPENGL_VERSION_MINOR, 1)
        joyGlfwWindowHint(WINDOW_HINT_VISIBLE, GLFW_FALSE)

        this._windowHandle = joyGlfwCreateWindow(
            this._windowWidth,
            this._windowHeight,
            'Joy'
        )
        if (this._windowHandle === null) {
            joyGlfwTerminate()
            logger.panic('Failed to create window')
        }

        joyGlfwMakeContextCurrent(this._windowHandle!)
        joyGlfwSetWindowCloseCallback(this._windowHandle!, () => {
            this._dispatcher.dispatch(new WindowCloseEvent())
        })
        joyGlfwSetKeyCallback(this._windowHandle!, (key, scancode, action, mods) => {
            this._dispatcher.dispatch(new KeyboardEvent(key, action, mods))
            this.input.glfwUpdateKeys(key, scancode, action, mods)
        })
        joyGlfwSetCursorMoveCallback(this._windowHandle!, (x, y) => {
            this.input.glfwUpdateMouse(x, y)
        })

        this.shader.standard = Shader.compile(standardShader)

        await this._onInitializeCallback()
    }

    private async _terminate() {
        await this._onTerminateCallback()

        Shader.$internal$__cleanup()

        joyGlfwDestroyWindow(this._windowHandle!)
        joyGlfwTerminate()
    }

    private _update() {
        this._layerStack.cycleForwards((layer) => {
            layer.onUpdate()
        })
    }

    private _render() {
        this._layerStack.cycleForwards((layer) => {
            layer.onRender()
        })
    }

    private _loop() {
        joyGlfwSetWindowVisible(this._windowHandle!, true)

        while (this._isRunning) {
            const glError = joyGlGetError()
            if (glError !== 0) {
                logger.error('OpenGL error', {code: glError})
            }

            this.time.$internal$__update(joyGlfwGetTime())
            joyGlfwSetTime(0)

            this._update()
            this._onUpdateCallback()

            joyGlClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
            this._render()
            this._onRenderCallback()

            this.input.postFrameUpdate()
            joyGlfwSwapBuffers(this._windowHandle!)
            joyGlfwPollEvents()
        }
    }

    public async run() {
        await this._initialize()
        this._loop()
        await this._terminate()
    }

    public $internal$__getRenderer() {
        const projectionMatrix = new Matrix4f().perspective(
            75.0,
            this._windowWidth / this._windowHeight,
            0.001,
            1000.0
        )
        return new Renderer(projectionMatrix, this.camera3d)
    }
}

export const Joy = new JoyEngine()
