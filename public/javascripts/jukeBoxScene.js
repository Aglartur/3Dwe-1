/**
 * Created by Aibek on 11/24/13.
 */

var JUKEBOX = new JUKEBOX();

function JUKEBOX() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var that = this;        // to reference JUKEBOX inside function that override 'this'
    var radioBody, radioSeeker;
    var radioPlay;
    var radioVolume, radioPower;
    var radioNext, radioPrev;
    var radioReplay, radioShuffle;

    var isPlaying = false;
    var isReplaying = false;
    var isShuffling = false;

    this.currentSongID = 0;

    var floor;
    var light, pointLight;

    modelElements = [];
    buttonsPressed = [];

    this.songs = [];

    this.isLoaded = false;

    this.request = {LOADSONGS : 'loadSongs'};

    this.load = function ()
    {
        initGeometry();
        initLights();

        specialRequest = this.request.LOADSONGS;
        currentDirectory = '/home';
        openDir('Jukebox');
        // after this this.songs contains filenames of songs in /home/Jukebox

        modelElements.push(radioBody);
        modelElements.push(radioSeeker);
        modelElements.push(radioPlay);
        modelElements.push(radioVolume);
        modelElements.push(radioPower);
        modelElements.push(radioNext);
        modelElements.push(radioPrev);
        modelElements.push(radioReplay);
        modelElements.push(radioShuffle);
        modelElements.push(floor);
        modelElements.push(light);
        modelElements.push(pointLight);

        this.isLoaded = true;
    }

    this.unload = function ()
    {
        modelElements.forEach(function(value){
            CORE.intersectObjects.splice(jQuery.inArray(value, CORE.intersectObjects), 1);
        });

        modelElements = [];

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
        CORE.scene.remove(pointLight);

        navigate('/home');
        isPlaying = false;
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
                {
//                    radioPlay.position.set(0,0,1.5);
                    pushTheButton(radioPlay, true);
                    document.getElementById("audio").play();
                }
                else
                {
//                    radioPlay.position.set(0,0,0);
                    pushTheButton(radioPlay, false);
                    document.getElementById("audio").pause();
                }
                isPlaying = !isPlaying;
            }
            if (object === radioNext)
            {
//                radioNext.position.set(0,0,1.5);
                pushTheButton(radioNext, true);
                that.currentSongID = (that.songs.length + that.currentSongID + 1) % that.songs.length;
                that.changeSong(that.songs[ that.currentSongID ]);
                setTimeout(function(){pushTheButton(radioNext, false);}, 300);
            }
            if (object === radioPrev)
            {
//                radioPrev.position.set(0,0,1.5);
                pushTheButton(radioPrev, true);
                that.currentSongID = (that.songs.length + that.currentSongID - 1) % that.songs.length;
                that.changeSong(that.songs[ that.currentSongID ]);
                setTimeout(function(){pushTheButton(radioPrev, false);}, 300);
            }
        }
    }

    this.changeSong = function(filepath) {
        console.log('changing song: ' + filepath);
        $('#audio > source').attr('src', filepath);
        $('#audio > embed').attr('src', filepath);
        $('#audio').load();
        if (isPlaying)
            document.getElementById("audio").play();
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
            callbackModel   = function( geometry, materials ) { radioBody = CORE.loadModel( geometry, materials, 0, 0, 0, false ) };
        loader.load( "obj/radio-body.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioPlay = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-button-play.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioPrev = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-button-prev.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioNext = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-button-next.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioReplay = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-button-replay.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioShuffle = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-button-shuffle.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioSeeker = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-seeker.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { radioVolume = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-volume.js", callbackModel );

        loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) {  radioPower = CORE.loadModel( geometry, materials, 0, 0, 0, true ) };
        loader.load( "obj/radio-power.js", callbackModel );
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 200, -50);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);

        pointLight = new THREE.PointLight(0xff0000, 4, 150);
        pointLight.position.set(-30,20,-40);
        CORE.scene.add(pointLight);
    }

    function pushTheButton ( button, mode) {
        if (mode === true)
        {
//            button.position.set(Math.cos(button.rotation.y) * 1.5, 0, Math.sin(button.rotation.y) * 1.5);
            button.position.x -= Math.sin(button.rotation.y) * 1.5;
            button.position.z -= Math.cos(button.rotation.y) * 1.5;
        }
        else
        {
//            button.position.set(0,0,0);
            button.position.x += Math.sin(button.rotation.y) * 1.5;
            button.position.z += Math.cos(button.rotation.y) * 1.5;
        }
    }
}