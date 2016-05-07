function GameState(playersId, communicator, mainLoop, scene, showInfo){
    this.communicator = communicator;
    this.showInfo = showInfo;

    this.playersId = playersId;
    this.numberOfConnectedPlayers = 0;
    //this.numberOfReadyToStartPlayers = 0;

    this.disconnectedPlayers = [];

    this.scene = scene;
    this.mainLoop = mainLoop;

    this.isActive = false;

    this.communicator.registerMessageHandler(this);
}

GameState.prototype.playerConnected = function(connectedPlayerId){
    var playerIndex = this.disconnectedPlayers.indexOf(connectedPlayerId);

    if(playerIndex != -1){
        this.playerReconnected(connectedPlayerId);
    }
    else{
        this.newPlayerConnected(connectedPlayerId);
    }
};

GameState.prototype.newPlayerConnected = function(playerId){
    this.numberOfConnectedPlayers++;

    if(this.numberOfConnectedPlayers == this.playersId.length){
        this.sendStartMessage();
    }
};

GameState.prototype.playerReconnected = function(playerIndex){
    this.disconnectedPlayers.splice(playerIndex, 1);

    if(this.disconnectedPlayers.length == 0){
        this.sendStartMessage();
    }
};

GameState.prototype.sendStartMessage = function(){
    var that = this;

    this.communicator.broadcastWithDeliverPromise("start",  function(currentPlayerId){
            return {playersCount: that.playersId.length, playerId: currentPlayerId, sceneData: that.scene.serialize()}
        })
        .then(function(){
            that.mainLoop.start();
            that.isActive = true;
        })
};

GameState.prototype.playerDisconnected = function(playerId){
    this.mainLoop.stop();

    this.isActive = false;

    this.disconnectedPlayers.push(playerId);

    this.showInfo("Player disconnected: "+ playerId);

    this.communicator.broadcastWithDeliverPromise('pause', playerId + " disconnected");
};

GameState.prototype.connectionError = function(playerId){
    var indexOfPlayer = this.playersId.indexOf(playerId);

    this.playersId = this.playersId.slice(indexOfPlayer, 1);
};

GameState.prototype.updatePlayer = function(playerId, data){
    if(this.isActive){
        this.scene.updatePlayer(playerId, data);
    }
};

GameState.prototype.hasPlayerDisconnected = function(playerId){
    var playerIndex = this.disconnectedPlayers.indexOf(playerId);

    return playerIndex != -1;

};

GameState.prototype.close = function(){
    this.communicator.close();
    this.mainLoop.stop();
};
/*GameState.prototype.playerReadyToStart = function(playerId){
    this.numberOfReadyToStartPlayers++;

    if(this.numberOfReadyToStartPlayers == this.numberOfConnectedPlayers){
        //start game
    }
};*/