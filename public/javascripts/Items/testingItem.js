/**
 * Created by Aibek on 10.01.14.
 */

function TestingItem() {
    // Call the parent constructor
    Item.call(this);

    var cube = new THREE.Mesh(
        new THREE.CubeGeometry(100, 100, 100),
        new THREE.MeshPhongMaterial({color: 0xffff11}));
//    cube.receiveShadow = true;

    this.addToObject(cube);
    this.load();
}

// inherit Item
TestingItem.prototype = new Item();

// correct the constructor pointer because it points to Item
TestingItem.prototype.constructor = Item;
