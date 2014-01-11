/**
 * Created by Aibek on 11.01.14.
 */

function SonyTV() {
    // Call the parent constructor
    Item.call(this);

    this.TV_set;
    this.screen;
    this.video;
    this.videoTexture;

    this.initGeometry();

    console.log(this.videoTexture);
    this.logic = new TVLogic(this.object, this.TV_set, this.screen, this.video, this.videoTexture);
    this.logic.loadScreen(); //load screen material

    this.load();
}

// inherit Item
SonyTV.prototype = new Item();

// correct the constructor pointer because it points to Item
SonyTV.prototype.constructor = Item;

SonyTV.prototype.initGeometry = function() {
    var that = this;
    var loader = new THREE.JSONLoader();
    var callbackModel   = function( geometry, materials ) {
        that.TV_set = CORE.loadModel( geometry, materials, 0, 0, 0, false );
        that.object.add(that.TV_set);
    };
    loader.load( "/obj/tv.js", callbackModel );

    var WIDTH = 78, HEIGHT = 43;
    that.screen = new THREE.Mesh(
        new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10),
        new THREE.MeshPhongMaterial({color: 0xFFFFFF}));
    that.screen.receiveShadow = true;
    that.screen.rotation.y = Math.PI;
    that.screen.position.x = -11;                  // align to screen
    that.screen.position.z = -1;                   // move in front
    that.screen.position.y = 35;                   // move it up
    CORE.intersectObjects.push(that.screen);
    that.object.add(that.screen);

    that.video = document.createElement('video');
    that.video.width = WIDTH;
    that.video.height = HEIGHT;

    that.videoTexture = new THREE.Texture(that.video);
}
