function Communicator(dataChannel){
    this.dataChannel = dataChannel;
    this.messageHandler = {};
}

Communicator.prototype.registerMessageHandler = function(messageHandler){
    this.dataChannel.registerOnMessage(function(packet){
        messageHandler[packet.type](packet.data);
    });

    this.dataChannel.registerOnConnect(function(){
        messageHandler.onConnect();
    });

    this.dataChannel.registerOnDisconnect(function(){
        messageHandler.onDisconnect();
    });

    this.dataChannel.registerOnError(function(){
        messageHandler.onError();
    });
};

Communicator.prototype.send = function(type, data){
    this.dataChannel.send({type: type, data: data});
};
