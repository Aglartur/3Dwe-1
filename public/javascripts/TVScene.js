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

    var isPlaying = false;
    var loop = false;

    var floor;
    var light, pointLight;

    var modelElements = [];

    this.isLoaded = false;

    this.TV_set;

    this.load = function ()
    {
        initGeometry();
        initLights();

        currentDirectory = '/home';
        openDir('videos');

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

        pointLight = new THREE.PointLight(0x55557f, 4, 150);
        pointLight.position.set(-30,20,-40);
        CORE.scene.add(pointLight);
        modelElements.push(pointLight);
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

    var rotateView = 0, flyTo = 0;

    this.flyToObject = function(event){
        if (event.keyCode === 73){
            if (rotateView !== 0 || flyTo !== 0) return;
            CORE.freezeCamera(true);
            //CORE.camera.position.set(-11.1, 35.12, -39.13);
            //CORE.camera.position.set(-11 + 78/2, 35 + 43/2, -40);
            //CORE.camera.rotation.set(-Math.PI, 0, -Math.PI);

            var X_FINAL = -11.1, Y_FINAL = 35.12, Z_FINAL = -39.13;
            var xGreater = CORE.camera.position.x > X_FINAL,
                yGreater = CORE.camera.position.y > Y_FINAL,
                zGreater = CORE.camera.position.z > Z_FINAL;
            var speed = 2;

            CORE.camera.rotation.set(-Math.PI, 0, -Math.PI);

            flyTo = setInterval(function(){
                var noXChange = false, noYChange = false, noZChange = false;
                if (CORE.camera.position.x > X_FINAL && xGreater)
                    CORE.camera.position.x-=speed;
                else if (CORE.camera.position.x < X_FINAL && !xGreater)
                    CORE.camera.position.x+=speed;
                else
                    noXChange = true;

                if (CORE.camera.position.y > Y_FINAL && yGreater)
                    CORE.camera.position.y-=speed;
                else if (CORE.camera.position.y < Y_FINAL && !yGreater)
                    CORE.camera.position.y+=speed;
                else
                    noYChange = true;

                if (CORE.camera.position.z > Z_FINAL && zGreater)
                    CORE.camera.position.z-=speed;
                else if (CORE.camera.position.z < Z_FINAL && !zGreater)
                    CORE.camera.position.z+=speed;
                else
                    noZChange = true;

                if (noXChange && noYChange && noZChange){
                    clearInterval(flyTo);
                    flyTo = 0;
                }
            }, 50);
        }
    }
}