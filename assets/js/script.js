function main() {
    console.log('main is called')
    const canvas = document.querySelector('#object_loader');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight; // the canvas default
    const near = 1;
    const far = 400;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 400);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // {
    //     const planeSize = 500;

    //     // const loader = new THREE.TextureLoader();
    //     // const texture = loader.load('./assets/models/texture0000.png');
    //     // texture.wrapS = THREE.RepeatWrapping;
    //     // texture.wrapT = THREE.RepeatWrapping;
    //     // texture.magFilter = THREE.NearestFilter;
    //     // const repeats = planeSize / 2;
    //     // texture.repeat.set(repeats, repeats);

    //     const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    //     const planeMat = new THREE.MeshPhongMaterial({
    //         // map: texture,
    //         side: THREE.DoubleSide,
    //     });
    //     const mesh = new THREE.Mesh(planeGeo, planeMat);
    //     mesh.rotation.x = Math.PI * -.5;
    //     scene.add(mesh);
    // }

    {
        const skyColor = 0xB1E1FF; // light blue
        const groundColor = 0xB97A20; // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    // {
    //     const color = 0xFFFFFF;
    //     const intensity = 1;
    //     const light = new THREE.DirectionalLight(color, intensity);
    //     light.position.set(5, 10, 2);
    //     scene.add(light);
    //     scene.add(light.target);
    // }

    {
        const objLoader = new THREE.OBJLoader2();
        objLoader.loadMtl('./assets/models/geomodel.mtl', null, (materials) => {
            objLoader.setMaterials(materials);
            // console.log(objLoader);
            objLoader.load('./assets/models/geomodel.obj', (object) => {
                const root = object.detail.loaderRootNode;
                root.traverse(function(child) {
                    // console.log(child);
                    if (child instanceof THREE.Mesh) {
                        var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                        var faces = geometry.faces;
                        var vertices = geometry.vertices;
                        var materials = child.materials;

                        console.log(child);
                        // for (i = 0; i < faces.length; i++) {
                        // geometry.faces[i].color.setHex(Math.random() * 0xffffff);
                        // console.log(faces[i]);
                        // geometry.faces[i].color.setHex(Math.random() * 0xffffff);
                        // }
                    }
                });
                scene.add(root);
            });
        });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
main();