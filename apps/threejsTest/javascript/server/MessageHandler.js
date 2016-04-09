function MessageHandler(gameState){
    this.gameState = gameState;
}

MessageHandler.prototype.playerUpdate = function(sender, data){
    this.gameState.deserializePlayer(sender, data);
};

MessageHandler.prototype.connected = function(sender){
    this.gameState.deserializePlayer(sender, data);
};

MessageHandler.prototype.disconnected = function(sender){
    this.gameState.deserializePlayer(sender, data);
};

MessageHandler.prototype.error = function(sender){
    this.gameState.deserializePlayer(sender, data);
};