/**
 * Created by Aibek on 11/2/13.
 */

var renderer;

$(document).ready(function () {

    fun();

// important stuff: renderer - it shows everything and is appended to HTML


// important stuff: camera - where to look
    var camera;

// important stuff: scene - you add everything to it
    var scene;

    var projector;

// objects that can be clicked
    var objects;

// variable for stationary cube in the center
    var cube;

// make the "room"
    var floor, wall1, wall2, wall3, wall4;

// photo album
    var albumL, albumR, page;

// main light
    var light;

// rotating light
    var rotatingLight;

// used when resizing windows and moving mouse, i.e. rotating camera
    var windowHalfX, windowHalfY;
    var mouseX, mouseY;


// array of pictures from picture folder
    var picArray;

    var zoom;
    var fov;
    var zoomin = true;
    var target;

    function fun() {
        // initialize everything
        init();
//                setInterval(function(){zoomInCamera()}, 25);
        render();
    }

    function init() {
        // get center of the screen (half of the width/height)
//        windowHalfX = window.innerWidth / 2;
//        windowHalfY = window.innerHeight / 2;

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

        windowHalfX = $('#viewer').width() / 2;
        windowHalfY =  $('#viewer').height() / 2;

        // initialize mouseX and mouseY
        mouseX = 0;
        mouseY = 0;

        // add mouse move listener (remember we heard about it in class?)
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);


        //##########################################################################
        //                           WebGL starts here!
        //##########################################################################

        // NOTE: coordinate system in WebGL:
        // x - left/right
        // y - up/down                <-- vertical
        // z - forward/backward

        // initializing renderer - used to display entire WebGL thing in the browser
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize($('#viewer').width(), $('#viewer').height());    // take up entire space
        renderer.shadowMapEnabled = true;                           // enable shadows


        $('#viewer').html(renderer.domElement);
//        $('#viewer').add(renderer.domElement);             // add renderer to HTML


        // initializing camera - used to show stuff

        camera = new THREE.PerspectiveCamera(60, $('#viewer').width() / $('#viewer').height(), 1, 10000);       // don't worry about parameters
        camera.position.set(0, 300, 100);
        zoom = 1;
        fov = camera.fov;
        target = new THREE.Vector3(0, 0, 0);


        // finally initializing scene - you'll be adding stuff to it
        scene = new THREE.Scene();

        // projector is used for tracing where you click
        projector = new THREE.Projector();

        // initializing array for objects being clicked
        objects = new Array()

        // initializing every part of the WebGL - initGUI is optional (that's another library)
        initGeometry();
        initLights();
        //initGUI();                  // gives you little box in the top right corner to manipulate size of the cube
        target.add(target);
    }

    function initGeometry() {
        
        //floor texture
        floorTexture = new THREE.ImageUtils.loadTexture('/images/cover.png', {}, function(){
            renderer.render(scene, camera);
        }); 

        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1, 1);
        floorTexture.needsUpdate = true;

        //floor texture
        albumTexture = new THREE.ImageUtils.loadTexture('/images/leather.png', {}, function(){
            renderer.render(scene, camera);
        }); 

        albumTexture.wrapS = albumTexture.wrapT = THREE.RepeatWrapping;
        albumTexture.repeat.set(1, 1);
        albumTexture.needsUpdate = true;

        //sidewall texture
        sidewallTexture = new THREE.ImageUtils.loadTexture('/images/bluewall.png', {}, function(){
            renderer.render(scene, camera);
        }); 

        sidewallTexture.wrapS = sidewallTexture.wrapT = THREE.RepeatWrapping;
        sidewallTexture.repeat.set(1, 1);
        sidewallTexture.needsUpdate = true;    

        //frontwall texture
        frontwallTexture = new THREE.ImageUtils.loadTexture('/images/frontwall.png', {}, function(){
            renderer.render(scene, camera);
        }); 

        frontwallTexture.wrapS = frontwallTexture.wrapT = THREE.RepeatWrapping;
        frontwallTexture.repeat.set(1, 1);
        frontwallTexture.needsUpdate = true;


        //frame texture
        frameTexture1 = new THREE.ImageUtils.loadTexture('/pic_uploads/' + picArray[picArray.length-1], {}, function(){
            renderer.render(scene, camera);
        }); 

        frameTexture1.wrapS = frameTexture1.wrapT = THREE.RepeatWrapping;
        frameTexture1.repeat.set(1, 1);
        frameTexture1.needsUpdate = true;

        frameTexture2 = new THREE.ImageUtils.loadTexture('/pic_uploads/' + picArray[picArray.length-2], {}, function(){
            renderer.render(scene, camera);
        }); 

        frameTexture2.wrapS = frameTexture2.wrapT = THREE.RepeatWrapping;
        frameTexture2.repeat.set(1, 1);
        frameTexture2.needsUpdate = true;



        //album cover 1
        albumL = new THREE.Mesh(
            new THREE.CubeGeometry(50, 3, 75),
            new THREE.MeshLambertMaterial({map: albumTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        albumL.position.set(0,5,0);
        albumL.castShadow = false;
        albumL.receiveShadow = false;
        scene.add(albumL);
       objects.push(albumL);


       //album cover 2
        albumR = new THREE.Mesh(
            new THREE.CubeGeometry(50, 3, 75),
            new THREE.MeshLambertMaterial({map: albumTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        albumR.position.set(0,0,0);
        albumR.castShadow = false;
        albumR.receiveShadow = false;
        scene.add(albumR);
       // objects.push(albumR);


        frame =  new THREE.Mesh(
            new THREE.CubeGeometry(46, 1, 35),
            new THREE.MeshLambertMaterial({map: frameTexture1, side:THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frame.position.set(0,2,19);
        frame.castShadow = false;
        frame.receiveShadow = false;
        scene.add(frame);
        objects.push(frame);

        // frame1 = new THREE.Mesh(
        //     new THREE.CubeGeometry(46, 1, 35),
        //     new THREE.MeshLambertMaterial({map: frameTexture1, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        // frame1.position.set(0,4,-17);
        // frame1.castShadow = false;
        // frame1.receiveShadow = false;
        // scene.add(frame1);
        // objects.push(frame1);

        frame2 = new THREE.Mesh(
            new THREE.CubeGeometry(46, 1, 35),
            new THREE.MeshLambertMaterial({map: frameTexture2, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));
        frame2.position.set(0,2,-17);
        frame2.castShadow = false;
        frame2.receiveShadow = false;
        scene.add(frame2);
        objects.push(frame2);

        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1024, 1024, 10, 10),
            new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        scene.add(floor);

        // since we will be adding similar walls, we can reuse the geometry and material
        var wallGeometry = new THREE.PlaneGeometry(1024, 1024, 10, 10);
        var sidewallMaterial = new THREE.MeshPhongMaterial({map: sidewallTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0});
        var frontwallMaterial = new THREE.MeshPhongMaterial({map: frontwallTexture, side: THREE.DoubleSide, transparent: true, opacity: 1.0});


        // here is a wall, by default planes are vertical
        wall1 = new THREE.Mesh(wallGeometry, sidewallMaterial);
        wall1.receiveShadow = true;
        wall1.position.z = -250;                // move it back
        scene.add(wall1);

        // here is a wall, by default planes are vertical
        wall2 = new THREE.Mesh(wallGeometry, sidewallMaterial);
        wall2.receiveShadow = true;
        wall2.rotation.y = Math.PI / 2;         // rotate to get perpendicular wall
        wall2.position.x = -250;                // move it left
        scene.add(wall2);

        // here is a wall, by default planes are vertical
        wall3 = new THREE.Mesh(wallGeometry, sidewallMaterial);
        wall3.position.x = 250;                 // move it right
        wall3.rotation.y = -Math.PI / 2;       // rotate to get perpendicular wall
        wall3.receiveShadow = false;
        scene.add(wall3);

        // here is a wall, by default planes are vertical
        wall4 = new THREE.Mesh(wallGeometry, frontwallMaterial);
        wall4.position.z = 250;                 // move it front
        wall4.rotation.y = Math.PI;             // rotate it 180 degrees, so the "front" will face towards us,
        // otherwise we will "look through" the plane
        wall4.receiveShadow = false;
        scene.add(wall4);





        // feel free to add new stuff or change existing and play around with it!
        // you can comment out scene.add() to remove anything from viewport
    }

// lights tutorial - there has to be light in the scene
    function initLights() {
        // main light - we put on top, y = 500
        light = new THREE.PointLight();
        light.position.set(0, 500, 0);
        light.intensity = 1.0;
        // light.castShadow = true;
        scene.add(light);

        // rotating light that will orbit the cube
        rotatingLight = new THREE.SpotLight();
        rotatingLight.position.set(100, 75, -100);
        rotatingLight.castShadow = true;
        scene.add(rotatingLight);
    }

// little nice GUI from dat.GUI library
// we don't need this, but you can experiment with it
    function initGUI() {
        gui = new dat.GUI();
        gui.add(cube.scale, 'x').min(0.1).max(10).step(0.1);
        gui.add(cube.scale, 'y', 0.1, 10, 0.1);
        gui.add(cube.scale, 'z', 0.1, 10, 0.1);
    }

// knowing where the center is, and some other non-important stuff
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

// when we move mouse, this gets called (remember mouse events in class?) - we added listener before
    function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;
    }


// function that makes everything move around!
    function animate(t) {
        // spin the camera in a circle - before using, comment out the same stuff in render()
        // camera.position.x = Math.sin(t/1000)*150;
        // camera.position.y = 150;
        // camera.position.z = Math.cos(t/1000)*150;


        // updating the animation
        window.requestAnimationFrame(animate, renderer.domElement);

        // show stuff
        // render();
    };

    function zoomInCamera() {
        if (camera.position.distanceTo(target) > 60) {
            var offset = new THREE.Vector3(0, 0, 0);
            var dist = camera.position.distanceTo(target);
            offset.add(camera.position);
            offset.x += (target.x - camera.position.x) / (dist / 10);
            offset.y += (target.y - camera.position.y) / (dist / 10);
            offset.z += (target.z - camera.position.z) / (dist / 10);
            camera.position = offset;
            render();
        }

    }

    function zoomOutCamera() {
        var offset = new THREE.Vector3(0, 0, 0);
        var dist = camera.position.distanceTo(target);
        offset.add(camera.position);
        offset.x -= (target.x - camera.position.x) / (dist / 10);
        offset.y -= (target.y - camera.position.y) / (dist / 10);
        offset.z -= (target.z - camera.position.z) / (dist / 10);
        camera.position.set(offset.x, offset.y, offset.z);
        render();
    }

// used to show stuff, also updates the camera
    function render() {
        // horizontal mouse move is used to rotate around center
        // vertical mouse move is used to move up and down
        // camera.position.x = Math.sin(mouseX/100)*150;
        // camera.position.z = Math.cos(mouseX/100)*150;
        // camera.position.y = 200 + mouseY/2;


        // tell camera to look at the center of the scene

        camera.lookAt(target);


        // use animation
        // animate(new Date().getTime());


        // you can use vector to tell specific location like this:
        // camera.lookAt(new THREE.Vector3(0,0,0));

        // finally render the scene, via the camera you specified
        renderer.render(scene, camera);
    }

    function rotateCameraLeft() {
        var offset = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 100);
        offset.add(camera.position);

        target = offset;
        camera.lookAt(target);
        render();
    }

    function rotateCameraRight() {
        var offset = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 100);
        offset.add(camera.position);

        target = offset;
        camera.lookAt(target);
        render();
    }

    function rotateCameraUp() {
        var offset = new THREE.Vector3(0, 0, 0);
        var rotationAxis = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        rotationAxis.crossVectors(offset, new THREE.Vector3(0, 1, 0)).normalize();
        offset.applyAxisAngle(rotationAxis, Math.PI / 72);
        offset.add(camera.position);

        target = offset;

        camera.lookAt(target);
        render();
    }

    function rotateCameraDown() {
        var offset = new THREE.Vector3(0, 0, 0);
        var rotationAxis = new THREE.Vector3(0, 0, 0);
        offset.add(target);
        offset.sub(camera.position);
        rotationAxis.crossVectors(offset, new THREE.Vector3(0, 1, 0)).normalize();
        offset.applyAxisAngle(rotationAxis, -Math.PI / 72);
        offset.add(camera.position);

        target = offset;
        camera.lookAt(target);
        render();
    }

//function moveCameraForward()
//{
//    var offset = new THREE.Vector3(0,0,0);
//    var dist = camera.position.distanceTo(target);
//    offset.add(camera.position);
//    offset.x -= (target.x - camera.position.x) / (dist / 10);
//    offset.y -= (target.y - camera.position.y) / (dist / 10);
//    offset.z -= (target.z - camera.position.z) / (dist / 10);
//    camera.position.set(offset.x, offset.y, offset.z);
//    render();
//}


    document.onkeypress = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        var s = String.fromCharCode(key);
        if (s == 'w')
            zoomInCamera();
        else if (s == 's')
            zoomOutCamera();
        else if (s == 'a')
            rotateCameraLeft();
        else if (s == 'd')
            rotateCameraRight();
    }

    document.onkeydown = function (event) {
        var key = event.keyCode ? event.keyCode : event.which;
        if (key == 38)
            rotateCameraUp();
        else if (key == 40)
            rotateCameraDown();
        else if (key == 37)
            rotateCameraLeft();
        else if (key == 39)
            rotateCameraRight();
    }

    function onDocumentMouseDown(event) {

        // event.preventDefault();

        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(objects);

        // if you clicked on something
        if (intersects.length > 0) {
            // here is the object that was clicked, you can call a function and pass it as a parameter
           // intersects[ 0 ].object.material.color.setHex(Math.random() * 0xffffff);

            if (intersects[0].object === albumL) {
                clickAlbum(intersects[0].object, 25);
            }
                

            if (intersects[0].object === frame || intersects[0].object === frame2) {
                show_image(intersects[0].object, current++, 25);
               // show_image2(intersects[0].object, current++, 25);
            }
                        
        }

        
    }

    var current = 0;

    function clickAlbum (object, radius)
    {
        var angle = 0;
        animateAlbum();
        var startX = object.position.x;
        var startY = object.position.y;
        function animateAlbum()
        {
            if (angle <= Math.PI)
            {
                object.position.x = radius - Math.cos(angle) * radius; 
                object.position.y = Math.sin(angle) * radius;
                object.rotation.z = -angle;
                angle += Math.PI/18;
                render();
                setTimeout(animateAlbum, 10);
            }
        }
    }

    function show_image(object, num, radius) {
        frameTexture1 = new THREE.ImageUtils.loadTexture('/pic_uploads/' + picArray[num % picArray.length], {}, function(){
            renderer.render(scene, camera);
        }); 
        frameTexture2 = new THREE.ImageUtils.loadTexture('/pic_uploads/' + picArray[num % picArray.length], {}, function(){
            renderer.render(scene, camera);
        });
        object.material = new THREE.MeshLambertMaterial({map: frameTexture1});

        var angle = 0;
        animateFrame();
        var startX = object.position.x;
        var startY = object.position.y;
        function animateFrame()
        {
            // object.position.x = startX;
            // object.position.y = startY;
            if (angle <= Math.PI)
            {
                object.position.x = radius - Math.cos(angle) * radius; 
                object.position.y = Math.sin(angle) * radius + 3;
                object.rotation.z = -angle;
                angle += Math.PI/18;
                render();
                setTimeout(animateFrame, 10);
            }

        }
            object.position.x = startX;
            object.position.y = startY;
    }

});