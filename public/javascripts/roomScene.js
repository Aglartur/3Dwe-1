/**
 * Created by Aibek on 11/26/13.
 */

var ROOM = new ROOM();

function ROOM() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    // variable for shelves
    var shelf1, shelf2, shelf3, shelf4;
    // variable for light wood texture for the shelves
    var lightWoodTexture;

    // variable for table
    var table;
    // variable for black wood texture for the table
    var balckWoodTexture;

    // make the "room"
    var floor, wall1, wall2, wall3, wall4;

    // main light
    var light;

    this.isLoaded = false;

    this.load = function ()
    {
        initGeometry();
        initLights();

        this.isLoaded = true;
    }

    this.unload = function ()
    {
        CORE.scene.remove(floor);
        CORE.scene.remove(light);
        CORE.scene.remove(wall1);
        CORE.scene.remove(wall2);
        CORE.scene.remove(wall3);
        CORE.scene.remove(wall4);

        CORE.scene.remove(shelf1);
        CORE.scene.remove(shelf2);
        CORE.scene.remove(shelf3);
        CORE.scene.remove(shelf4);

        CORE.scene.remove(table);

        CORE.intersectObjects.splice(jQuery.inArray(table), 1);
        CORE.intersectObjects.splice(jQuery.inArray(shelf1), 1);
        CORE.intersectObjects.splice(jQuery.inArray(shelf2), 1);
        CORE.intersectObjects.splice(jQuery.inArray(shelf3), 1);
        CORE.intersectObjects.splice(jQuery.inArray(shelf4), 1);

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
            object.material.color.setHex(Math.random() * 0xffffff);
        }
    }

    function initGeometry()
    {
        lightWoodTexture = new THREE.ImageUtils.loadTexture('/images/light-wood.jpg', {}, function () {
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        lightWoodTexture.wrapS = lightWoodTexture.wrapT = THREE.RepeatWrapping;
        lightWoodTexture.repeat.set(1, 1);
        var lightWoodMaterial = new THREE.MeshLambertMaterial({map: lightWoodTexture});

        shelf1 = new THREE.Mesh(
            new THREE.CubeGeometry(100,5,400),                           // supply size of the cube
            new THREE.MeshLambertMaterial({map: lightWoodTexture}));          // supply color of the cube
        shelf1.position.set(500-50, 150, 0);
        shelf1.castShadow = true;
        shelf1.receiveShadow = true;
        CORE.scene.add(shelf1);
        CORE.intersectObjects.push(shelf1);

        shelf2 = new THREE.Mesh(
            new THREE.CubeGeometry(100,5,400),                           // supply size of the cube
            new THREE.MeshLambertMaterial({map: lightWoodTexture}));          // supply color of the cube
        shelf2.position.set(500-50, 200, 0);
        shelf2.castShadow = true;
        shelf2.receiveShadow = true;
        CORE.scene.add(shelf2);
        CORE.intersectObjects.push(shelf2);

        shelf3 = new THREE.Mesh(
            new THREE.CubeGeometry(100,5,400),                           // supply size of the cube
            new THREE.MeshLambertMaterial({map: lightWoodTexture}));          // supply color of the cube
        shelf3.position.set(500-50, 250, 0);
        shelf3.castShadow = true;
        shelf3.receiveShadow = true;
        CORE.scene.add(shelf3);
        CORE.intersectObjects.push(shelf3);

        shelf4 = new THREE.Mesh(
            new THREE.CubeGeometry(100,5,400),                           // supply size of the cube
            new THREE.MeshLambertMaterial({map: lightWoodTexture}));          // supply color of the cube
        shelf4.position.set(500-50, 300, 0);
        shelf4.castShadow = true;
        shelf4.receiveShadow = true;
        CORE.scene.add(shelf4);
        CORE.intersectObjects.push(shelf4);

        blackWoodTexture = new THREE.ImageUtils.loadTexture('/images/black-wood.png', {}, function () {
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        blackWoodTexture.wrapS = blackWoodTexture.wrapT = THREE.RepeatWrapping;
        blackWoodTexture.repeat.set(1, 1);
        var blackWoodMaterial = new THREE.MeshLambertMaterial({map: blackWoodTexture});

        table = new THREE.Mesh(
            new THREE.CubeGeometry(50,75,300),                           // supply size of the cube
            new THREE.MeshLambertMaterial({map: blackWoodTexture}));          // supply color of the cube
        table.position.set(500-25, (75/2), 0);
        table.castShadow = true;
        table.receiveShadow = true;
        CORE.scene.add(table);
        CORE.intersectObjects.push(table);

        floorTexture = new THREE.ImageUtils.loadTexture('/images/floor-texture.jpg', {}, function () {
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1, 1);
        var floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture});

        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 10, 10),
            new THREE.MeshLambertMaterial({map: floorTexture}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = - Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = 0;                                   // move it a little, to match bottom of the cube
        CORE.scene.add(floor);

        // since we will be adding similar walls, we can reuse the geometry and material
        var wallGeometry = new THREE.PlaneGeometry(1000, 500, 10, 10);
        var wallMaterial = new THREE.MeshPhongMaterial({color: 0x33CCCC});

        // here is a wall, by default planes are vertical
        wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall1.receiveShadow = true;
        wall1.position.z = -500;                // move it back
        wall1.position.y = 250;             // move it up
        CORE.scene.add(wall1);

        // here is a wall, by default planes are vertical
        wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall2.receiveShadow = true;
        wall2.rotation.y = Math.PI / 2;         // rotate to get perpendicular wall
        wall2.position.x = -500;                // move it left
        wall2.position.y = 250;             // move it up
        CORE.scene.add(wall2);

        // here is a wall, by default planes are vertical
        wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall3.position.x = 500;                 // move it right
        wall3.position.y = 250;                 // move it up
        wall3.rotation.y = - Math.PI / 2;       // rotate to get perpendicular wall
        wall3.receiveShadow = true;
        CORE.scene.add(wall3);

        // here is a wall, by default planes are vertical
        wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall4.position.z = 500;                 // move it front
        wall4.position.y = 250;                 //move it up
        wall4.rotation.y = Math.PI;             // rotate it 180 degrees, so the "front" will face towards us,
        wall4.receiveShadow = true;
        CORE.scene.add(wall4);
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set( 0, 800, 0 );
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
    }
}