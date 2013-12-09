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
    var play_panel, play_buttons = [], buttons = [];
    var dir = '/images/newbuttons/';

    var isPlaying = false;
    var seekValue = 0;
    var recording = false, recordRTC = null;

    var floor;
    var light, pointLight;
    var mirrorCamera;

    var modelElements = [];

    this.mirrorObj = undefined;
    this.isLoaded = false;
    this.group = new THREE.Object3D();

    this.load = function()
    {
        currentDirectory = '/home';
//        openDir('videos');

        initOptions();
        initGeometry();
        initLights();

        CORE.scene.add(that.group);
        that.group.rotation.y = Math.PI;
        that.group.position.z = -500 + 30;
        that.group.position.y = 45;
        that.group.position.x = -60;
        that.group.scale.set(3,3,3);

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
            if (object === play_buttons[0]){ //FAST FORWARD
                seekValue = 1;
            }else if (object === play_buttons[3]){ //REWIND
                seekValue = -1;
            }else{
                var index = isButton(object);
                if (index && video){
                    buttons[index-1].action();
                    buttons[index-1].on = !buttons[index-1].on;
                    redrawButton(object, buttons[index-1]);
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
//            CORE.scene.remove(play_buttons[i]);
            that.group.remove(play_buttons[i]);
        }
    }

    this.showPlayer = function(){
        for (var i = 0; i < play_buttons.length; i++){
//                CORE.scene.add(play_buttons[i]);
            that.group.add(play_buttons[i]);
        }
    }

    function initGeometry() {
        var loader = new THREE.JSONLoader();
        var callbackModel   = function( geometry, materials ) {
            TV_set = CORE.loadModel( geometry, materials, 0, 0, 0, false );
            modelElements.push(TV_set);
            that.group.add(TV_set);
        };
        loader.load( "/obj/tv.js", callbackModel );

        var WIDTH = 78, HEIGHT = 43;
        screen = new THREE.Mesh(
            new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10),
            new THREE.MeshPhongMaterial({color: 0xFFFFFF}));
        screen.receiveShadow = true;
        screen.rotation.y = Math.PI;
        screen.position.x = -11;                    // align to screen
        screen.position.z = -1;                    // move in front
        screen.position.y = 35;                   // move it up
        CORE.scene.add(screen);
        CORE.intersectObjects.push(screen);
        modelElements.push(screen);
        that.group.add(screen);

        video = document.createElement('video');
        video.width = WIDTH;
        video.height = HEIGHT;

        videoTexture = new THREE.Texture(video);
        loadScreen(); //load screen material

        var cubeGeom = new THREE.CubeGeometry(100, 250, 10, 1, 1, 1);
        mirrorCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
        // mirrorCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
        CORE.scene.add( mirrorCamera );
        var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCamera.renderTarget } );
        that.mirrorObj = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
        that.mirrorObj.position.set(-500,150,0); //place on wall
        that.mirrorObj.rotation.set(0, Math.PI/2, 0);
        mirrorCamera.position = that.mirrorObj.position;
        CORE.scene.add(that.mirrorObj);
        alert(that.mirrorObj);
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
//        CORE.scene.add(pointLight);
        modelElements.push(pointLight);
        that.group.add(pointLight);
    }

    this.renderVideo = function() {
        if (video.readyState === video.HAVE_ENOUGH_DATA){
            videoTexture.needsUpdate = true;
        }
        if (seekValue)
            video.currentTime+=seekValue;

        that.mirrorObj.visible = false;
        mirrorCamera.updateCubeMap( CORE.renderer, CORE.scene );
        that.mirrorObj.visible = true;
    }

    function loadScreen(){
        var videoMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xdddddd,
            shininess: 30,
            ambient: 0x0000a1,
            emissive: 0x001533,
            map : videoTexture,
            side: THREE.DoubleSide
        });
        screen.material = videoMaterial;
    }

    this.loadVideo = function(filename){
        isPlaying = false;
        video.autoplay = false;
        video.src = filename;
        videoTexture = new THREE.Texture(video);
        loadScreen();
        resetButtons();
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
                loadScreen();
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
//            CORE.cameraTarget.set(that.group.position.x - 50, that.group.position.y + 100, that.group.position.z);
            CORE.freezeCamera(true);
//            var X_FINAL = -11.1, Y_FINAL = 35.12, Z_FINAL = -39.13;
            var X_FINAL = that.group.position.x + 34, Y_FINAL = that.group.position.y + 106, Z_FINAL = that.group.position.z + 116;
            console.log(X_FINAL + " : " + Y_FINAL + " : " + Z_FINAL);
            var xGreater = CORE.camera.position.x > X_FINAL,
                yGreater = CORE.camera.position.y > Y_FINAL,
                zGreater = CORE.camera.position.z > Z_FINAL;
            var speed = 10;

//            CORE.camera.rotation.set(-Math.PI, 0, -Math.PI);
            CORE.camera.rotation.set(-Math.PI, that.group.rotation.y, -Math.PI);
//            CORE.cameraTarget.set(that.group.position.x - 50, that.group.position.y + 100, that.group.position.z);

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

    function redrawButton(button_obj, button){
        if (button.next_img && button.on){
            var button_texture = new THREE.ImageUtils.loadTexture(dir + button.next_img, {}, function () {
                CORE.renderer.render(CORE.scene, CORE.camera);
            });
            button_obj.material.map = button_texture;
        }else if (button.next_img){
            var button_texture = new THREE.ImageUtils.loadTexture(dir + button.img, {}, function () {
                CORE.renderer.render(CORE.scene, CORE.camera);
            });
            button_obj.material.map = button_texture;
        }
    }

    function initOptions(){
        var button_texture, temp_button;
        var BUTTON_WIDTH = 5, BUTTON_HEIGHT = 5, BASE_X = -25, BUTTON_Y = 18, BUTTON_Z = -1.1;

        buttons = [
            {img: 'forward.png', action: function(){}},
            {img: 'volon.png', next_img: 'mute.png', on:false, action: function(){
                video.muted = !this.on;
            }},
            {img: 'play.png', next_img: 'pause.png', on: false, action: function(){
                if (!this.on){
                    video.play();
                    isPlaying = true;
                }else{
                    video.pause();
                    isPlaying = false;
                }
            }},
            {img: 'back.png', action: function(){}},
            {img: 'record.png', next_img: 'recordon.png', on: false, action: function(){
                if (this.on){
                    that.endRecording();
                    recording = false;
                }else{
                    that.loadWebcam();
                    recording = true;
                }
            }}];
        play_buttons = [];

        play_panel = new THREE.Mesh(
            new THREE.PlaneGeometry(15.5*BUTTON_WIDTH, 1.7*BUTTON_HEIGHT, 10, 10),
            new THREE.MeshPhongMaterial({color: 0x555555}));
        play_panel.receiveShadow = true;
        play_panel.rotation.y = Math.PI;
        play_panel.position.set(BASE_X+14, BUTTON_Y, BUTTON_Z+0.1);
        play_panel.visible = false;
//        CORE.scene.add(play_panel);
        CORE.intersectObjects.push(play_panel);
        modelElements.push(play_panel);
        that.group.add(play_panel);

        for (var i = 0; i < buttons.length; i++){
            button_texture = new THREE.ImageUtils.loadTexture(dir + buttons[i].img, {}, function () {
                CORE.renderer.render(CORE.scene, CORE.camera);
            });
            temp_button = new THREE.Mesh(
                new THREE.PlaneGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, 10, 10),
                new THREE.MeshPhongMaterial({map: button_texture, transparent: true, opacity: 0.8}));
            temp_button.receiveShadow = true;
            temp_button.rotation.y = Math.PI;
            temp_button.position.set(BASE_X + i*BUTTON_WIDTH + i, BUTTON_Y, BUTTON_Z);
//            CORE.scene.add(temp_button);
            CORE.intersectObjects.push(temp_button);
            modelElements.push(temp_button);
            play_buttons.push(temp_button);
            that.group.add(temp_button);
        }
    }
    function resetButtons(){
        for (var i = 0; i < buttons.length; i++){
            buttons[i].on = false;
            redrawButton(play_buttons[i], buttons[i]);
        }
    }
}