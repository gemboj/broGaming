function Scene(visualSceneAdapter){
    this.visualSceneAdapter = visualSceneAdapter;
}

Scene.prototype.update = function(specification){
    for(var playerId in specification.players){
        this.visualSceneAdapter.updateObject(playerId, specification.players[playerId]);
    }

    for(var objectId in specification.objects){
        this.visualSceneAdapter.updateObject(objectId, specification.objects[objectId]);
    }
};