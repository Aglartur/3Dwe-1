/**
 * Created by Aibek on 11/2/13.
 */

var CORE = new CORE();
var current_window; //the currently loaded window (SAMPLE, JUKBOX, TV, etc.)

$(document).ready(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    CORE.init();
    CORE.animate(new Date().getTime());

//    $('#breadcrumb').css('display', 'none');
});

function CORE() {
    var that = this;        // 'that' keeps reference to the CORE, since 'this' can change depending on the scope, i.e. animate()
    this.socket;

    this.renderer;
    this.camera;
    this.scene;
    this.projector;
    this.intersectObjects =[];

    var controls;
    var clock;
    var cameraTarget;

    var interactObjects = [];

    this.init = function() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize($('#viewer').width(), $('#viewer').height());    // take up entire space
        this.renderer.shadowMapEnabled = true;                           // enable shadows

        $('#viewer').html(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, $('#viewer').width() / $('#viewer').height(), 1, 10000);       // don't worry about parameters
        this.camera.position.set(-25, 25, -100);
        cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(cameraTarget);

        this.scene = new THREE.Scene();
        this.projector = new THREE.Projector();

        THREEx.WindowResize(this.renderer, this.camera);

        // to freeze camera press Q, to move camera up R, to move camera down F
        controls = new THREE.FirstPersonControls(this.camera, cameraTarget);
        controls.movementSpeed = 15;
        controls.activeLook = false;
        controls.lookSpeed = 0.1;
        clock = new THREE.Clock();

        SAMPLE.load();
        current_window = SAMPLE;
        document.addEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
    }

    this.loadModel = function ( geometry, materials, x, y, z, clickable) {
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
        mesh.position.set( x, y, z );
        mesh.scale.set( 0.5, 0.5, 0.5 );
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.rotation.y = - Math.PI;
//        mesh.rotation.y = - Math.PI * 3 / 4;

        this.scene.add( mesh );
        if (clickable)
            this.intersectObjects.push(mesh);
        return mesh;
    }

    // Notice we use 'that' instead of 'this', because next time we call this.animate we want to keep old reference 'this'
    this.animate = function(t)
    {
        requestAnimationFrame(that.animate, that.renderer.domElement);
        controls.update(clock.getDelta());
        that.renderer.render(that.scene, that.camera);
        if (TVObject.isLoaded)
            TVObject.renderVideo();
    }

    document.onkeypress = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        if (key === 98 && !SAMPLE.isLoaded)                     // press B to go to SAMPLE
        {
            current_window.unload();
            document.removeEventListener('mousedown', current_window.onDocumentMouseDown, false);
            SAMPLE.load();
            document.addEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
            current_window = SAMPLE;
        }
        if (key === 116 && !TVObject.isLoaded)                     // press T to go to TV
        {
            current_window.unload();
            document.removeEventListener('mousedown', current_window.onDocumentMouseDown, false);
            TVObject.load();
            document.addEventListener('mousedown', TVObject.onDocumentMouseDown, false);
            current_window = TVObject;
        }
        if (key === 32 && !JUKEBOX.isLoaded)                      // press Space to go to JUKEBOX
        {
            $('#breadcrumb').css('display', 'block');
            current_window.unload();
            document.removeEventListener('mousedown', current_window.onDocumentMouseDown, false);
            JUKEBOX.load();
            document.addEventListener('mousedown', JUKEBOX.onDocumentMouseDown, false);
            current_window = JUKEBOX;
        }
//        if (key === 118 && SAMPLE.isLoaded)                         // press V to go to ROOM
//        {
//            SAMPLE.unload();
//            document.removeEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
//            ROOM.load();
//            document.addEventListener('mousedown', ROOM.onDocumentMouseDown, false);
//            controls.movementSpeed = 50;
//        }
    }
}