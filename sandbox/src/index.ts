import Joy, {Color, GameObject, GeometryData, logger, Material, Mesh, Vector3,} from '@joy/engine'

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

        Joy.camera3d.setPosition(new Vector3(20, 20, 20)).lookAt(Vector3.zero())
    })

    Joy.onUpdate(() => {
        cubes.forEach((cube) => {
            cube.transform
                .rotate(Vector3.unit(Joy.time.deltaTime * 20))
                // .setPosition(
                //     new Vector3(
                //         Math.sin(
                //             Joy.time.elapsedTotal + cube.transform.position.x
                //         ),
                //         cube.transform.position.y,
                //         Math.cos(
                //             Joy.time.elapsedTotal + cube.transform.position.z
                //         )
                //     )
                // )
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
