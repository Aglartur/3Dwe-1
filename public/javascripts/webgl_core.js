/**
 * Created by Aibek on 11/2/13.
 */

var CORE = new CORE();

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

    var renderer;
    this.camera;
    this.scene;
    this.projector;
    this.intersectObjects =[];

    var controls;
    var clock;
    var cameraTarget;

    var interactObjects = [];

    this.init = function() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize($('#viewer').width(), $('#viewer').height());    // take up entire space
        renderer.shadowMapEnabled = true;                           // enable shadows

        $('#viewer').html(renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, $('#viewer').width() / $('#viewer').height(), 1, 10000);       // don't worry about parameters
        this.camera.position.set(-25, 25, -100);
        cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(cameraTarget);

        this.scene = new THREE.Scene();
        this.projector = new THREE.Projector();

        THREEx.WindowResize(renderer, this.camera);

        // to freeze camera press Q, to move camera up R, to move camera down F
        controls = new THREE.FirstPersonControls(this.camera, cameraTarget);
        controls.movementSpeed = 15;
        controls.activeLook = false;
        controls.lookSpeed = 0.1;
        clock = new THREE.Clock();

        SAMPLE.load();
        document.addEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
    }

    // Notice we use 'that' instead of 'this', because next time we call this.animate we want to keep old reference 'this'
    this.animate = function(t)
    {
        requestAnimationFrame(that.animate, renderer.domElement);
        controls.update(clock.getDelta());
        renderer.render(that.scene, that.camera);
    }

    document.onkeypress = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        if (key === 98 && JUKEBOX.isLoaded)                     // press B to go to SAMPLE
        {
            JUKEBOX.unload();
            document.removeEventListener('mousedown', JUKEBOX.onDocumentMouseDown, false);
            SAMPLE.load();
            document.addEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
        }
        if (key === 32 && SAMPLE.isLoaded)                      // press Space to go to JUKEBOX
        {
            $('#breadcrumb').css('display', 'block');
            SAMPLE.unload();
            document.removeEventListener('mousedown', SAMPLE.onDocumentMouseDown, false);
            JUKEBOX.load();
            document.addEventListener('mousedown', JUKEBOX.onDocumentMouseDown, false);
        }
    }
}