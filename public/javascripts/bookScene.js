/**
* Created by Aibek on 11/26/13.
*/

var BOOK = new BOOK();
function BOOK() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // private variables
    var frontCover;
    var backCover;
    var pageRight1;
    var pageLeft1;
    var pageRight2;
    var pageLeft2;
    var floor;
    var light;

    var bookLoaded = false;
    var currentPage = 10;

    var modelElements = [];

    this.isLoaded = false;

    this.load = function ()
    {
        initGeometry();
        initLights();
        initPDF(pageRight1, currentPage++);
        this.isLoaded = true;
    }

    this.unload = function ()
    {
        CORE.disposeSceneElements(modelElements);

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
            if (object === pageRight1)
            {
                initPDF(pageLeft1, currentPage++);
                initPDF(pageRight2, currentPage++);
                flipPage(pageRight1);
                flipPage(pageLeft1);
            }
//            if (object === pageLeft1)
//            {
//                initPDF(pageRight2, 3);
//            }
            if (object === pageRight2)
            {
                initPDF(pageLeft2, currentPage++);
                flipPage(pageRight2);
                flipPage(pageLeft2);
            }
//            object.material.color.setHex(Math.random() * 0xffffff);
        }
    }

    function initGeometry() {
        // making a floor - just a plane 500x500, with 10 width/height segments - they affect lightning/reflection I believe
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 10, 10),
            new THREE.MeshLambertMaterial({color: 0x1103ff}));    // color
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        floor.position.y = -25;                                   // move it a little, to match bottom of the cube
        CORE.scene.add(floor);
        modelElements.push(floor);
    }

    function initLights() {
        light = new THREE.SpotLight();
        light.position.set(0, 500, 0);
        light.intensity = 2.0;
        light.castShadow = true;
        CORE.scene.add(light);
        modelElements.push(light);
    }

    function loadPage(object, canvas) {
        console.log("Loading page. Book loaded: " + bookLoaded);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var canvasMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});

        object.material = canvasMaterial;
    }

    function initPDF(object, pageNumber) {
        PDFJS.getDocument('home/pdfs/crackcode.pdf').then(function(pdf) {
            // Using promise to fetch the page
            pdf.getPage(pageNumber).then(function(page) {
                var scale = 1;
                var viewport = page.getViewport(scale);

                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (!bookLoaded)
                {
                    initPages(canvas);
                    object = pageRight1;
                }

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext);
                setTimeout(function(){
                    loadPage(object, canvas);
                }, 1000);
            });
        });
    }

    function initPages(canvas)
    {
        var coverTexture = new THREE.ImageUtils.loadTexture('/images/bookCover.jpg', {}, function () {
            CORE.renderer.render(CORE.scene, CORE.camera);
        });
        coverTexture.wrapS = coverTexture.wrapT = THREE.RepeatWrapping;
        coverTexture.repeat.set(1, 1);
        var coverMaterial = new THREE.MeshLambertMaterial({map: coverTexture, side: THREE.DoubleSide});

        pageRight1 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height, 1, 1), coverMaterial);            // supply color of the cube
        pageRight1.position.set(0, 12, 0);
        pageRight1.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        pageRight1.rotation.z = Math.PI;
        pageRight1.castShadow = true;
        pageRight1.receiveShadow = true;
        pageRight1.scale.set(0.1, 0.1, 0.1);
        CORE.scene.add(pageRight1);
        CORE.intersectObjects.push(pageRight1);
        modelElements.push(pageRight1);

        pageLeft1 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height, 1, 1), coverMaterial);
        pageLeft1.position.set(0, 11, 0);
        pageLeft1.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        pageLeft1.rotation.y = Math.PI;                         // since it is left page, it need to display inverted
        pageLeft1.rotation.z = Math.PI;
        pageLeft1.castShadow = true;
        pageLeft1.receiveShadow = true;
        pageLeft1.scale.set(0.1, 0.1, 0.1);
        CORE.scene.add(pageLeft1);
        CORE.intersectObjects.push(pageLeft1);
        modelElements.push(pageLeft1);

        pageRight2 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height, 1, 1), coverMaterial);
        pageRight2.position.set(0, 10, 0);
        pageRight2.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        pageRight2.rotation.z = Math.PI;
        pageRight2.castShadow = true;
        pageRight2.scale.set(0.1, 0.1, 0.1);
        CORE.scene.add(pageRight2);
        CORE.intersectObjects.push(pageRight2);
        modelElements.push(pageRight2);

        pageLeft2 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height, 1, 1), coverMaterial);
        pageLeft2.position.set(0, 9, 0);
        pageLeft2.rotation.x = -Math.PI / 2;                    // make it horizontal, by default planes are vertical
        pageLeft2.rotation.y = Math.PI;                         // since it is left page, it need to display inverted
        pageLeft2.rotation.z = Math.PI;
        pageLeft2.castShadow = true;
        pageLeft2.receiveShadow = true;
        pageLeft2.scale.set(0.1, 0.1, 0.1);
        CORE.scene.add(pageLeft2);
        CORE.intersectObjects.push(pageLeft2);
        modelElements.push(pageLeft2);

        bookLoaded = true;
        console.log("Hey there, switched bookLoaded to: " + bookLoaded);
    }

    function flipPage(object) {
        var animation = true;
        var initPosY = object.position.y;
        var initRotY = object.rotation.y;

        setTimeout(stopAnimation, 1000);
        animateFlip();

        function animateFlip()
        {
            if (animation === true)
            {
                object.rotation.y += Math.PI / 40;
                object.position.x += 1.5 * object.geometry.width * object.scale.x / 40;
                object.position.y = initPosY + Math.sin(object.rotation.y);
                setTimeout(animateFlip, 25);
            }
        }

        function stopAnimation()
        {
            animation = false;
            object.rotation.y = initRotY + Math.PI;
            object.position.y = 20 - initPosY;
        }
    }
}