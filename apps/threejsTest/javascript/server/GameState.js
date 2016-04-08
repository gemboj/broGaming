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
        objects: this.serializeObjects(),
        players: this.serializePlayers()
    };

    return currentGameState;
};

GameState.prototype.serializeObjects = function(){
    var objects = {};

    for(var objectIndex in this.objects){
        var object = this.objects[objectIndex],
            objectId = object.getId();

        objects[objectId] = {
            id: objectId,
            position: object.getPosition().serialize()
        }
    }

    return objects;
};

GameState.prototype.serializePlayers = function(){
    var players = {};

    for(var playerIndex in this.players){
        var player = this.players[playerIndex],
            playerId = player.getId();

        players[playerId] = {
            id: playerId,
            position: player.getPosition().serialize()
        }
    }

    return players;
};

GameState.prototype.updateObject = function(specification){
    this.objects[specification.id].setPosition(specification.position);
};

GameState.prototype.updatePlayer = function(specification){
    this.players[specification.id].setPosition(specification.position);
};

GameState.prototype.updateAll = function(){
    for(var objectIndex in this.objects){
        this.objects[objectIndex].update();
    }
};