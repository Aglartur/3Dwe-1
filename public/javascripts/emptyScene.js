/**
 * Created by Aibek on 11/28/13.
 */

var EMPTY = new EMPTY();

function EMPTY() {
    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    this.isLoaded = false;

    this.load = function () {
        this.isLoaded = true;
    }

    this.unload = function () {
        this.isLoaded = false;
    }

    this.onDocumentMouseDown = function(event){

    }
}