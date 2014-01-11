/**
 * Created by Aibek on 10.01.14.
 */

function Item () {
    this.name = name;
    this.object = new THREE.Object3D();
}

Item.prototype.addToObject = function(subObject){
    this.object.add(subObject);
}

Item.prototype.moveItemOffset = function(x, y, z){
    this.object.position.x += x;
    this.object.position.y += y;
    this.object.position.z += z;
}

Item.prototype.rotateItemOffset = function(x, y, z){
    this.object.rotation.x += x;
    this.object.rotation.y += y;
    this.object.rotation.z += z;
}

Item.prototype.moveItemAbsolute = function(x, y, z){
    this.object.position.x = x;
    this.object.position.y = y;
    this.object.position.z = z;
}

Item.prototype.rotateItemAbsolute = function(x, y, z){
    this.object.rotation.x = x;
    this.object.rotation.y = y;
    this.object.rotation.z = z;
}

Item.prototype.load = function() {
    CORE.load(this.object);
}