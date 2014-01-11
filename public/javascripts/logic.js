/**
 * Created by Aibek on 11.01.14.
 */

function Logic ()
{

}

Logic.prototype.load = function () {
    throw new Error('Logic#load needs to be overridden.')
}

Logic.prototype.unload = function () {
    throw new Error('Logic#unload needs to be overridden.')
}