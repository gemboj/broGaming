function MainLoop(gameState, broadcast, loopInterval){
    this.gameState = gameState;
    this.broadcast = broadcast;

    this.loopInterval = loopInterval == undefined ? 50 : loopInterval;

    this.loopHandle = null;
}

MainLoop.prototype.start = function(){
    var that = this;
    this.loopHandle = setInterval(function(){
        //TODO call gamestate updateAll with delta time

        var gameStateData = that.gameState.serialize();

        that.broadcast("gameStateUpdate", gameStateData);
    }, this.loopInterval);
};

MainLoop.prototype.stop = function(){
    clearInterval(this.loopHandle);
};