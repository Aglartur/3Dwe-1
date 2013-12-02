/**
 * Created by Sean on 11/27/13.
 */

var TVObject = new TVObject();


function TVObject() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var that = this;        // to reference TVObject inside function that override 'this'
    var TV_set, screen;

    var video, videoTexture;
    var play_panel, play_buttons = [], button_functions = [];

    var isPlaying = false;
    var seekValue = 0;
    var recording = false, recordRTC = null;

    var floor;
    var light, pointLight;

    var modelElements = [];

    this.isLoaded = false;

    this.load = function()
    {
        currentDirectory = '/home';
        openDir('videos');

        initOptions();
        initGeometry();
        initLights();

        CORE.freezeCamera(true);
        //CORE.camera.position.set(0, 1.5, -4);
        CORE.camera.position.set(-25, 25, -100);
        CORE.camera.rotation.set(-Math.PI, 0, Math.PI);

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
            if (object === play_buttons[0]){
                seekValue = 1;
            }else if (object === play_buttons[4]){
                seekValue = -1;
            }else{
                var index = isButton(object);
                if (index && video){
                    button_functions[index-1]();
                }
            }
        }
    }

    this.onDocumentMouseUp = function(event){
        event.preventDefault();
        seekValue = 0;
    }

    this.onDocumentMouseMove = function(event){
        event.preventDefault();

        var object;
        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
        CORE.projector.unprojectVector(vector, CORE.camera);
        var raycaster = new THREE.Raycaster(CORE.camera.position, vector.sub(CORE.camera.position).normalize());
        var intersects = raycaster.intersectObjects(CORE.intersectObjects);

        // if you clicked on something
        if (intersects.length > 0) {
            object = intersects[ 0 ].object;
            if (object === play_panel || isButton(object))
                that.showPlayer();
            else
                that.hidePlayer();
        }
        else
            that.hidePlayer();
    }

    function isButton(object){
        for (var i = 0; i < play_buttons.length; i++){
            if (object === play_buttons[i])
                return i+1; //return offset of 1 from index (always positive -> true)
        }
        return 0; //false
    }

    this.hidePlayer = function(){
        for (var i = 0; i < play_buttons.length; i++){
            CORE.scene.remove(play_buttons[i]);
        }
    }

    this.showPlayer = function(){
        for (var i = 0; i < play_buttons.length; i++){
                CORE.scene.add(play_buttons[i]);
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
        modelElements.push(floor);

        var loader = new THREE.JSONLoader();
        var callbackModel   = function( geometry, materials ) {
            TV_set = CORE.loadModel( geometry, materials, 0, 0, 0, false );
            modelElements.push(TV_set);
        };
        loader.load( "obj/tv.js", callbackModel );

        var WIDTH = 78, HEIGHT = 43;
        screen = new THREE.Mesh(
            new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10),
            new THREE.MeshPhongMaterial({color: 0xFFFFFF}));
        screen.receiveShadow = true;
        //screen.rotation.y = Math.PI;
        screen.position.x = -11;                    // align to screen
        screen.position.z = -1;                    // move in front
        screen.position.y = 35;                   // move it up
        CORE.scene.add(screen);
        CORE.intersectObjects.push(screen);
        modelElements.push(screen);

        video = document.createElement('video');
        video.width = WIDTH;
        video.height = HEIGHT;

        videoTexture = new THREE.Texture(video);
        var videoMaterial = new THREE.MeshLambertMaterial({
            map : videoTexture, side: THREE.DoubleSide
        });
        screen.material = videoMaterial;
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 200, -50);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
        modelElements.push(light);

        pointLight = new THREE.PointLight(0x333333, 4, 150);
        pointLight.position.set(-30,20,-40);
        CORE.scene.add(pointLight);
        modelElements.push(pointLight);
    }

    this.renderVideo = function() {
        if (video.readyState === video.HAVE_ENOUGH_DATA){
            videoTexture.needsUpdate = true;
        }
        if (seekValue)
            video.currentTime+=seekValue;
    }

    this.loadVideo = function(filename){
        isPlaying = false;
        video.autoplay = false;
        video.src = filename;
        videoTexture = new THREE.Texture(video);
        var videoMaterial = new THREE.MeshLambertMaterial({
            map : videoTexture, side: THREE.DoubleSide
        });
        screen.material = videoMaterial;
    }

    this.loadWebcam = function(){
        navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;
        navigator.getUserMedia({"video":true, "audio": false},
            function(stream) {
                //video.autoplay = false;
                video.src = window.URL.createObjectURL(stream);
                video.play();
                isPlaying = true;
                videoTexture = new THREE.Texture(video);
                var videoMaterial = new THREE.MeshLambertMaterial({
                    map : videoTexture, side: THREE.DoubleSide
                });
                screen.material = videoMaterial;
                that.recordVideo(stream);
            },
            function(err) {
                alert("Camera Error");
                console.log(err);
            }
        );
    }

    this.recordVideo = function(stream){
        var options = {
            type: 'video',
            video: {
                width: 320,
                height: 240
            },
            canvas: {
                width: 320,
                height: 240
            }
        };
        recordRTC = RecordRTC(stream, options);
        recordRTC.startRecording();
    }

    this.endRecording = function(){
        recordRTC.stopRecording(function(videoURL) {
            window.open(videoURL);
        });
    }

    var rotateView = 0, flyTo = 0;

    this.flyToObject = function(event){
        if (event.keyCode === 73){
            if (rotateView !== 0 || flyTo !== 0) return;
            CORE.freezeCamera(true);
            var X_FINAL = -11.1, Y_FINAL = 35.12, Z_FINAL = -39.13;
            var xGreater = CORE.camera.position.x > X_FINAL,
                yGreater = CORE.camera.position.y > Y_FINAL,
                zGreater = CORE.camera.position.z > Z_FINAL;
            var speed = 2;

            CORE.camera.rotation.set(-Math.PI, 0, -Math.PI);

            flyTo = setInterval(function(){
                var noXChange = false, noYChange = false, noZChange = false;
                if (CORE.camera.position.x-speed > X_FINAL && xGreater)
                    CORE.camera.position.x-=speed;
                else if (CORE.camera.position.x+speed < X_FINAL && !xGreater)
                    CORE.camera.position.x+=speed;
                else
                    noXChange = true;

                if (CORE.camera.position.y-speed > Y_FINAL && yGreater)
                    CORE.camera.position.y-=speed;
                else if (CORE.camera.position.y+speed < Y_FINAL && !yGreater)
                    CORE.camera.position.y+=speed;
                else
                    noYChange = true;

                if (CORE.camera.position.z-speed > Z_FINAL && zGreater)
                    CORE.camera.position.z-=speed;
                else if (CORE.camera.position.z+speed < Z_FINAL && !zGreater)
                    CORE.camera.position.z+=speed;
                else
                    noZChange = true;

                if (noXChange && noYChange && noZChange){
                    speed /= 2;
                    if (speed < 0.1){
                        clearInterval(flyTo);
                        flyTo = 0;
                    }
                }
            }, 50);
        }
    }

    this.playVideo = function(){
        if (video)
            video.play();
    }

    this.pauseVideo = function(){
        if (video)
            video.pause();
    }

    function initOptions(){
        var button_texture, temp_button;
        var BUTTON_WIDTH = 5, BUTTON_HEIGHT = 5, BASE_X = -25, BUTTON_Y = 18, BUTTON_Z = -1.1;

        var texture_paths = ['fastforward.jpg', 'pause.jpg', 'play.jpg', 'stop.jpg', 'rewind.jpg', 'record.jpg'];
        button_functions = [
            function(){ //FF:
                //video.currentTime++;
            },
            function(){ //PAUSE:
                video.pause();
                isPlaying = false;
            },
            function(){ //PLAY:
                video.play();
                isPlaying = true;
            },
            function(){ //STOP & reset:
                video.pause();
                video.currentTime=0;
                isPlaying = false;
            },
            function(){ //REWIND:
                //video.currentTime--;
            },
            function(){ //RECORD:
                if (recording){
                    that.endRecording();
                    recording = false;
                }else{
                    that.loadWebcam();
                    recording = true;
                }
            }
        ];

        play_panel = new THREE.Mesh(
            new THREE.PlaneGeometry(15.5*BUTTON_WIDTH, 1.7*BUTTON_HEIGHT, 10, 10),
            new THREE.MeshPhongMaterial({color: 0x555555}));
        play_panel.receiveShadow = true;
        play_panel.rotation.y = Math.PI;
        play_panel.position.set(BASE_X+14, BUTTON_Y, BUTTON_Z+0.1);
        play_panel.visible = false;
        CORE.scene.add(play_panel);
        CORE.intersectObjects.push(play_panel);
        modelElements.push(play_panel);

        for (var i = 0; i < texture_paths.length; i++){
            button_texture = new THREE.ImageUtils.loadTexture('/images/buttons/' + texture_paths[i], {}, function () {
                CORE.renderer.render(CORE.scene, CORE.camera);
            });
            temp_button = new THREE.Mesh(
                new THREE.PlaneGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, 10, 10),
                new THREE.MeshPhongMaterial({map: button_texture}));
            temp_button.receiveShadow = true;
            temp_button.rotation.y = Math.PI;
            temp_button.position.set(BASE_X + i*BUTTON_WIDTH + i, BUTTON_Y, BUTTON_Z);
            CORE.scene.add(temp_button);
            CORE.intersectObjects.push(temp_button);
            modelElements.push(temp_button);
            play_buttons.push(temp_button);
        }
    }
}