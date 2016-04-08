function GameState(){
    this.objects = {};
    this.players = {};
}

GameState.prototype.addObject = function(object){
    this.objects[object.getId()] = object;
};

GameState.prototype.addPlayer = function(player){
    this.players[player.getId()] = player;
};

GameState.prototype.serialize = function(){
    var currentGameState = {
        objects: this.serializeObjectType("objects"),
        players: this.serializeObjectType("players")
    };

    return currentGameState;
};

GameState.prototype.serializeObjectType = function(type){
    var objects = this[type],
        serializedObjects = {};

    for(var objectId in objects){
        serializedObjects[objectId] = objects[objectId].serialize();
    }

    return serializedObjects;
};

GameState.prototype.deserializeObject = function(objectId, specification){
    this.objects[objectId].deserialize(specification);
};

GameState.prototype.deserializePlayer = function(playerId, specification){
    this.players[playerId].deserialize(specification);
};

GameState.prototype.updateAll = function(deltaTime){
    for(var objectIndex in this.objects){
        this.objects[objectIndex].update(deltaTime);
    }
};