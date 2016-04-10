function GameState(playersId, communicator, mainLoop, scene){
    this.communicator = communicator;

    this.playersId = playersId;
    this.numberOfConnectedPlayers = 0;
    this.numberOfReadyToStartPlayers = 0;

    this.scene = scene;
    this.mainLoop = mainLoop;

    this.communicator.registerMessageHandler(this);
}

GameState.prototype.playerConnected = function(connectedPlayerId){
    var that = this;

    this.numberOfConnectedPlayers++;

    if(this.numberOfConnectedPlayers == this.playersId.length){
        this.mainLoop.start();
        //TODO send all serialized data instead of only players
        //this.communicator.broadcast('start', )
        this.communicator.broadcast('start', function(currentPlayerId){
            return {playersCount: that.playersId.length, playerId: currentPlayerId, sceneData: that.scene.serialize().players}
        })
    }
};

GameState.prototype.playerDisconnected = function(playerId){

};

GameState.prototype.connectionError = function(playerId){
    var indexOfPlayer = this.playersId.indexOf(playerId);

    this.playersId = this.playersId.slice(indexOfPlayer, 1);
};

GameState.prototype.updatePlayer = function(playerId, data){
    this.scene.updatePlayer(playerId, data);
};

GameState.prototype.playerReadyToStart = function(playerId){
    this.numberOfReadyToStartPlayers++;

    if(this.numberOfReadyToStartPlayers == this.numberOfConnectedPlayers){
        //start game
    }
};