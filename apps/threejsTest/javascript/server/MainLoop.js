function MainLoop(gameState, broadcastGameStateUpdate, loopInterval){
    this.gameState = gameState;
    this.broadcast = broadcastGameStateUpdate;

    this.loopInterval = loopInterval == undefined ? 50 : loopInterval;

    this.loopHandle = null;
}

MainLoop.prototype.start = function(){
    var that = this;
    this.loopHandle = setInterval(function(){
        var gameStateData = that.gameState.serialize();

        that.broadcast(gameStateData);
    }, this.loopInterval);
};

MainLoop.prototype.stop = function(){
    clearInterval(this.loopHandle);
};