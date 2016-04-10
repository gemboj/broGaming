function Scene(){
    this.objects = {};
    this.players = {};
}

Scene.prototype.addObject = function(object){
    this.objects[object.getId()] = object;
};

Scene.prototype.addPlayer = function(player){
    this.players[player.getId()] = player;
};

Scene.prototype.serialize = function(){
    var currentGameState = {
        objects: this.serializeObjectType("objects"),
        players: this.serializeObjectType("players")
    };

    return currentGameState;
};

Scene.prototype.serializeObjectType = function(type){
    var objects = this[type],
        serializedObjects = {};

    for(var objectId in objects){
        serializedObjects[objectId] = objects[objectId].serialize();
    }

    return serializedObjects;
};

Scene.prototype.updatePlayer = function(playerId, specification){
    this.players[playerId].deserialize(specification);
};

Scene.prototype.update = function(deltaTime){
    for(var objectIndex in this.objects){
        this.objects[objectIndex].update(deltaTime);
    }
};