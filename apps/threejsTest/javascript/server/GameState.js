function GameState(playersId, communicator, mainLoop, scene){
    this.communicator = communicator;

    this.playersId = playersId;
    this.numberOfConnectedPlayers = 0;

    this.scene = scene;
    this.mainLoop = mainLoop;

    this.communicator.registerMessageHandler(this);
}

GameState.prototype.playerConnected = function(playerId){
    this.numberOfConnectedPlayers++;

    if(this.numberOfConnectedPlayers == this.playersId.length){
        this.mainLoop.start();
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