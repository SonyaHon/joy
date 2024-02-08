import Joy, { GeometryData, Color, Transform, Vector3 } from '@joy/engine'

async function main() {
  let geometry: GeometryData
  let transform: Transform = new Transform(new Vector3(0, 0, 0))

  Joy.onInitialize(async () => {
    geometry = GeometryData.cube()

    Joy.setClearColor(Color.fromHex('#efefef'))
    Joy.camera3d.setPosition(new Vector3(0, 0, 10))
  })

  Joy.onUpdate(() => {
    // transform.rotate(Vector3.unit(Joy.time.deltaTime))
    // Joy.camera3d.translateZ(2 * Joy.time.deltaTime)
    Joy.camera3d.rotateY(1 * Joy.time.deltaTime)
  })

  Joy.onRender(() => {
    Joy.$internal$__getRenderer().renderGeometryData(
      geometry,
      Joy.shader.standard,
      transform
    )
  })

  await Joy.run()
}

main()
