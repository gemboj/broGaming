function MessageHandler(gameState){
    this.gameState = gameState;
}

MessageHandler.prototype.playerUpdate = function(sender, data){
    this.gameState.deserializePlayer(sender, data);
};