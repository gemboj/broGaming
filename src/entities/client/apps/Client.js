function Client(dataChannel, showInfo){
    var that = this;

    this.isStarted = false;
    this.playerNumber = null;

    dataChannel.registerOnConnect(function(){

    });

    dataChannel.registerOnDisconnect(function(){

    });

    dataChannel.registerOnError(function(){

    });

    dataChannel.registerOnMessage(this.receive);
}

Client.prototype.send = function(type, data){
    var packet = {type: type, data: data};

    this.dataChannels[username].send(packet);
};

Client.prototype.receive = function(packet){
    this[packet.type](packet.data);
};