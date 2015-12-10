function ClientBase(dataChannel, showInfo){
    var that = this;

    this.isStarted = false;
    this.playerNumber = null;

    this.dataChannel = dataChannel;

    dataChannel.registerOnConnect(function(){

    });

    dataChannel.registerOnDisconnect(function(){

    });

    dataChannel.registerOnError(function(){

    });

    dataChannel.registerOnMessage(function(){
        that.receive.apply(that, arguments);
    });
}

ClientBase.prototype.send = function(type, data){
    var packet = {type: type, data: data};

    this.dataChannel.send(packet);
};

ClientBase.prototype.receive = function(packet){
    this[packet.type](packet.data);
};