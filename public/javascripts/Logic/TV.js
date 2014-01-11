/**
 * Created by Sean on 11/27/13.
 * Refactored by Aibek on 11.01.14
 */

function TVLogic(itemGroup, TV_set, screen, video, videoTexture) {
    // Call the parent constructor
    Logic.call(this);

    /********************************* PUBLIC INSTANCE VARIABLES *********************************/

    this.isLoaded = false;
    this.group = itemGroup;

    /*************************************** PUBLIC "PRIVATE" VARIABLES **************************************/

    //TV & screen objects
    this.TV_set = TV_set;
    this.screen = screen;

    // video & video texture
    this.video = video;
    this.videoTexture = videoTexture;

    console.log(videoTexture);

    this.play_panel, this.play_buttons = [], this.buttons = [];
    this.dir = '/images/newbuttons/';
    this.isPlaying = false;
    this.seekValue = 0; //determines how fast the user is rewinding or fast-forwarding the video
    this.recording = false;
    this.recordRTC = null; //webcam recording variables
    this.modelElements = [];
}

// inherit Item
TVLogic.prototype = new Logic();

// correct the constructor pointer because it points to Item
TVLogic.prototype.constructor = Logic;

TVLogic.prototype.load = function()
{
    currentDirectory = '/Home';

    this.initOptions();

    this.isLoaded = true;
}

 TVLogic.prototype.unload = function ()
{
    CORE.disposeSceneElements(this.modelElements);

    navigate('/Home');
    this.isPlaying = false;
    this.isLoaded = false;
}

TVLogic.prototype.onDocumentMouseDown = function(event){
    event.preventDefault();

    var object;
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    CORE.projector.unprojectVector(vector, CORE.camera);
    var raycaster = new THREE.Raycaster(CORE.camera.position, vector.sub(CORE.camera.position).normalize());
    var intersects = raycaster.intersectObjects(CORE.intersectObjects);

    // if you clicked on something
    if (intersects.length > 0) {
        object = intersects[ 0 ].object;
        if (object === this.play_buttons[0]){ //FAST FORWARD
            this.seekValue = 1;
        }else if (object === this.play_buttons[3]){ //REWIND
            this.seekValue = -1;
        }else{
            var index = this.isButton(object);
            if (index && this.video){
                this.buttons[index-1].action();
                this.buttons[index-1].on = !this.buttons[index-1].on;
                this.redrawButton(object, this.buttons[index-1]);
            }
        }
    }
}

TVLogic.prototype.onDocumentMouseUp = function(event){
        event.preventDefault();
        this.seekValue = 0;
    }

TVLogic.prototype.onDocumentMouseMove = function(event){
        event.preventDefault();

        var that = this;
        var object;
        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
        CORE.projector.unprojectVector(vector, CORE.camera);
        var raycaster = new THREE.Raycaster(CORE.camera.position, vector.sub(CORE.camera.position).normalize());
        var intersects = raycaster.intersectObjects(CORE.intersectObjects);

        // if you clicked on something
        if (intersects.length > 0) {
            object = intersects[ 0 ].object;
            if (object === this.play_panel || this.isButton(object))
                that.showPlayer();
            else
                that.hidePlayer();
        }
        else
            that.hidePlayer();
    }

TVLogic.prototype.isButton = function(object){
    for (var i = 0; i < this.play_buttons.length; i++){
        if (object === this.play_buttons[i])
            return i+1; //return offset of 1 from index (always positive -> true)
    }
    return 0; //false
}

TVLogic.prototype.hidePlayer = function(){
    for (var i = 0; i < this.play_buttons.length; i++){
//            CORE.scene.remove(play_buttons[i]);
        this.group.remove(this.play_buttons[i]);
    }
}

TVLogic.prototype.showPlayer = function(){
    for (var i = 0; i < this.play_buttons.length; i++){
        this.group.add(this.play_buttons[i]);
    }
}

/**
 * renders the video and updates the position when seeking
 */
TVLogic.prototype.renderVideo = function() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA){
        this.videoTexture.needsUpdate = true;
    }
    if (this.seekValue)
        this.video.currentTime+=this.seekValue;
}

    /**
     * loads the video material onto the screen
     */
TVLogic.prototype.loadScreen = function(){
        var videoMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xdddddd, //give it some specular reflectance
            shininess: 30,
            ambient: 0x0000a1,
            emissive: 0x001533,
            map : this.videoTexture,
            side: THREE.DoubleSide
        });
        screen.material = videoMaterial;
    }

    /**
     * loads the specified video file
     * @param filename the absolute path of the video file
     */
TVLogic.prototype.loadVideo = function(filename){
        this.isPlaying = false;
        this.video.autoplay = false;
        this.video.muted = false;
        this.video.src = filename;
        this.videoTexture = new THREE.Texture(this.video);
        this.loadScreen();
        this.resetButtons();
    }

    /**
     * loads webcam data and streams it to a video object which can be displayed on the screen
     */
TVLogic.prototype.loadWebcam = function(){
        navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;
        navigator.getUserMedia({"video":true, "audio": false},
            function(stream) {
                this.video.src = window.URL.createObjectURL(stream);
                this.video.play();
                this.isPlaying = true;
                this.videoTexture = new THREE.Texture(this.video);
                this.loadScreen();
//                that.recordVideo(stream);
                this.recordVideo(stream);
            },
            function(err) {
                alert("Camera Error");
                console.log(err);
            }
        );
    }

    /**
     * records video from the webcam. TODO: Issue in Firefox
     * @param stream the webcam data stream
     */
TVLogic.prototype.recordVideo = function(stream){
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
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
    }

    /**
     * end the recording and open it in a new tab
     * TODO: save the recording to a /Home/Webcam directory
     */
TVLogic.prototype.endRecording = function(){
        this.recordRTC.stopRecording(function(videoURL) {
            window.open(videoURL);
        });
    }

TVLogic.prototype.playVideo = function(){
        if (this.video)
            this.video.play();
    }

TVLogic.prototype.pauseVideo = function(){
        if (this.video)
            this.video.pause();
    }

TVLogic.prototype.redrawButton = function(button_obj, button){
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

TVLogic.prototype.initOptions = function(){
        var that = this;
        var button_texture, temp_button;
        var BUTTON_WIDTH = 5, BUTTON_HEIGHT = 5, BASE_X = -25, BUTTON_Y = 18, BUTTON_Z = -1.1;

        this.buttons = [
            {img: 'forward.png', action: function(){}},
            {img: 'volon.png', next_img: 'mute.png', on:false, action: function(){
                this.video.muted = !this.on;
            }},
            {img: 'play.png', next_img: 'pause.png', on: false, action: function(){
                if (!this.on){
                    this.video.play();
                    this.isPlaying = true;
                }else{
                    this.video.pause();
                    this.isPlaying = false;
                }
            }},
            {img: 'back.png', action: function(){}},
            {img: 'record.png', next_img: 'recordon.png', on: false, action: function(){
                if (this.on){
                    that.endRecording();
                    that.recording = false;
                }else{
                    that.loadWebcam();
                    that.recording = true;
                }
            }}];
        this.play_buttons = [];

        this.play_panel = new THREE.Mesh(
            new THREE.PlaneGeometry(15.5*BUTTON_WIDTH, 1.7*BUTTON_HEIGHT, 10, 10),
            new THREE.MeshPhongMaterial({color: 0x555555}));
        this.play_panel.receiveShadow = true;
        this.play_panel.rotation.y = Math.PI;
        this.play_panel.position.set(BASE_X+14, BUTTON_Y, BUTTON_Z+0.1);
        this.play_panel.visible = false;
        CORE.intersectObjects.push(this.play_panel);
        this.modelElements.push(this.play_panel);
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
            this.modelElements.push(temp_button);
            this.play_buttons.push(temp_button);
            that.group.add(temp_button);
        }
    }
TVLogic.prototype.resetButtons = function(){
    for (var i = 0; i < this.buttons.length; i++){
        this.buttons[i].on = false;
        this.redrawButton(this.play_buttons[i], this.buttons[i]);
    }
}