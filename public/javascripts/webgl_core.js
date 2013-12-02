/**
 * Created by Aibek on 11/2/13.
 */
var CORE = new CORE();
var current_window; //the currently loaded window (SAMPLE, JUKEBOX, TV, etc.)
var windowListener;
var updateFcts;

$(document).ready(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    CORE.init();
    CORE.animate(new Date().getTime());

    /*$('#viewer').focusout(function(e){
       CORE.freezeCamera(true);
    });*/

//    $('#breadcrumb').css('display', 'none');

    $('#TV_play').click(function(e){
        if (TVObject)
            TVObject.playVideo();
    });

    $('#TV_pause').click(function(e){
        if (TVObject)
            TVObject.pauseVideo();
    });
});

function CORE() {
    var that = this;        // 'that' keeps reference to the CORE, since 'this' can change depending on the scope, i.e. animate()
    this.socket;

    this.renderer;
    this.camera;
    this.scene;
    this.projector;
    this.intersectObjects = [];
    this.lastTimeMsec = null;

    var camera_controls;
    var clock;
    var rendererStats;
    var stats;
    var cameraTarget;
    var interactObjects = [];

    var tempMesh;

    this.init = function() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);    // take up entire space
        this.renderer.shadowMapEnabled = true;                           // enable shadows                       // enable shadows

        $('#viewer').html(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);       // don't worry about parameters
        this.camera.position.set(-25, 25, -100);
        cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(cameraTarget);

        this.scene = new THREE.Scene();
        this.projector = new THREE.Projector();

        //windowListener = THREEx.WindowResize(this.renderer, this.camera);

        // display renderer stats
        rendererStats = new THREEx.RendererStats();
        rendererStats.domElement.style.position = 'absolute';
        rendererStats.domElement.style.left = '0px';
        rendererStats.domElement.style.top   = '80px';
        // document.getElementById('viewer').appendChild( rendererStats.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '30px';
        // document.getElementById('viewer').appendChild( stats.domElement );

        // to freeze camera press Q, to move camera up R, to move camera down F
        camera_controls = new THREE.FirstPersonControls(this.camera, cameraTarget);
        camera_controls.movementSpeed = 15;
        camera_controls.activeLook = false;
        camera_controls.lookSpeed = 0.1;
        clock = new THREE.Clock();

        // attaching microcache to the renderer
        this.renderer._microCache = new MicroCache();

        // setting and loading the current window
        current_window = SAMPLE;
        current_window.load();
        document.addEventListener('mousedown', current_window.onDocumentMouseDown, false);
        // update the camera
        //windowListener.trigger();
        updateFcts = [];
    }

    this.loadModel = function ( geometry, materials, x, y, z, clickable) {
        tempMesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
        tempMesh.position.set( x, y, z );
        tempMesh.scale.set( 0.5, 0.5, 0.5 );
        tempMesh.receiveShadow = true;
        tempMesh.castShadow = true;
        tempMesh.rotation.y = - Math.PI;

        this.scene.add( tempMesh );
        if (clickable)
            this.intersectObjects.push(tempMesh);

        return tempMesh;
    }

    this.animate = function(nowMsec){
        requestAnimationFrame(that.animate, that.renderer.domElement);
        camera_controls.update(clock.getDelta());
        that.renderer.render(that.scene, that.camera);
        rendererStats.update(that.renderer);
        stats.update();
        if (TVObject.isLoaded){
            TVObject.renderVideo();
        }else if (JUKEBOX.isLoaded){
            JUKEBOX.update();
        }

        // measure time
        that.lastTimeMsec	= that.lastTimeMsec || nowMsec-1000/60;
        var deltaMsec	= Math.min(200, nowMsec - that.lastTimeMsec);
        that.lastTimeMsec	= nowMsec;
        // call each update function
        updateFcts.forEach(function(updateFn){
            updateFn(deltaMsec/1000, nowMsec/1000);
        });
    }

    document.onkeypress = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        if (key === 109 && !EMPTY.isLoaded)                     // press M to go to EMPTY
        {
            unloadCurrent();
            EMPTY.load();
            document.addEventListener('mousedown', EMPTY.onDocumentMouseDown, false);
            current_window = EMPTY;
        }
        if (key === 98 && !SAMPLE.isLoaded)                     // press B to go to SAMPLE
        {
            unloadCurrent();
            SAMPLE.load();
            document.addEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
            current_window = SAMPLE;
        }
        if (key === 32 && !JUKEBOX.isLoaded)                      // press Space to go to JUKEBOX
        {
            unloadCurrent();
            JUKEBOX.load();
            document.addEventListener('mousedown', JUKEBOX.onDocumentMouseDown, false);
            current_window = JUKEBOX;
        }
        if (key === 115 && !ROOM.isLoaded)                         // press V to go to ROOM
        {
            unloadCurrent();
            ROOM.load();
            document.addEventListener('mousedown', ROOM.onDocumentMouseDown, false);
            camera_controls.movementSpeed = 50;
            current_window = ROOM;
        }
        if (key === 110 && !BOOK.isLoaded)                      // press N to go to BOOK
        {
            unloadCurrent();
            BOOK.load();
            document.addEventListener('mousedown', BOOK.onDocumentMouseDown, false);
            current_window = BOOK;
        }
        if (key === 118 && !ALBUM.isLoaded)                      // press ?? to go to ALBUM
        {
            unloadCurrent();
            ALBUM.load();
            document.addEventListener('mousedown', ALBUM.onDocumentMouseDown, false);
            current_window = ALBUM;
        }
        if (key === 116 && !TVObject.isLoaded)                     // press T to go to TV
        {
            unloadCurrent();
            TVObject.load();
            document.addEventListener('mousedown', TVObject.onDocumentMouseDown, false);
            document.addEventListener('keydown', TVObject.flyToObject, false);
            current_window = TVObject;
        }
    }

    function unloadCurrent()
    {
        if (current_window){
            if (current_window === TVObject)
                document.removeEventListener('keydown', TVObject.flyToObject, false);
            current_window.unload();
            document.removeEventListener('mousedown', current_window.onDocumentMouseDown, false);
        }
    }

    this.disposeSceneElements = function(modelElements) {
        modelElements.forEach(function(element){
            CORE.intersectObjects.splice(jQuery.inArray(element, CORE.intersectObjects), 1);
            CORE.scene.remove(element);
            if (element.geometry) {
                delete element.geometry.geometryGroups;
                $.each(element.geometry.geometryGroupsList, function (idx, elem) {
                    delete elem;
                });
                element.geometry.geometryGroupsList = [];
                element.geometry.dispose();
            }
            if (element.material) {
                if (element.material instanceof THREE.MeshFaceMaterial) {
                    $.each(element.material.materials, function(idx, elem) {
                        elem.dispose();
                    });
                } else {
                    element.material.dispose();
                }

                if (element.material.map) {
                    element.material.map.dispose();
                }
            }
            if (element.dispose) {
                element.dispose();
            }
        });

        modelElements = [];
        updateFcts = [];
        $('#TV_options').hide();
    }

    this.freezeCamera = function(bFreeze){
        camera_controls.freeze = bFreeze;
    }


}