function GameState(){
    this.objects = {};
}

GameState.prototype.addObject = function(object){
    this.objects[object.getId()] = object;
};

GameState.prototype.serialize = function(){
    var currentGameState = {objects: {}};

    for(var objectIndex in this.objects){
        var object = this.objects[objectIndex],
            objectName = object.getId();

        currentGameState.objects[objectName] = {
            id: objectName,
            position: object.getPosition().serialize()
        }
    }

    return currentGameState;
};

GameState.prototype.updateObject = function(specification){
    this.objects[specification.id].setPosition(specification.position);
};

GameState.prototype.updateAllObjects = function(){
    for(var objectIndex in this.objects){
        this.objects[objectIndex].update();
    }
};