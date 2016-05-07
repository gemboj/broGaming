function Communicator(dataChannel){
    this.dataChannel = dataChannel;
    this.messageHandler = {};

    this.receivedAckMessages = {};
}

Communicator.prototype.registerMessageHandler = function(messageHandler){
    var that = this;

    this.dataChannel.registerOnMessage(function(packet){
        if(packet.ack){
            if(that.receivedAckMessages[packet.id] == undefined){
                messageHandler[packet.type](packet.data);
            }

            that.receivedAckMessages[packet.id] = true;
            that.sendAck(packet.type);
        }
        else{
            messageHandler[packet.type](packet.data);
        }

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

Communicator.prototype.sendAck = function(type){
    this.dataChannel.send({type: "ack", ackType: type});
};
