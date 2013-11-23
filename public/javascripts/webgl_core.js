/**
 * Created by Aibek on 11/2/13.
 */

$(document).ready(function () {
    init();
    animate(new Date().getTime());
});

    var renderer;
    var camera;
    var scene;
    var projector;

    var controls;
    var clock;

    var interactObjects = [];

    var cube;
    var floor;
    var light;

    var target;

    function init() {
        document.addEventListener('mousedown', onDocumentMouseDown, false);

        //##########################################################################
        //                           WebGL starts here!
        //##########################################################################

        // initializing renderer - used to display entire WebGL thing in the browser
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize($('#viewer').width(), $('#viewer').height());    // take up entire space
        renderer.shadowMapEnabled = true;                           // enable shadows

        $('#viewer').html(renderer.domElement);

        // initializing camera - used to show stuff
        camera = new THREE.PerspectiveCamera(60, $('#viewer').width() / $('#viewer').height(), 1, 10000);       // don't worry about parameters
        camera.position.set(0, 50, -200);
        target = new THREE.Vector3(0, 0, 0);
        camera.lookAt(target);

        scene = new THREE.Scene();
        projector = new THREE.Projector();
        interactObjectsobjects = new Array()

        initGeometry();
        initLights();

        THREEx.WindowResize(renderer, camera);

        // to freeze camera press Q, to move camera up R, to move camera down F
        controls = new THREE.FirstPersonControls(camera, target);
        controls.movementSpeed = 35;
        controls.activeLook = false;
        controls.lookSpeed = 0.3;
        clock = new THREE.Clock();
    }

    function initGeometry() {
        // just cube in the center, by default it is at 0,0,0 position
        cube = new THREE.Mesh(
            new THREE.CubeGeometry(25, 50, 100),
            new THREE.MeshLambertMaterial({color: 0x0000FF}));            // supply color of the cube
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
        interactObjects.push(cube);

        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 10, 10),
            new THREE.MeshLambertMaterial({color: 0xCEB2B3}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        scene.add(floor);
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 500, 0);
        light.intensity = 2.0;
        light.castShadow = true;
        scene.add(light);
    }

    function animate(t)
    {
        window.requestAnimationFrame(animate, renderer.domElement);
        render();
    }

    function render() {

        controls.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    document.onkeypress = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        if (key === 32)
            alert("You are clicking Space");
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();

        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(interactObjects);

        // if you clicked on something
        if (intersects.length > 0) {
            intersects[ 0 ].object.material.color.setHex(Math.random() * 0xffffff);
        }

        render();
    }

