function Communicator(dataChannels, messageHandler){
    this.dataChannels = dataChannels;

    for(var receiverId in this.dataChannels){
        var dataChannel = dataChannels[receiverId];
        this.registerDataChannelEvents(receiverId, dataChannel, messageHandler)
    }
}

Communicator.prototype.registerDataChannelEvents = function(receiverId, dataChannel, messageHandler){
    dataChannel.registerOnMessage(function(packet){
        messageHandler[packet.messageType](receiverId, packet.data);
    });

    dataChannel.registerOnConnect(function(){
        messageHandler.playerConnected(receiverId);
    });

    dataChannel.registerOnDisconnect(function(){
        messageHandler.playerDisconnected(receiverId);
    });

    dataChannel.registerOnError(function(){
        messageHandler.communicationError(receiverId);
    });
};

Communicator.prototype.broadcast = function(messageType, data){
    var receiverId;
    if(typeof data === 'function'){
        for(receiverId in this.dataChannels){
            this.dataChannels[receiverId].send({
                messageType: messageType,
                data: data(receiverId)
            });
        }
    }
    else{
        for(receiverId in this.dataChannels){
            this.dataChannels[receiverId].send({
                messageType: messageType,
                data: data
            });
        }
    }
};