function ClientStateSendLoop(clientState, communicator){
    this.loopHandle;
    this.communicator = communicator;
    this.clientState = clientState;

    clientState.registerOnStateChange(function(){
        communicator.send("updatePlayer", clientState.serialize());
    })
}

ClientStateSendLoop.prototype.start = function(){
    var that = this;

    this.loopHandle =  setInterval(function(){
        var state  = that.clientState.serialize();
    }, 500);
};

ClientStateSendLoop.prototype.stop = function(){
    clearInterval(this.loopHandle);
};