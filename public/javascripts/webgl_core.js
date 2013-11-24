/**
 * Created by Aibek on 11/2/13.
 */

var CORE = new CORE();

$(document).ready(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    CORE.init();
    CORE.animate(new Date().getTime());
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

    this.init = function() {

        //##########################################################################
        //                           WebGL starts here!
        //##########################################################################

        // initializing renderer - used to display entire WebGL thing in the browser
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize($('#viewer').width(), $('#viewer').height());    // take up entire space
        renderer.shadowMapEnabled = true;                           // enable shadows

        $('#viewer').html(renderer.domElement);

        // initializing camera - used to show stuff
        this.camera = new THREE.PerspectiveCamera(60, $('#viewer').width() / $('#viewer').height(), 1, 10000);       // don't worry about parameters
        this.camera.position.set(0, 50, -200);
        cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(cameraTarget);

        this.scene = new THREE.Scene();
        this.projector = new THREE.Projector();

        THREEx.WindowResize(renderer, this.camera);

        // to freeze camera press Q, to move camera up R, to move camera down F
        controls = new THREE.FirstPersonControls(this.camera, cameraTarget);
        controls.movementSpeed = 35;
        controls.activeLook = false;
        controls.lookSpeed = 0.3;
        clock = new THREE.Clock();

        SAMPLE.load(this.scene);
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
        if (key === 32)
            alert("You are clicking Space");
    }
}