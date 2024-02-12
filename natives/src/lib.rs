#![deny(clippy::all)]

mod glfw_ffi;

#[macro_use]
extern crate napi_derive;

extern crate gl;

use crate::glfw_ffi::{glfwCreateWindow, GLFWwindow};
use glfw_ffi::{glfwInit, glfwTerminate};
use napi::bindgen_prelude::*;
use napi::Ref;
use std::ffi::{c_char, c_int};
use std::ptr::null_mut;

#[napi]
fn joy_glfw_init() -> bool {
  unsafe {
    let res = glfwInit();

    glfw_ffi::glfwSetErrorCallback(Some(error_callback));

    res == GLFW_TRUE
  }
}

#[napi]
fn joy_glfw_terminate() {
  unsafe { glfwTerminate() }
}

#[napi]
fn joy_glfw_create_window(
  width: i32,
  height: i32,
  title: String,
) -> Option<External<*mut GLFWwindow>> {
  let ptr = unsafe {
    let title_c_str = std::ffi::CString::new(title).unwrap();
    glfwCreateWindow(
      width,
      height,
      title_c_str.into_raw(),
      null_mut(),
      null_mut(),
    )
  };
  if ptr.is_null() {
    None
  } else {
    unsafe { glfw_ffi::glfwSetWindowCloseCallback(ptr, Some(window_close_callback)) };
    Some(External::new(ptr))
  }
}

#[napi]
fn joy_glfw_swap_buffers(window: External<*mut GLFWwindow>) {
  unsafe { glfw_ffi::glfwSwapBuffers(*window.as_ref()) }
}

#[napi]
fn joy_glfw_poll_events() {
  unsafe { glfw_ffi::glfwPollEvents() }
}

#[napi]
fn joy_glfw_window_should_close(window: External<*mut GLFWwindow>) -> bool {
  unsafe { glfw_ffi::glfwWindowShouldClose(*window.as_ref()) == GLFW_TRUE }
}

#[napi]
fn joy_glfw_window_hint(hint: i32, value: i32) {
  unsafe { glfw_ffi::glfwWindowHint(hint, value) }
}

#[napi]
fn joy_glfw_set_window_visible(window: External<*mut GLFWwindow>, visible: bool) {
  if visible {
    unsafe { glfw_ffi::glfwShowWindow(*window.as_ref()) }
  } else {
    unsafe { glfw_ffi::glfwHideWindow(*window.as_ref()) }
  }
}

#[napi]
fn joy_glfw_set_window_size(window: External<*mut GLFWwindow>, width: i32, height: i32) {
  unsafe { glfw_ffi::glfwSetWindowSize(*window.as_ref(), width, height) }
}

#[napi]
fn joy_glfw_make_context_current(window: External<*mut GLFWwindow>) {
  unsafe {
    glfw_ffi::glfwMakeContextCurrent(*window.as_ref());
    gl::load_with(|symbol| {
      let cstr = std::ffi::CString::new(symbol).unwrap();
      glfw_ffi::glfwGetProcAddress(cstr.as_ptr())
    });
    gl::BlendFunc(gl::SRC_ALPHA, gl::ONE_MINUS_SRC_ALPHA);
    gl::Enable(gl::BLEND);
    gl::Enable(gl::DEPTH_TEST);
  }
}

#[napi]
pub const WINDOW_HINT_RESIZABLE: i32 = glfw_ffi::RESIZABLE;
#[napi]
pub const WINDOW_HINT_VISIBLE: i32 = glfw_ffi::VISIBLE;

#[napi]
pub const WINDOW_HINT_OPENGL_VERSION_MAJOR: i32 = glfw_ffi::CONTEXT_VERSION_MAJOR;

#[napi]
pub const WINDOW_HINT_OPENGL_VERSION_MINOR: i32 = glfw_ffi::CONTEXT_VERSION_MINOR;

#[napi]
pub const WINDOW_HINT_OPENGL_PROFILE: i32 = glfw_ffi::OPENGL_PROFILE;

#[napi]
pub const WINDOW_HINT_OPENGL_FORWARD_COMPAT: i32 = glfw_ffi::OPENGL_FORWARD_COMPAT;

#[napi]
pub const OPENGL_PROFILE_CORE: i32 = glfw_ffi::OPENGL_CORE_PROFILE;

#[napi]
pub const GLFW_TRUE: i32 = glfw_ffi::TRUE;
#[napi]
pub const GLFW_FALSE: i32 = glfw_ffi::FALSE;

#[napi]
fn joy_gl_clear_color(r: f64, g: f64, b: f64, a: f64) {
  unsafe { gl::ClearColor(r as f32, g as f32, b as f32, a as f32) }
}

#[napi]
fn joy_gl_clear(mask: u32) {
  unsafe { gl::Clear(mask) }
}

#[napi]
pub const GL_COLOR_BUFFER_BIT: u32 = gl::COLOR_BUFFER_BIT;

#[napi]
pub const GL_DEPTH_BUFFER_BIT: u32 = gl::DEPTH_BUFFER_BIT;

#[napi]
fn joy_gl_viewport(x: i32, y: i32, width: i32, height: i32) {
  unsafe { gl::Viewport(x, y, width, height) }
}

#[napi]
fn joy_glfw_get_framebuffer_size(window: External<*mut GLFWwindow>) -> Vec<i32> {
  let mut width = 0;
  let mut height = 0;
  unsafe { glfw_ffi::glfwGetFramebufferSize(*window.as_ref(), &mut width, &mut height) };
  vec![width, height]
}

static mut ERROR_CALLBACK: Option<Ref<()>> = None;
static mut ERROR_CALLBACK_ENV: Option<Env> = None;

#[no_mangle]
pub extern "C" fn error_callback(err: c_int, description: *const c_char) {
  unsafe {
    if let Some(ref callback) = ERROR_CALLBACK {
      let description = std::ffi::CStr::from_ptr(description)
        .to_str()
        .unwrap()
        .to_string();
      let func: JsFunction = ERROR_CALLBACK_ENV
        .unwrap()
        .get_reference_value(&callback)
        .unwrap();
      func
        .call2::<i32, String, ()>(err as i32, description)
        .unwrap();
    }
  }
}

#[napi(ts_args_type = "callback: (error: number, description: string) => void")]
fn joy_glfw_set_error_callback(env: Env, callback: JsFunction) {
  let reference = env.create_reference(callback).unwrap();
  unsafe {
    ERROR_CALLBACK = Some(reference);
    ERROR_CALLBACK_ENV = Some(env);
  }
}

#[napi(object)]
pub struct JoyU32Result {
  pub result: Option<u32>,
  pub error: Option<String>,
}

#[napi]
pub const SHADER_TYPE_VERTEX: u32 = gl::VERTEX_SHADER;

#[napi]
pub const SHADER_TYPE_FRAGMENT: u32 = gl::FRAGMENT_SHADER;

#[napi]
fn joy_gl_compile_shader(shader_source: String, shader_type: u32) -> JoyU32Result {
  let shader = unsafe { gl::CreateShader(shader_type) };

  unsafe {
    let cstr = std::ffi::CString::new(shader_source).unwrap();
    gl::ShaderSource(shader, 1, &(cstr.as_ptr()), std::ptr::null());
    gl::CompileShader(shader);

    let mut success = 0;
    gl::GetShaderiv(shader, gl::COMPILE_STATUS, &mut success);
    if success == gl::FALSE as i32 {
      let mut len = 0;
      gl::GetShaderiv(shader, gl::INFO_LOG_LENGTH, &mut len);
      let mut buf = Vec::with_capacity(len as usize);
      gl::GetShaderInfoLog(shader, len, std::ptr::null_mut(), buf.as_mut_ptr());
      buf.set_len(len as usize);
      let error =
        std::ffi::CString::from_vec_with_nul_unchecked(buf.into_iter().map(|c| c as u8).collect())
          .into_string()
          .unwrap();
      return JoyU32Result {
        result: None,
        error: Some(error),
      };
    }
  }

  JoyU32Result {
    result: Some(shader),
    error: None,
  }
}

#[napi]
fn joy_gl_create_program() -> u32 {
  unsafe { gl::CreateProgram() }
}

#[napi]
fn joy_gl_attach_shader(program: u32, shader: u32) {
  unsafe { gl::AttachShader(program, shader) }
}

#[napi]
fn joy_gl_link_program(program: u32) -> Option<String> {
  unsafe {
    gl::LinkProgram(program);
    let mut success = 0;
    gl::GetProgramiv(program, gl::LINK_STATUS, &mut success);
    if success == gl::FALSE as i32 {
      let mut len = 0;
      gl::GetProgramiv(program, gl::INFO_LOG_LENGTH, &mut len);
      let mut buf = Vec::with_capacity(len as usize);
      gl::GetProgramInfoLog(program, len, std::ptr::null_mut(), buf.as_mut_ptr());
      buf.set_len(len as usize);
      let error =
        std::ffi::CString::from_vec_with_nul_unchecked(buf.into_iter().map(|c| c as u8).collect())
          .into_string()
          .unwrap();
      return Some(error);
    }
  }
  None
}

#[napi]
fn joy_gl_use_program(program: u32) {
  unsafe { gl::UseProgram(program) }
}

#[napi]
fn joy_gl_delete_shader(shader: u32) {
  unsafe { gl::DeleteShader(shader) }
}

#[napi]
fn joy_gl_delete_program(program: u32) {
  unsafe { gl::DeleteProgram(program) }
}

#[napi]
fn joy_gl_gen_vertex_arrays() -> u32 {
  let mut vao = 0;
  unsafe { gl::GenVertexArrays(1, &mut vao) };
  vao
}

#[napi]
fn joy_gl_bind_vertex_array(vao: u32) {
  unsafe { gl::BindVertexArray(vao) }
}

#[napi]
fn joy_gl_gen_buffers() -> u32 {
  let mut vbo = 0;
  unsafe { gl::GenBuffers(1, &mut vbo) };
  vbo
}

#[napi]
fn joy_gl_bind_buffer(target: u32, buffer: u32) {
  unsafe { gl::BindBuffer(target, buffer) }
}

#[napi]
pub const BUFFER_TYPE_ARRAY_BUFFER: u32 = gl::ARRAY_BUFFER;

#[napi]
pub const BUFFER_TYPE_ELEMENT_ARRAY_BUFFER: u32 = gl::ELEMENT_ARRAY_BUFFER;

#[napi]
fn joy_gl_buffer_data_f32(target: u32, data: Vec<f64>, usage: u32) {
  let buff = data.iter().map(|f| *f as f32).collect::<Vec<f32>>();
  unsafe {
    gl::BufferData(
      target,
      (data.len() * std::mem::size_of::<f32>()) as isize,
      buff.as_ptr() as *const std::ffi::c_void,
      usage,
    )
  }
}

#[napi]
fn joy_gl_buffer_data_u32(target: u32, data: Vec<u32>, usage: u32) {
  unsafe {
    gl::BufferData(
      target,
      (data.len() * std::mem::size_of::<u32>()) as isize,
      data.as_ptr() as *const std::ffi::c_void,
      usage,
    )
  }
}

#[napi]
pub const BUFFER_USAGE_STATIC_DRAW: u32 = gl::STATIC_DRAW;

#[napi]
pub const BUFFER_USAGE_DYNAMIC_DRAW: u32 = gl::DYNAMIC_DRAW;

#[napi]
fn joy_gl_vertex_attrib_pointer(
  index: u32,
  size: i32,
  type_: u32,
  normalized: bool,
  stride: i32,
  offset: i32,
) {
  unsafe {
    gl::VertexAttribPointer(
      index,
      size,
      type_,
      normalized as u8,
      stride,
      offset as *const std::ffi::c_void,
    )
  }
}

#[napi]
pub const GL_FLOAT: u32 = gl::FLOAT;

#[napi]
fn joy_gl_enable_vertex_attrib_array(index: u32) {
  unsafe { gl::EnableVertexAttribArray(index) }
}

#[napi]
fn joy_gl_disable_vertex_attrib_array(index: u32) {
  unsafe { gl::DisableVertexAttribArray(index) }
}

#[napi]
fn joy_gl_draw_arrays(mode: u32, first: i32, count: i32) {
  unsafe { gl::DrawArrays(mode, first, count) }
}

#[napi]
pub const GL_TRIANGLES: u32 = gl::TRIANGLES;

#[napi]
pub const GL_UNSIGNED_INT: u32 = gl::UNSIGNED_INT;

#[napi]
fn joy_gl_draw_elements(mode: u32, count: i32, type_: u32, offset: i32) {
  unsafe { gl::DrawElements(mode, count, type_, offset as *const std::ffi::c_void) }
}

#[napi]
fn joy_gl_get_error() -> u32 {
  unsafe { gl::GetError() }
}

#[napi]
fn joy_load_texture(path: String, settings: JsFunction) -> JoyU32Result {
  let img = image::open(path.clone());
  if img.is_err() {
    return JoyU32Result {
      result: None,
      error: Some(format!("Failed to load image: {}", path)),
    };
  }
  let img = img.unwrap().into_rgba8();

  let mut texture = 0;
  unsafe {
    gl::GenTextures(1, &mut texture);
    gl::BindTexture(gl::TEXTURE_2D, texture);

    settings.call0::<()>().unwrap();

    gl::TexImage2D(
      gl::TEXTURE_2D,
      0,
      gl::RGBA as i32,
      img.width() as i32,
      img.height() as i32,
      0,
      gl::RGBA,
      gl::UNSIGNED_BYTE,
      img.as_ptr() as *const std::ffi::c_void,
    );
    gl::GenerateMipmap(gl::TEXTURE_2D);
  };

  JoyU32Result {
    result: Some(texture),
    error: None,
  }
}

#[napi]
fn joy_gl_bind_texture(texture: u32) {
  unsafe { gl::BindTexture(gl::TEXTURE_2D, texture) }
}

#[napi]
fn joy_gl_tex_parameteri(pname: u32, param: i32) {
  unsafe { gl::TexParameteri(gl::TEXTURE_2D, pname, param) }
}

#[napi]
pub const GL_TEXTURE_WRAP_S: u32 = gl::TEXTURE_WRAP_S;

#[napi]
pub const GL_TEXTURE_WRAP_T: u32 = gl::TEXTURE_WRAP_T;

#[napi]
pub const GL_TEXTURE_MIN_FILTER: u32 = gl::TEXTURE_MIN_FILTER;

#[napi]
pub const GL_TEXTURE_MAG_FILTER: u32 = gl::TEXTURE_MAG_FILTER;

#[napi]
pub const GL_REPEAT: u32 = gl::REPEAT;

#[napi]
pub const GL_NEAREST: u32 = gl::NEAREST;

#[napi]
pub const GL_LINEAR: u32 = gl::LINEAR;

#[napi]
fn joy_gl_delete_texture(texture: u32) {
  unsafe { gl::DeleteTextures(1, &texture) }
}

#[napi]
fn joy_gl_active_texture(texture: u32) {
  unsafe { gl::ActiveTexture(texture) }
}

#[napi]
pub const GL_TEXTURE0: u32 = gl::TEXTURE0;

#[napi]
fn joy_gl_get_uniform_location(program: u32, name: String) -> Option<i32> {
  let cstr = std::ffi::CString::new(name).unwrap();
  let location = unsafe { gl::GetUniformLocation(program, cstr.as_ptr()) };
  if location == -1 {
    None
  } else {
    Some(location)
  }
}

#[napi]
fn joy_gl_set_uniform_1i(location: i32, value: i32) {
  unsafe { gl::Uniform1i(location, value) }
}

#[napi]
fn joy_gl_set_uniform_1f(location: i32, value: f64) {
  unsafe { gl::Uniform1f(location, value as f32) }
}

#[napi]
fn joy_gl_set_uniform_2f(location: i32, x: f64, y: f64) {
  unsafe { gl::Uniform2f(location, x as f32, y as f32) }
}

#[napi]
fn joy_gl_set_uniform_3f(location: i32, x: f64, y: f64, z: f64) {
  unsafe { gl::Uniform3f(location, x as f32, y as f32, z as f32) }
}

#[napi]
fn joy_gl_set_uniform_4f(location: i32, x: f64, y: f64, z: f64, w: f64) {
  unsafe { gl::Uniform4f(location, x as f32, y as f32, z as f32, w as f32) }
}

#[napi]
fn joy_gl_set_uniform_matrix_4fv(location: i32, transpose: bool, value: Vec<f64>) {
  let value = value.iter().map(|f| *f as f32).collect::<Vec<f32>>();
  unsafe { gl::UniformMatrix4fv(location, 1, transpose as u8, value.as_ptr()) }
}

static mut WINDOW_CLOSE_CALLBACK: Option<Ref<()>> = None;
static mut WINDOW_CLOSE_CALLBACK_ENV: Option<Env> = None;

#[no_mangle]
pub extern "C" fn window_close_callback(_window: *mut GLFWwindow) {
  unsafe {
    if let Some(ref callback) = WINDOW_CLOSE_CALLBACK {
      let func: JsFunction = WINDOW_CLOSE_CALLBACK_ENV
        .unwrap()
        .get_reference_value(&callback)
        .unwrap();
      func.call0::<()>().unwrap();
    }
  }
}

#[napi(ts_args_type = "window: ExternalObject<any>, callback: () => void")]
fn joy_glfw_set_window_close_callback(
  env: Env,
  _window: External<*mut GLFWwindow>,
  callback: JsFunction,
) {
  let reference = env.create_reference(callback).unwrap();
  unsafe {
    WINDOW_CLOSE_CALLBACK = Some(reference);
    WINDOW_CLOSE_CALLBACK_ENV = Some(env);
  }
}

#[napi]
fn joy_glfw_get_time() -> f64 {
  unsafe { glfw_ffi::glfwGetTime() }
}

#[napi]
fn joy_glfw_set_time(time: f64) {
  unsafe { glfw_ffi::glfwSetTime(time) }
}

#[napi]
fn joy_glfw_destroy_window(window: External<*mut GLFWwindow>) {
  unsafe { glfw_ffi::glfwDestroyWindow(*window.as_ref()) }
}
