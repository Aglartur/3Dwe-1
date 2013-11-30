/**
* Created by Peng on 11/28/13.
*/

var ALBUM = new ALBUM();

function ALBUM() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var albumFront;
    var albumBack;
    var frameRight1;
    var frameLeft1;
    var frameRight2;
    var frameLeft2;
    var floor;
    var light;


    //array of pics
        picArray = new Array();
        picArray.push('penguins.jpg');
        picArray.push('koala.jpg');
        picArray.push('desert.jpg');
        picArray.push('Jellyfish.jpg');
        picArray.push('chrysanthemum.jpg');
        picArray.push('lighthouse.jpg');
        picArray.push('tulips.jpg');
        picArray.push('hydrangeas.jpg');

    var albumLoaded = false;
    var current = 0;

    var modelElements = [];

    this.isLoaded = false;

    this.load = function ()
    {
        initGeometry();
        initLights();

        // CORE.freezeCamera(true);
        // CORE.camera.position.set(45, 80, -65);
        // CORE.camera.rotation.set(-2.09, 0, -Math.PI);

        // currentDirectory = '/home';
        // openDir('Photos');

        this.isLoaded = true;
    }

    this.unload = function ()
    {
        CORE.disposeSceneElements(modelElements);

        // navigate('/home');
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

       	}
    }

    function initGeometry() {

    	//floor texture
        floorTexture = new THREE.ImageUtils.loadTexture('/images/cover.png', {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1, 1);
        floorTexture.needsUpdate = true;

        //album texture
        albumTexture = new THREE.ImageUtils.loadTexture('/images/leather.png', {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        albumTexture.wrapS = albumTexture.wrapT = THREE.RepeatWrapping;
        albumTexture.repeat.set(1, 1);
        albumTexture.needsUpdate = true;

        //sidewall texture
        sidewallTexture = new THREE.ImageUtils.loadTexture('/images/bluewall.png', {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        sidewallTexture.wrapS = sidewallTexture.wrapT = THREE.RepeatWrapping;
        sidewallTexture.repeat.set(1, 1);
        sidewallTexture.needsUpdate = true;    

        //frontwall texture
        frontwallTexture = new THREE.ImageUtils.loadTexture('/images/frontwall.png', {}, function(){
            CORE.renderer.render(CORE.scene, CORE.camera);
        }); 

        frontwallTexture.wrapS = frontwallTexture.wrapT = THREE.RepeatWrapping;
        frontwallTexture.repeat.set(1, 1);
        frontwallTexture.needsUpdate = true;


        //frame texture
        frameTexture1 = new THREE.ImageUtils.loadTexture('/home/Photos' + picArray[Math.floor((Math.random() * picArray.length))], {}, function(){
            CORE.renderer.render(scene, camera);
        }); 

        frameTexture1.wrapS = frameTexture1.wrapT = THREE.RepeatWrapping;
        frameTexture1.repeat.set(1, 1);
        frameTexture1.needsUpdate = true;

        frameTexture2 = new THREE.ImageUtils.loadTexture('/home/Photos' + picArray[Math.floor((Math.random() * picArray.length))], {}, function(){
            CORE.renderer.render(scene, camera);
        }); 

        frameTexture2.wrapS = frameTexture2.wrapT = THREE.RepeatWrapping;
        frameTexture2.repeat.set(1, 1);
        frameTexture2.needsUpdate = true;

        frameTexture3 = new THREE.ImageUtils.loadTexture('/home/Photos' + picArray[Math.floor((Math.random() * picArray.length))], {}, function(){
            CORE.renderer.render(scene, camera);
        }); 

        frameTexture3.wrapS = frameTexture1.wrapT = THREE.RepeatWrapping;
        frameTexture3.repeat.set(1, 1);
        frameTexture3.needsUpdate = true;

        frameTexture4 = new THREE.ImageUtils.loadTexture('/home/Photos' + picArray[Math.floor((Math.random() * picArray.length))], {}, function(){
            CORE.renderer.render(scene, camera);
        }); 

        frameTexture4.wrapS = frameTexture1.wrapT = THREE.RepeatWrapping;
        frameTexture4.repeat.set(1, 1);
        frameTexture4.needsUpdate = true;



        //album cover 1
        albumL = new THREE.Mesh(
            new THREE.CubeGeometry(50, 3, 75),
            new THREE.MeshLambertMaterial({map: albumTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        albumL.position.set(0,5,0);
        albumL.castShadow = false;
        albumL.receiveShadow = false;
        CORE.scene.add(albumL);
        CORE.intersectObjects.push(albumL);
        modelElements.push(albumL);


       //album cover 2
        albumR = new THREE.Mesh(
            new THREE.CubeGeometry(50, 3, 75),
            new THREE.MeshLambertMaterial({map: albumTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        albumR.position.set(0,0,0);
        albumR.castShadow = false;
        albumR.receiveShadow = false;
        CORE.scene.add(albumR);
        CORE.intersectObjects.push(albumR);
        modelElements.push(albumR);


        frame =  new THREE.Mesh(
            new THREE.CubeGeometry(46, 1, 35),
            new THREE.MeshLambertMaterial({map: frameTexture1, side:THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frame.position.set(0,2,19);
        frame.castShadow = false;
        frame.receiveShadow = false;
        CORE.scene.add(frame);
        CORE.intersectObjects.push(frame);
        modelElements.push(frame);

        frame2 = new THREE.Mesh(
            new THREE.CubeGeometry(46, 1, 35),
            new THREE.MeshLambertMaterial({map: frameTexture2, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frame2.position.set(0,2,-17);
        frame2.castShadow = false;
        frame2.receiveShadow = false;
        CORE.scene.add(frame2);
        CORE.intersectObjects.push(frame2);
        modelElements.push(frame2);

        frame3 = new THREE.Mesh(
            new THREE.CubeGeometry(46, 1, 35),
            new THREE.MeshLambertMaterial({map: frameTexture3, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frame3.position.set(0,2,19);
        frame3.castShadow = false;
        frame3.receiveShadow = false;
        CORE.scene.add(frame3);
        CORE.intersectObjects.push(frame3);
        modelElements.push(frame3);

        frame4 = new THREE.Mesh(
            new THREE.CubeGeometry(46, 1, 35),
            new THREE.MeshLambertMaterial({map: frameTexture4, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frame4.position.set(0,2, -17);
        frame4.castShadow = false;
        frame4.receiveShadow = false;
        CORE.scene.add(frame4);
        CORE.intersectObjects.push(frame4);
        modelElements.push(frame4);



        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1024, 1024, 10, 10),
            new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        CORE.scene.add(floor);
        modelElements.push(floor);

        // since we will be adding similar walls, we can reuse the geometry and material
        var wallGeometry = new THREE.PlaneGeometry(1024, 1024, 10, 10);
        var sidewallMaterial = new THREE.MeshPhongMaterial({map: sidewallTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0});
        var frontwallMaterial = new THREE.MeshPhongMaterial({map: frontwallTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0});


        // here is a wall, by default planes are vertical
        wall1 = new THREE.Mesh(wallGeometry, sidewallMaterial);
        wall1.receiveShadow = true;
        wall1.position.z = -250;                // move it back
        CORE.scene.add(wall1);
        modelElements.push(wall1);

        // here is a wall, by default planes are vertical
        wall2 = new THREE.Mesh(wallGeometry, sidewallMaterial);
        wall2.receiveShadow = true;
        wall2.rotation.y = Math.PI / 2;         // rotate to get perpendicular wall
        wall2.position.x = -250;                // move it left
        CORE.scene.add(wall2);
        modelElements.push(wall2);

        // here is a wall, by default planes are vertical
        wall3 = new THREE.Mesh(wallGeometry, sidewallMaterial);
        wall3.position.x = 250;                 // move it right
        wall3.rotation.y = -Math.PI / 2;       // rotate to get perpendicular wall
        wall3.receiveShadow = false;
        CORE.scene.add(wall3);
        modelElements.push(wall3);

        // here is a wall, by default planes are vertical
        wall4 = new THREE.Mesh(wallGeometry, frontwallMaterial);
        wall4.position.z = 250;                 // move it front
        wall4.rotation.y = Math.PI;             // rotate it 180 degrees, so the "front" will face towards us,
        // otherwise we will "look through" the plane
        wall4.receiveShadow = false;
        CORE.scene.add(wall4);
        modelElements.push(wall4);
    }

  	function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 500, 0);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
        modelElements.push(light);
    }
}