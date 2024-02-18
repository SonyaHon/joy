import Joy, {Color, CursorMode, GameObject, GeometryData, logger, Material, Mesh, Vector3,} from '@joy/engine'

const colors = [
    "#0055ff",
    "#ff0055",
    "#55ff00",
];

async function main() {
    let cubes: GameObject[] = new Array(3)

    Joy.onInitialize(async () => {
        Joy.setClearColor(Color.fromHex('#e2e2e2'))

        for (let i = 0; i < 3; i++) {
            cubes[i] = new GameObject()
            cubes[i].addComponent(
                new Material(Joy.shader.standard, {
                    solidColor: Color.fromHex(colors[i]),
                })
            )
            cubes[i].addComponent(new Mesh(GeometryData.cube()))
            cubes[i].transform.setPosition(new Vector3(0, -4 + i * 4, 0))
        }

        Joy.setWindowCursorMode(CursorMode.Disabled)
        Joy.camera3d.setPosition(new Vector3(0, 0, 50)).lookAt(Vector3.zero())
    })

    Joy.onUpdate(() => {
        // camera updates
        const mouseDelta = Joy.input.getMouseDelta()
        Joy.camera3d.rotate(new Vector3(mouseDelta.y, mouseDelta.x, 0).scale(0.1))

        // cubes updates
        cubes.forEach((cube) => {
            cube.transform
                .rotate(Vector3.unit(Joy.time.deltaTime * 20))
        })
    })

    Joy.onRender(() => {
        const renderer = Joy.$internal$__getRenderer()
        cubes.forEach((cube) => renderer.renderGameObject(cube))
    })

    await Joy.run()
}

main().catch(error => {
    logger.panic('Uncaught exception', error)
})
