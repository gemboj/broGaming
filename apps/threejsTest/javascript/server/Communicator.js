function Communicator(dataChannels){
    this.dataChannels = dataChannels;

    this.ackId = 0;
    this.ackAwaitingMessages = {};

    this.messageHandler = undefined;
}



Communicator.prototype.registerMessageHandler = function(messageHandler){
    this.messageHandler = messageHandler;

    for(var receiverId in this.dataChannels){
        var dataChannel = this.dataChannels[receiverId];

        this.registerDataChannelEvents(receiverId, dataChannel);
    }
};

Communicator.prototype.registerDataChannelEvents = function(receiverId, dataChannel){
    var that = this;

    dataChannel.registerOnMessage(function(packet){
        if(packet.type == "ack"){
            var ackData = that.ackAwaitingMessages[packet.ackType];

            if(!ackData){
                return;
            }

            delete ackData.receiverSend[receiverId];

            if(Object.keys(ackData.receiverSend).length == 0){
                clearInterval(ackData.intervalHandle);
                ackData.resolve();
                delete that.ackAwaitingMessages[packet.ackType];
            }
        }
        else{
            that.messageHandler[packet.type](receiverId, packet.data);
        }
    });

    dataChannel.registerOnConnect(function(){
        that.messageHandler.playerConnected(receiverId);
    });

    dataChannel.registerOnDisconnect(function(){
        delete that.dataChannels[receiverId];
        that.messageHandler.playerDisconnected(receiverId);
    });

    dataChannel.registerOnError(function(){
        that.messageHandler.communicationError(receiverId);
    });
};

Communicator.prototype.addDataChannel = function(receiverId, dataChannel){
    this.dataChannels[receiverId] = dataChannel;

    this.registerDataChannelEvents(receiverId, dataChannel);
}

Communicator.prototype.broadcast = function(messageType, data){
    var receiverId;

    if(typeof data === 'function'){
        for(receiverId in this.dataChannels){
            this.dataChannels[receiverId].send({
                type: messageType,
                data: data(receiverId)
            });
        }
    }
    else{
        for(receiverId in this.dataChannels){
            this.dataChannels[receiverId].send({
                type: messageType,
                data: data
            });
        }
    }
};

Communicator.prototype.broadcastWithDeliverPromise = function(messageType, data){
    var that = this;

    return new Promise(function(resolve, reject){

        var receiverId;

        var ackData = {
            receiverSend: {},
            resolve: resolve,
            reject: reject,
            id: that.ackId++
        };

        for(receiverId in that.dataChannels){
            var receiverData = (typeof data === 'function') ? data(receiverId) : data,
                dataChannel = that.dataChannels[receiverId],
                packet = {
                    type: messageType,
                    ack: true,
                    data: receiverData,
                    id: ackData.id
                };

            ackData.receiverSend[receiverId] = that.createSendFunction(dataChannel, packet);
        }

        ackData.intervalHandle = setInterval(function(){
            for(var receiverIndex in ackData.receiverSend){
                ackData.receiverSend[receiverIndex]();
            }
        }, 1000);

        that.ackAwaitingMessages[messageType] = ackData;
    });
};

Communicator.prototype.createSendFunction = function(dataChannel, packet){
    return function(){
        dataChannel.send(packet);
    }
};

Communicator.prototype.close = function(){
    for(var channelIndex in this.dataChannels){
        var channel = this.dataChannels[channelIndex];

        channel.close();

        delete this.dataChannels[channelIndex];
    }
};