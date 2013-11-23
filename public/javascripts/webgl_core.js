/**
 * Created by Aibek on 11/2/13.
 */

$(document).ready(function () {
    init();
    render();
});

    var renderer;
    var camera;
    var scene;
    var projector;

    var interactObjects = [];

    var cube;
    var floor;
    var light;


// used when resizing windows and moving mouse, i.e. rotating camera
    var windowHalfX, windowHalfY;
    var mouseX, mouseY;

    var target;

    function init() {
        windowHalfX = $('#viewer').width() / 2;
        windowHalfY =  $('#viewer').height() / 2;

        // initialize mouseX and mouseY
        mouseX = 0;
        mouseY = 0;

        // add mouse move listener (remember we heard about it in class?)
        document.addEventListener('mousemove', onDocumentMouseMove, false);
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
        camera.position.set(0, 300, 100);
        target = new THREE.Vector3(0, 0, 0);

        // finally initializing scene - you'll be adding stuff to it
        scene = new THREE.Scene();

        // projector is used for tracing where you click
        projector = new THREE.Projector();

        // initializing array for objects being clicked
        interactObjectsobjects = new Array()

        // initializing every part of the WebGL - initGUI is optional (that's another library)
        initGeometry();
        initLights();

        THREEx.WindowResize(renderer, camera);
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

// knowing where the center is, and some other non-important stuff
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;
    }

    function zoomInCamera() {
        if (camera.position.distanceTo(target) > 60) {
            var offset = new THREE.Vector3(0, 0, 0);
            var dist = camera.position.distanceTo(target);
            offset.add(camera.position);
            offset.x += (target.x - camera.position.x) / (dist / 10);
            offset.y += (target.y - camera.position.y) / (dist / 10);
            offset.z += (target.z - camera.position.z) / (dist / 10);
            camera.position = offset;
            render();
        }
    }

    function zoomOutCamera() {
        var offset = new THREE.Vector3(0, 0, 0);
        var dist = camera.position.distanceTo(target);
        offset.add(camera.position);
        offset.x -= (target.x - camera.position.x) / (dist / 10);
        offset.y -= (target.y - camera.position.y) / (dist / 10);
        offset.z -= (target.z - camera.position.z) / (dist / 10);
        camera.position.set(offset.x, offset.y, offset.z);
        render();
    }

// used to show stuff, also updates the camera
    function render() {
        camera.lookAt(target);
        renderer.render(scene, camera);
    }

    function rotateCameraLeft() {
        var offset = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 100);
        offset.add(camera.position);

        target = offset;
        camera.lookAt(target);
        render();
    }

    function rotateCameraRight() {
        var offset = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 100);
        offset.add(camera.position);

        target = offset;
        camera.lookAt(target);
        render();
    }

    function rotateCameraUp() {
        var offset = new THREE.Vector3(0, 0, 0);
        var rotationAxis = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        rotationAxis.crossVectors(offset, new THREE.Vector3(0, 1, 0)).normalize();
        offset.applyAxisAngle(rotationAxis, Math.PI / 72);
        offset.add(camera.position);

        target = offset;

        camera.lookAt(target);
        render();
    }

    function rotateCameraDown() {
        var offset = new THREE.Vector3(0, 0, 0);
        var rotationAxis = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        rotationAxis.crossVectors(offset, new THREE.Vector3(0, 1, 0)).normalize();
        offset.applyAxisAngle(rotationAxis, -Math.PI / 72);
        offset.add(camera.position);

        target = offset;
        camera.lookAt(target);
        render();
    }

    document.onkeypress = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        var s = String.fromCharCode(key);
        if (s == 'w')
            zoomInCamera();
        else if (s == 's')
            zoomOutCamera();
        else if (s == 'a')
            rotateCameraLeft();
        else if (s == 'd')
            rotateCameraRight();
    }

    document.onkeydown = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        if (key == 38)
            rotateCameraUp();
        else if (key == 40)
            rotateCameraDown();
        else if (key == 37)
            rotateCameraLeft();
        else if (key == 39)
            rotateCameraRight();
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

