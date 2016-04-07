function Communicator(dataChannels){
    this.dataChannels = dataChannels;
}

Communicator.prototype.broadcast = function(data, messageType){
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