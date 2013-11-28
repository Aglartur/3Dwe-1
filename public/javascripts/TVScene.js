/**
 * Created by Sean on 11/27/13.
 */

var TVObject = new TVObject();

function TVObject() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var that = this;        // to reference JUKEBOX inside function that override 'this'
    var TV_set, screen;

    var video, videoTexture;

    var isPlaying = false;
    var loop = false;

    var floor;
    var light, pointLight;

    modelElements = [];

    this.isLoaded = false;

    this.load = function ()
    {
        initGeometry();
        initLights();

        currentDirectory = '/home';
        openDir('videos');

        modelElements.push(TV_set);
        modelElements.push(screen);
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

        CORE.scene.remove(TV_set);
        CORE.scene.remove(screen);
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
            if (object === screen)
            {
                if (!isPlaying)
                {
                    video.play();
                }
                else
                {
                    video.pause();
                }
                isPlaying = !isPlaying;
            }
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

        var loader = new THREE.JSONLoader(),
            callbackModel   = function( geometry, materials ) { TV_set = CORE.loadModel( geometry, materials, 0, 0, 0, false ) };
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

        pointLight = new THREE.PointLight(0x55557f, 4, 150);
        pointLight.position.set(-30,20,-40);
        CORE.scene.add(pointLight);
    }

    this.renderVideo = function() {
        if (video.readyState === video.HAVE_ENOUGH_DATA){
            videoTexture.needsUpdate = true;
        }
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
}