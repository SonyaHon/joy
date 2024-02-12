import Joy, {
  GeometryData,
  Color,
  Transform,
  Vector3,
  logger,
  GameObject,
  Material,
  Mesh,
} from '@joy/engine'

async function main() {
  let cubes: GameObject[] = new Array(3)

  Joy.onInitialize(async () => {
    Joy.setClearColor(Color.fromHex('#efefef'))

    for (let i = 0; i < 3; i++) {
      cubes[i] = new GameObject()
      cubes[i].addComponent(
        new Material(Joy.shader.standard, {
          solidColor: Color.fromHex('#0055ff'),
        })
      )
      cubes[i].addComponent(new Mesh(GeometryData.cube()))
      cubes[i].transform.setPosition(new Vector3(0, 0, i * 4))
    }

    Joy.camera3d.setPosition(new Vector3(0, 20, 20)).lookAt(Vector3.zero())

  })

  Joy.onUpdate(() => {
  })

  Joy.onRender(() => {
    const renderer = Joy.$internal$__getRenderer()
    cubes.forEach((cube) => renderer.renderGameObject(cube))
  })

  await Joy.run()
}

main()
