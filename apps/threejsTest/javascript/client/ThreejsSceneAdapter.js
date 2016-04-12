function ThreejsSceneAdapter(threejsScene){
    this.threejsScene = threejsScene;
}

ThreejsSceneAdapter.prototype.updateObject = function(objectId, specification){
    var object = this.threejsScene.getObjectByName(objectId),
        position = object.position;

    position.x = specification.position.x;
    position.y = specification.position.y;
    position.z = specification.position.z;
};