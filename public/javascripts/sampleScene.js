
/**
 * Created by Aibek on 11/24/13.
 */

var SAMPLE = new SAMPLE();
function SAMPLE() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var cube;
    var floor;
    var light;

    this.isLoaded = false;

    this.load = function ()
    {
        initGeometry();
        initLights();

        this.isLoaded = true;
    }

    this.unload = function ()
    {
        CORE.scene.remove(cube);
        CORE.scene.remove(floor);
        CORE.scene.remove(light);

        CORE.intersectObjects.splice(jQuery.inArray(cube), 1);
        CORE.intersectObjects.splice(jQuery.inArray(floor), 1);

        this.isLoaded = false;
    }

    this.onDocumentMouseDown = function(event){
        event.preventDefault();

        var object;
        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
        CORE.projector.unprojectVector(vector, CORE.camera);
        var raycaster = new THREE.Raycaster(CORE.camera.position, vector.sub(CORE.camera.position).normalize());
        var intersects = raycaster.intersectObjects(CORE.intersectObjects);

        // if you clicked on something
        if (intersects.length > 0) {
            object = intersects[ 0 ].object;
            object.material.color.setHex(Math.random() * 0xffffff);
        }
    }

    function initGeometry() {
        cube = new THREE.Mesh(
            new THREE.CubeGeometry(10, 10, 10),
            new THREE.MeshLambertMaterial({color: 0x0000FF}));            // supply color of the cube
        cube.position.set(0, 0, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;
        CORE.scene.add(cube);
        CORE.intersectObjects.push(cube);

        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 10, 10),
            new THREE.MeshLambertMaterial({color: 0xCEB2B3}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        CORE.scene.add(floor);
        CORE.intersectObjects.push(floor);
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 500, 0);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
    }
}

