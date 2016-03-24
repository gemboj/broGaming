function GameState(){
    this.objects = [];
}

GameState.prototype.addObject = function(object){
    this.objects.push(object);
};

GameState.prototype.serialize = function(){
    var currentGameState = {objects: {}};

    for(var objectIndex in this.objects){
        var object = this.objects[objectIndex],
            objectName = object.getName();

        currentGameState.objects[objectName] = {
            name: objectName,
            position: object.getPosition()
        }
    }

    return currentGameState;
};

GameState.prototype.updateObject = function(specification){
    this.objects[specification.name].setPosition(specification.position);
};