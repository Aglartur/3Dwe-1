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

    var dragging, prevDrag;
    var windowHalfX, windowHalfY;
    var currentVolume;

    this.currentSongID = 3;

    var floor;
    var light, pointLight;

    var modelElements = [];
    var buttonsPressed = [];

    this.songs = [];

    this.isLoaded = false;

    this.request = {LOADSONGS : 'loadSongs'};

    this.load = function ()
    {
        initGeometry();
        initLights();

        windowHalfX = $('viewer').width() / 2;
        windowHalfY = $('viewer').height() / 2;

        specialRequest = this.request.LOADSONGS;
        currentDirectory = '/home';
        openDir('Jukebox');
        console.log(this.songs);
        // after this this.songs contains filenames of songs in /home/Jukebox

        // -- my initialization -- delete this when the file system is working
        this.songs.push("02-Peace_Of_Mind.mp3");
        this.songs.push("06. Thunderstruck.mp3");
        this.songs.push("15. Highway to Hell.mp3");
        this.songs.push("dare.mp3");
        this.songs.push("Darsay – Piano Street.mp3");
        this.songs.push("Eminem – Lose Yourself.mp3");
        this.songs.push("01 - Holes.mp3");
        this.songs.push("001 - Silversun Pickups - Pikul - Kissing Families.mp3");
        this.songs.push("03 Clipping.mp3");
        this.songs.push("06. Daylight.mp3");
        this.songs.push("13 - Candyman.mp3");
        this.songs.push("01 - Holes.mp3");
        console.log(this.songs);
        // --

        //initial audio tag initialization and generation:
        var audio_html = '<audio controls id="audio" onended="JUKEBOX.autoNext()"><source id="change_audio" src="/home/Jukebox/' + this.songs[this.currentSongID] + '" type="audio/mpeg"><embed height="50" width="100" src=""></audio>' ;
        document.getElementById("test_audio").innerHTML = audio_html;
        document.getElementById('audio').volume = 0.5;
        currentVolume = document.getElementById('audio').volume;

        //document.querySelector("#audio").addEventListener("ended", this.autoNext() ,false);
//        $("#audio").bind('ended', function(){
//            // done playing
//            //alert("Player stopped");
//            that.currentSongID = (that.songs.length + that.currentSongID + 1) % that.songs.length;
//            that.changeSong(that.songs[ that.currentSongID ]);
//        });

        CORE.freezeCamera(true);
        CORE.camera.position.set(-10, 2, -70);
        CORE.camera.rotation.set(-3.5, 0, -Math.PI);

        this.isLoaded = true;
    }

    this.unload = function ()
    {
        CORE.disposeSceneElements(modelElements);

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
                if(!isShuffling && !isReplaying) {
                    that.currentSongID = (that.songs.length + that.currentSongID + 1) % that.songs.length;
                    that.changeSong(that.songs[ that.currentSongID ]);
                }
                else if (isShuffling && !isReplaying){
//                    that.shuffleNext();
                    that.currentSongID = Math.floor(Math.random()*that.songs.length);
                    that.changeSong(that.songs[ that.currentSongID ]);
                }
                else {
                    that.changeSong(that.songs[ that.currentSongID ]);
                }

                setTimeout(function(){pushTheButton(radioNext, false);}, 300);
            }
            if (object === radioPrev)
            {
//                radioPrev.position.set(0,0,1.5);
                pushTheButton(radioPrev, true);
                if (!isShuffling && !isReplaying) {
                    that.currentSongID = (that.songs.length + that.currentSongID - 1) % that.songs.length;
                    that.changeSong(that.songs[ that.currentSongID ]);
                }
                else if (isShuffling && !isReplaying) {
//                    that.shufflePrev();
                    that.currentSongID = Math.floor(Math.random()*that.songs.length);
                    that.changeSong(that.songs[ that.currentSongID ]);
                }
                else {
                    that.changeSong(that.songs[ that.currentSongID ]);
                }
                setTimeout(function(){pushTheButton(radioPrev, false);}, 300);
            }
            if (object === radioReplay)
            {
                if (!isReplaying)
                {
                    pushTheButton(radioReplay, true);
                }
                else
                {
                    pushTheButton(radioReplay, false);
                }
                isReplaying = !isReplaying;
            }
            if (object === radioShuffle)
            {
                //console.log("OMG SOMEONE PUSHED SHUFFLE");
                if (!isShuffling)
                {
                    pushTheButton(radioShuffle, true);
                }
                else
                {
                    pushTheButton(radioShuffle, false);
                }
                isShuffling = !isShuffling;
            }
            if (object === radioVolume) {
                console.log("VOLUME CLICK??!?");
                dragging = true;
                prevDrag = vector;
                prevDrag.y = 0;
//                rotateTheButton(radioVolume, true);
                //setvolume();
                //console.log(document.getElementById('audio').volume);
            }
        }
    }

    this.onDocumentMouseUp = function(event){
        event.preventDefault();

        console.log("HOLYSHIT A MOUSEUP EVENT");
        dragging = false;
        prevDrag = null;

    }

    this.onDocumentMouseOut = function(event){
        event.preventDefault();

        console.log("HOLYSHIT A MOUSEOUT EVENT");
        dragging = false;
        prevDrag = null;

    }

    this.onDocumentMouseMove = function(event){

        event.preventDefault();

        var mouseX = ( event.clientX - windowHalfX ) / 2;
        var mouseY = ( event.clientY - windowHalfY ) / 2;

        if (dragging)
        {
            console.log("OMG DRAGGING IS HAPPENING!!!!");
            var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
            CORE.projector.unprojectVector(vector, CORE.camera);
            vector.sub(CORE.camera.position).normalize();
            vector.y = 0;

            var temp = new THREE.Vector3(0,0,0);
            temp.add(vector);

            vector.sub(prevDrag);
            vector.multiplyScalar(5);  // seems to work ok as long as it is positive

            if (vector.x > 0) {
                console.log("^.^ volume++");
                setvolume(-0.0125);
                //rotateTheButton(radioVolume, false);
                // moved to setvolume
            }
            if (vector.x < 0) {
                console.log("^.^ volume--");
                setvolume(0.0125);
                //rotateTheButton(radioVolume, true);
                // moved to setvolume
            }

            prevDrag = temp;

        }

    }

    this.changeSong = function(filepath) {
        console.log('changing song: ' + filepath);

        //if (!isReplaying){
            var audio_html = '<audio controls id="audio" onended="JUKEBOX.autoNext()"><source id="change_audio" src="/home/Jukebox/' + filepath + '" type="audio/mpeg"><embed height="50" width="100" src=""></audio>' ;
            document.getElementById("test_audio").innerHTML = audio_html;
            document.getElementById('audio').volume = currentVolume;
        //}

//        $('#audio > source').attr('src', filepath);
//        $('#audio > embed').attr('src', filepath);
//        $('#audio').load();
        if (isPlaying)
            document.getElementById("audio").play();
//        document.getElementById("audio").
    }

    this.autoNext = function() {
        if (!isShuffling && !isReplaying){
            that.currentSongID = (that.songs.length + that.currentSongID + 1) % that.songs.length;
            that.changeSong(that.songs[ that.currentSongID ]);
        }
        else if (isShuffling && !isReplaying) {
            that.currentSongID = Math.floor(Math.random()*that.songs.length);
            that.changeSong(that.songs[ that.currentSongID ]);
        }
        else {
            that.changeSong(that.songs[ that.currentSongID ]);
        }
    }

//    this.buildShuffledIndexArray = function(size) {
//
//        var array = [];
//        for (var i = 0; i<size; i++) {
//            array[i] = 0;
//        }
//
//        var rand = function(max) {
//            return Math.random()*max;
//        }
//
//        for ( var currentIndex = size - 1; currentIndex > 0; currentIndex-- ) {
//            var nextIndex = rand( currentIndex + 1 );
//            //swap
//            if ( array[currentIndex] == 0 ) {
//                array[currentIndex] = currentIndex;
//            }
//            if ( array[nextIndex] == 0 ) {
//                array[nextIndex] = nextIndex;
//            }
//            var temp = array[nextIndex];
//            array[nextIndex] = array[currentIndex];
//            array[currentIndex] = temp;
//        }
//        return array;
//    }
//
//    var shuff_count = this.songs.length;
//    var shuff_array = buildShuffledIndexArray(shuff_count);
//    this.shuffleNext = function() {
//        if (shuff_count > 0) {
//            this.currentSongID = shuff_array[shuff_count-1];
//            this.changeSong(this.songs[ this.currentSongID ]);
//            shuff_count--;
//        }
//        else {
//            shuff_count = this.songs.length;
//            shuff_array = this.buildShuffledIndexArray(shuff_count);
//            this.currentSongID = shuff_array[shuff_count-1];
//            this.changeSong(that.songs[ that.currentSongID ]);
//            shuff_count--;
//        }
//    }
//    this.shufflePrev = function() {
//        if (shuff_count < that.songs.length) {
//            that.currentSongID = shuff_array[shuff_count];
//            that.changeSong(that.songs[ that.currentSongID ]);
//            shuff_count++;
//        }
//        else if (shuff_count === that.songs.length) {
//            shuff_array = that.buildShuffledIndexArray(shuff_count);
//            that.currentSongID = shuff_array[0];
//            that.changeSong(that.songs[ that.currentSongID ]);
//            shuff_count = 0;
//        }
//    }

    function initGeometry() {
        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 10, 10),
            new THREE.MeshLambertMaterial({color: 0xCEB2B3}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        CORE.scene.add(floor);
        modelElements.push(floor);

        var loader = new THREE.JSONLoader();
        var callbackModel   = function( geometry, materials ) {
            radioBody = CORE.loadModel( geometry, materials, 0, 0, 0, false );
            modelElements.push(radioBody);
        };
        loader.load( "obj/radio-body.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioPlay = CORE.loadModel( geometry, materials, 0, 0, 0, true );
            modelElements.push(radioPlay);
        };
        loader.load( "obj/radio-button-play.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioPrev = CORE.loadModel( geometry, materials, 0, 0, 0, true );
            modelElements.push(radioPrev);
        };
        loader.load( "obj/radio-button-prev.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioNext = CORE.loadModel( geometry, materials, 0, 0, 0, true );
            modelElements.push(radioNext);
        };
        loader.load( "obj/radio-button-next.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioReplay = CORE.loadModel( geometry, materials, 0, 0, 0, true );
            modelElements.push(radioReplay);
        };
        loader.load( "obj/radio-button-replay.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioShuffle = CORE.loadModel( geometry, materials, 0, 0, 0, true );
            modelElements.push(radioShuffle);
        };
        loader.load( "obj/radio-button-shuffle.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioSeeker = CORE.loadModel( geometry, materials, 0, 0, 0, true );
            modelElements.push(radioSeeker);
        };
        loader.load( "obj/radio-seeker.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioVolume = CORE.loadModel( geometry, materials, -10.5, 7/*fix*/, -17/*fix*/, true );
            modelElements.push(radioVolume);
        };
        loader.load( "obj/knob-origin-1.js", callbackModel );

        callbackModel   = function( geometry, materials ) {
            radioPower = CORE.loadModel( geometry, materials, -49, 7/*fix*/, -17/*fix*/, true );
            modelElements.push(radioPower);
        };
        loader.load( "obj/knob-origin-1.js", callbackModel );
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 200, -50);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
        modelElements.push(light);

        pointLight = new THREE.PointLight(0x661452, 4, 150);
        pointLight.position.set(-30,20,-40);
        CORE.scene.add(pointLight);
        modelElements.push(pointLight);
    }

    function pushTheButton ( button, mode) {
        if (mode === true)
        {
            button.position.x -= Math.sin(button.rotation.y) * 1.5;
            button.position.z -= Math.cos(button.rotation.y) * 1.5;
        }
        else
        {
            button.position.x += Math.sin(button.rotation.y) * 1.5;
            button.position.z += Math.cos(button.rotation.y) * 1.5;
        }
    }
    function rotateTheButton ( button, mode ) {
        if (mode) {
            button.rotation.z -= (2*Math.PI)/80;
        }
        else {
            button.rotation.z += (2*Math.PI)/80;
        }
    }
    function setvolume (vol) {
        if ( (vol+document.getElementById('audio').volume) > 0 && (vol+document.getElementById('audio').volume) < 1 ) {
            currentVolume = document.getElementById('audio').volume += vol;
            if (vol < 0) {
                rotateTheButton(radioVolume, false);
            }
            if (vol > 0) {
                rotateTheButton(radioVolume, true);
            }

        }


//        if (document.getElementById('audio').volume <= 0.1) {
//            document.getElementById('audio').volume = 1;
//        }
//        else {
//            document.getElementById('audio').volume -= 0.1;
//        }

//        var audiovol = document.getElementById('audio').volume;
//        if ( (vol+audiovol) > 0 && (vol+audiovol) < 1 ) {
//            audiovol = audiovol + vol;
//        }
    }

    this.update = function(){
        var d = Math.sqrt(Math.pow(CORE.camera.position.x, 2) +
            Math.pow(CORE.camera.position.y, 2) + Math.pow(CORE.camera.position.z, 2));
        //document.getElementById("audio").volume = 5*Math.abs(Math.log(d)/d);
    }
}