function MessageHandler(gameState){
    this.gameState = gameState;
}

MessageHandler.prototype.playerUpdate = function(sender, data){
    this.gameState.deserializePlayer(sender, data);
};

MessageHandler.prototype.connected = function(sender){
    this.gameState.playerConnected(sender);
};

MessageHandler.prototype.disconnected = function(sender){
    this.gameState.playerDisconnected(sender);
};

MessageHandler.prototype.error = function(sender){
    this.gameState.communicationError(sender);
};