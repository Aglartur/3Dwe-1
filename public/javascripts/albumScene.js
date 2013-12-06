/**
* Created by Peng on 11/28/13.
*/

var ALBUM = new ALBUM();

function ALBUM() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    var that = this;

    // private variables
    var albumFront;
    var albumBack;
    var frameLeftTop;
    var frameLeftBottom;
    var frameRightTop;
    var frameRightBottom;
    var floor;
    var light;

    var textureLeftTop;
    var textureLeftBottom;
    var textureRightTop;
    var textureRightBottom;

    var prevAction = 'forward';

    this.currentPhotoID = 0;

    var albumLoaded = false;
    var currentLeftTop = 0;

    var modelElements = [];

    this.isLoaded = false;
    this.group = new THREE.Object3D();

    this.photos = [];

    this.request = {LOADPHOTOS: 'loadphotos'};

    this.load = function ()
    {
        initGeometry();
        initLights();

        CORE.scene.add(that.group);
        that.group.position.set(-310, 83, 265);
        that.group.rotation.y = - Math.PI / 4;

        tryLoadPhotos();

        this.isLoaded = true;
    }

    function tryLoadPhotos ()
    {
        if (socketBusy)
        {
            console.log("I'm busy, photo album!!!");
            setTimeout(tryLoadPhotos, 500);
        }
        else
        {
            socketBusy = true;
            specialRequest = that.request.LOADPHOTOS;
            currentDirectory = '/home';
            openDir('Photos/numtiles');
        }
    }

    this.unload = function ()
    {
        CORE.disposeSceneElements(modelElements);

        navigate('/home');
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

        	if (intersects[0].object === albumL) {
                clickAlbum(intersects[0].object, true, 35);
            }
                

            if (intersects[0].object === frameLeftTop || intersects[0].object === frameLeftBottom ) {
                currentLeftTop = (that.photos.length + currentLeftTop - 4) % that.photos.length;
                console.log(currentLeftTop);
                flip_image(false, 35.5);
            }

            if (intersects[0].object === frameRightTop || intersects[0].object === frameRightBottom) {
                currentLeftTop = (currentLeftTop + 4) % that.photos.length;
                console.log(currentLeftTop);
                flip_image(true, 35.5);
            }

       	}
    }

    function initGeometry() {
        var loader = new THREE.JSONLoader();
        var callbackModel   = function( geometry, materials ) {
            albumL = CORE.loadModel( geometry, materials, 0, 4, 0, true);
            albumL.scale.set(2,2,2);
            albumL.rotation.z = Math.PI;

            modelElements.push(albumL);
            that.group.add(albumL);
        };
        loader.load( "/obj/album-cover-left.js", callbackModel );

        var callbackModel   = function( geometry, materials ) {
            albumR = CORE.loadModel( geometry, materials, 0, -2, 0, true);
            albumR.scale.set(2,2,2);
            modelElements.push(albumR);
            that.group.add(albumR);
        };
        loader.load( "/obj/album-cover-right.js", callbackModel );
    }

    this.initPhotos = function() 
    {
        currentLeftTop = -2;
        console.log("initPhotos");
        //frame texture
        textureLeftTop = new THREE.ImageUtils.loadTexture(getPhoto(0), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        textureLeftTop.wrapS = textureLeftTop.wrapT = THREE.RepeatWrapping;
        textureLeftTop.repeat.set(1, 1);
        textureLeftTop.needsUpdate = true;

        textureLeftBottom = new THREE.ImageUtils.loadTexture(getPhoto(1), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        textureLeftBottom.wrapS = textureLeftBottom.wrapT = THREE.RepeatWrapping;
        textureLeftBottom.repeat.set(1, 1);
        textureLeftBottom.needsUpdate = true;

        textureRightTop = new THREE.ImageUtils.loadTexture(getPhoto(2), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        textureRightTop.wrapS = textureLeftTop.wrapT = THREE.RepeatWrapping;
        textureRightTop.repeat.set(1, 1);
        textureRightTop.needsUpdate = true;

        textureRightBottom = new THREE.ImageUtils.loadTexture(getPhoto(3), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        textureRightBottom.wrapS = textureLeftTop.wrapT = THREE.RepeatWrapping;
        textureRightBottom.repeat.set(1, 1);
        textureRightBottom.needsUpdate = true;


        frameLeftTop =  new THREE.Mesh(
            new THREE.CubeGeometry(65, 1, 43),
            new THREE.MeshLambertMaterial({map: textureLeftTop, side:THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frameLeftTop.position.set(-1,1,22);
        frameLeftTop.rotation.z = Math.PI;
        frameLeftTop.castShadow = false;
        frameLeftTop.receiveShadow = false;
//        CORE.scene.add(frameLeftTop);
        CORE.intersectObjects.push(frameLeftTop);
        modelElements.push(frameLeftTop);
        that.group.add(frameLeftTop);

        frameLeftBottom = new THREE.Mesh(
            new THREE.CubeGeometry(65, 1, 43),
            new THREE.MeshLambertMaterial({map: textureLeftBottom, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frameLeftBottom.position.set(-1,1,-24);
        frameLeftBottom.rotation.z = Math.PI;
        frameLeftBottom.castShadow = false;
        frameLeftBottom.receiveShadow = false;
//        CORE.scene.add(frameLeftBottom);
        CORE.intersectObjects.push(frameLeftBottom);
        modelElements.push(frameLeftBottom);
        that.group.add(frameLeftBottom);

        frameRightTop = new THREE.Mesh(
            new THREE.CubeGeometry(65, 1, 43),
            new THREE.MeshLambertMaterial({map: textureRightTop, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frameRightTop.position.set(-1,2.11,22);
        frameRightTop.rotation.z = Math.PI;
        frameRightTop.castShadow = false;
        frameRightTop.receiveShadow = false;
//        CORE.scene.add(frameRightTop);
        CORE.intersectObjects.push(frameRightTop);
        modelElements.push(frameRightTop);
        that.group.add(frameRightTop);

        frameRightBottom = new THREE.Mesh(
            new THREE.CubeGeometry(65, 1, 43),
            new THREE.MeshLambertMaterial({map: textureRightBottom, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frameRightBottom.position.set(-1,2.11, -24);
        frameRightBottom.rotation.z = Math.PI;
        frameRightBottom.castShadow = false;
        frameRightBottom.receiveShadow = false;
//        CORE.scene.add(frameRightBottom);
        CORE.intersectObjects.push(frameRightBottom);
        modelElements.push(frameRightBottom);
        that.group.add(frameRightBottom);
    }
    function clickAlbum (object, forward, radius)
    {
        console.log("clickAlbum");
        var angle = Math.PI;
        
        var check = forward;
        if (check) {
            animateAlbum();
        }
        else {
            albumBack();
        }


        var startX = object.position.x;
        var startY = object.position.y;
        function animateAlbum()
        {
            if (angle >= 0)
            {
                object.position.x = radius + Math.cos(angle) * radius;
                object.position.y = Math.sin(angle) * radius;
                object.rotation.z = -angle;
                angle -= Math.PI/18;
                setTimeout(animateAlbum, 10);
            }
            else
            {
                object.position.y = -2;
            }
        }

        function albumBack()
        {
           if (angle >= - Math.PI)
            {
                object.position.x = radius + Math.cos(angle) * radius;
                object.position.y = -Math.sin(angle) * radius;
                object.rotation.z = -angle;

                angle = Math.PI/18;
                setTimeout(albumBack, 10);
                check = false;
            }
        }
    }

    function flip_image(forward, radius) {
        textureRightTop = new THREE.ImageUtils.loadTexture(getPhoto(2), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        textureRightBottom = new THREE.ImageUtils.loadTexture(getPhoto(3), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        textureLeftTop = new THREE.ImageUtils.loadTexture(getPhoto(0), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        textureLeftBottom = new THREE.ImageUtils.loadTexture(getPhoto(1), {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        });

        frameLeftTop.material = new THREE.MeshLambertMaterial({map: textureLeftTop});
        frameLeftBottom.material = new THREE.MeshLambertMaterial({map: textureLeftBottom});
        frameRightTop.material = new THREE.MeshLambertMaterial({map: textureRightTop});
        frameRightBottom.material = new THREE.MeshLambertMaterial({map: textureRightBottom});

        var angle = 0;
        if (forward)
            animateFrame();
        else
            animateBack();

        function animateFrame()
        {
            if (angle <= Math.PI)
            {
                frameLeftTop.position.x = radius - Math.cos(angle) * radius;
                frameLeftTop.position.y = Math.sin(angle) * radius + 3;
                frameLeftTop.rotation.z = -angle;
                frameLeftBottom.position.x = radius - Math.cos(angle) * radius;
                frameLeftBottom.position.y = Math.sin(angle) * radius + 3;
                frameLeftBottom.rotation.z = -angle;
                angle += Math.PI/18;
                setTimeout(animateFrame, 10);
            }
        }

        function animateBack()
        {
            if (angle >= -Math.PI)
            {
                frameRightTop.position.x = radius + Math.cos(angle) * radius;
                frameRightTop.position.y = -Math.sin(angle) * radius + 3;
                frameRightTop.rotation.z = -angle;
                frameRightBottom.position.x = radius + Math.cos(angle) * radius;
                frameRightBottom.position.y = -Math.sin(angle) * radius + 3;
                frameRightBottom.rotation.z = -angle;

                angle -= Math.PI/18;
                setTimeout(animateBack, 10);
            }
        }
    }

  	function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 500, 0);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
        modelElements.push(light);
    }

    function getPhoto(offset)
    {
        return that.photos[(that.photos.length + currentLeftTop + offset) % that.photos.length];
    }
}