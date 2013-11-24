/**
 * Created by Aibek on 11/24/13.
 */

var JUKEBOX = new JUKEBOX();

function JUKEBOX() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var radioBody, radioSeeker;
    var radioPlay;
    var radioVolume, radioPower;
    var radioNext, radioPrev;
    var radioReplay, radioShuffle;

    var isPlaying = false;

    var floor;
    var light;

    var elements = [];

    this.isLoaded = false;

    this.load = function ()
    {
        initGeometry();
        initLights();

        elements.push(radioBody);
        elements.push(radioSeeker);
        elements.push(radioPlay);
        elements.push(radioVolume);
        elements.push(radioPower);
        elements.push(radioNext);
        elements.push(radioPrev);
        elements.push(radioReplay);
        elements.push(radioShuffle);
        elements.push(floor);
        elements.push(light);

        this.isLoaded = true;
    }

    this.unload = function ()
    {
        elements.forEach(function(value){
//            CORE.scene.remove(value);
            CORE.intersectObjects.splice(jQuery.inArray(value, CORE.intersectObjects), 1);
        });

        CORE.scene.remove(radioBody);
        CORE.scene.remove(radioSeeker);
        CORE.scene.remove(radioPlay);
        CORE.scene.remove(radioVolume);
        CORE.scene.remove(radioPower);
        CORE.scene.remove(radioNext);
        CORE.scene.remove(radioPrev);
        CORE.scene.remove(radioReplay);
        CORE.scene.remove(radioShuffle);
        CORE.scene.remove(floor);
        CORE.scene.remove(light);

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
            if (object === radioPlay)
            {
                if (!isPlaying)
                    document.getElementById("audio").play();
                else
                    document.getElementById("audio").pause();
                isPlaying = !isPlaying;
            }
        }
    }

    function initGeometry() {
        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 10, 10),
            new THREE.MeshLambertMaterial({color: 0xCEB2B3}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        CORE.scene.add(floor);

        var loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioBody = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-body.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioPlay = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-button-play.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioPrev = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-button-prev.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioNext = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-button-next.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioReplay = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-button-replay.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioShuffle = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-button-shuffle.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioSeeker = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-seeker.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioVolume = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-volume.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) {  radioPower = loadModel( geometry, materials, 0, 0, 0 ) };
        loader.load( "obj/radio-power.js", callbackModel );
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 200, -50);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);

        var pointLight = new THREE.PointLight(0xff0000, 2, 200);
        pointLight.position.set(-60,0,-60);
        CORE.scene.add(pointLight);
    }

    function loadModel ( geometry, materials, x, y, z) {
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
        mesh.position.set( x, y, z );
        mesh.scale.set( 7, 7, 7 );
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.rotation.y = - Math.PI;
//        mesh.rotation.y = 0;
        CORE.scene.add( mesh );
        CORE.intersectObjects.push(mesh);
        return mesh;
    }
}
