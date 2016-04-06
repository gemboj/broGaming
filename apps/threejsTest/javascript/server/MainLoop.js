function MainLoop(gameState, broadcast){
    this.gameState = gameState;
    this.broadcast = broadcast;

    this.loopHandle = null;
}

MainLoop.prototype.start = function(){
    var that = this;
    this.loopHandle = setInterval(function(){
        var gameStateData = that.gameState.serialize();

        that.broadcast(gameStateData);
    }, 10);
};

MainLoop.prototype.stop = function(){
    clearInterval(this.loopHandle);
};