function Scene(visualSceneAdapter){
    this.visualSceneAdapter = visualSceneAdapter;
}

Scene.prototype.update = function(specification){
    //TODO update all objects

    for(var objectId in specification.players){
        this.visualSceneAdapter.updateObject(objectId, specification.players[objectId]);
    }
};